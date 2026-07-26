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

    // Fetch garment image if provided
    let garmentBlob: Blob
    if (garmentUrl) {
      const res = await fetch(garmentUrl)
      garmentBlob = await res.blob()
    } else {
      // Use a plain white placeholder if no garment image uploaded yet
      garmentBlob = personBlob // fallback, IDM-VTON will handle it
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const opts: any = {}
    if (process.env.HF_TOKEN) opts.hf_token = process.env.HF_TOKEN
    const client = await Client.connect('yisol/IDM-VTON', opts)

    const result = await client.predict('/tryon', {
      dict: { background: personBlob, layers: [], composite: null },
      garm_img: garmentBlob,
      garment_des: 'stylish oversized graphic t-shirt, streetwear',
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42,
    })

    const data = result.data as [{ url: string }, unknown]
    const tryonUrl = data[0]?.url

    if (!tryonUrl) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
    }

    // Proxy the image through our server to avoid CORS issues on canvas
    const imgRes = await fetch(tryonUrl)
    const imgBuffer = await imgRes.arrayBuffer()
    const base64 = Buffer.from(imgBuffer).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${base64}` })

  } catch (err: unknown) {
    console.error('[tryon]', err)
    const msg = err instanceof Error ? err.message : String(err)
    // Space may be sleeping — give a helpful hint
    if (msg.includes('503') || msg.includes('loading')) {
      return NextResponse.json({ error: 'AI model is warming up, try again in 60 seconds' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Processing failed, please try again' }, { status: 500 })
  }
}
