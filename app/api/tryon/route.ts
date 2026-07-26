import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const personFile = formData.get('person') as File | null
    const garmentUrl = formData.get('garmentUrl') as string | null

    if (!personFile) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 })
    }

    const { Client } = await import('@gradio/client')

    const personBuffer = await personFile.arrayBuffer()
    const personBlob = new Blob([personBuffer], { type: personFile.type })

    let garmentBlob: Blob
    if (garmentUrl) {
      // Convert relative URL to absolute for server-side fetch
      const absUrl = garmentUrl.startsWith('http')
        ? garmentUrl
        : `${req.nextUrl.protocol}//${req.headers.get('host')}${garmentUrl.startsWith('/') ? '' : '/'}${garmentUrl}`
      const res = await fetch(absUrl)
      garmentBlob = await res.blob()
    } else {
      garmentBlob = personBlob
    }

    // Try Nymbo/Virtual-Try-On (CatVTON based, more reliable)
    const client = await Client.connect('Nymbo/Virtual-Try-On')

    const result = await client.predict('/tryon_fn', [
      personBlob,                  // person image
      garmentBlob,                 // garment image
      'stylish oversized graphic streetwear t-shirt', // description
      true,                        // is_checked
      true,                        // is_checked_crop
      30,                          // denoise steps
      42,                          // seed
    ])

    const data = result.data as [{ url: string } | string, unknown]
    const raw = data[0]
    const tryonUrl = typeof raw === 'string' ? raw : raw?.url

    if (!tryonUrl) {
      return NextResponse.json({ error: 'AI model returned no result — try again in 30 seconds' }, { status: 500 })
    }

    // Proxy image to avoid CORS on canvas
    const imgRes = await fetch(tryonUrl)
    const imgBuffer = await imgRes.arrayBuffer()
    const base64 = Buffer.from(imgBuffer).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${base64}` })

  } catch (err: unknown) {
    console.error('[tryon]', err)
    const msg = err instanceof Error ? err.message : String(err)

    if (msg.includes('503') || msg.includes('loading') || msg.includes('waking')) {
      return NextResponse.json({ error: 'AI model is warming up (free tier). Wait 60 seconds and try again.' }, { status: 503 })
    }
    if (msg.includes('timeout') || msg.includes('ETIMEDOUT')) {
      return NextResponse.json({ error: 'Request timed out — AI is busy. Try again in a moment.' }, { status: 504 })
    }

    return NextResponse.json({ error: `Processing failed: ${msg.slice(0, 120)}` }, { status: 500 })
  }
}
