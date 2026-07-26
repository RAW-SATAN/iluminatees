import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'REPLICATE_API_TOKEN not set in Vercel env vars' }, { status: 500 })
  }

  try {
    const formData = await req.formData()
    const personFile = formData.get('person') as File | null
    const garmentUrl = formData.get('garmentUrl') as string | null

    if (!personFile) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 })
    }

    // Person image → base64 data URI
    const personBuffer = await personFile.arrayBuffer()
    const personBase64 = Buffer.from(personBuffer).toString('base64')
    const personDataUri = `data:${personFile.type || 'image/jpeg'};base64,${personBase64}`

    // Garment image → absolute public URL
    let garmImg: string = personDataUri // fallback
    if (garmentUrl) {
      garmImg = garmentUrl.startsWith('http')
        ? garmentUrl
        : `${req.nextUrl.protocol}//${req.headers.get('host')}${garmentUrl.startsWith('/') ? '' : '/'}${garmentUrl}`
    }

    // Start prediction — Prefer:wait holds connection until done (up to 55s)
    const startRes = await fetch('https://api.replicate.com/v1/models/cuuupid/idm-vton/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'wait=55',
      },
      body: JSON.stringify({
        input: {
          human_img: personDataUri,
          garm_img: garmImg,
          garment_des: 'stylish oversized graphic streetwear t-shirt',
          is_checked: true,
          is_checked_crop: false,
          denoise_steps: 30,
          seed: 42,
          category: 'upper_body',
        },
      }),
    })

    const prediction = await startRes.json()

    if (!startRes.ok) {
      throw new Error(prediction.detail ?? prediction.error ?? 'Replicate API error')
    }

    // Extract output URL (may already be done via Prefer:wait)
    let outputUrl: string | null = null
    const extractUrl = (out: unknown) =>
      Array.isArray(out) ? (out[0] as string) : typeof out === 'string' ? out : null

    outputUrl = extractUrl(prediction.output)

    // If still running, poll a few more times
    if (!outputUrl && prediction.id && ['starting', 'processing'].includes(prediction.status)) {
      for (let i = 0; i < 4; i++) {
        await new Promise(r => setTimeout(r, 4000))
        const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const p = await poll.json()
        if (p.status === 'failed') throw new Error(p.error ?? 'Generation failed')
        outputUrl = extractUrl(p.output)
        if (outputUrl) break
      }
    }

    if (!outputUrl) {
      return NextResponse.json({ error: 'Generation timed out — please try again' }, { status: 504 })
    }

    // Proxy result back (avoids CORS on canvas)
    const imgRes = await fetch(outputUrl)
    const imgBuf = await imgRes.arrayBuffer()
    const b64 = Buffer.from(imgBuf).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${b64}` })

  } catch (err: unknown) {
    console.error('[tryon]', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg.slice(0, 200) }, { status: 500 })
  }
}
