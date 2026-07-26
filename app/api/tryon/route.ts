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

    // Garment image — fetch as blob
    let garmentBlob: Blob = personBlob
    if (garmentUrl) {
      const absUrl = garmentUrl.startsWith('http')
        ? garmentUrl
        : `${req.nextUrl.protocol}//${req.headers.get('host')}${garmentUrl.startsWith('/') ? '' : '/'}${garmentUrl}`
      const r = await fetch(absUrl)
      garmentBlob = await r.blob()
    }

    // Kwai-Kolors Virtual Try-On — corporate-backed, always warm, free
    const client = await Client.connect('Kwai-Kolors/Kolors-Virtual-Try-On')

    const result = await client.predict('/generate', [
      personBlob,   // model image (person)
      garmentBlob,  // garment image
    ])

    const data = result.data as [{ url: string } | string, ...unknown[]]
    const raw = data[0]
    const tryonUrl = typeof raw === 'string' ? raw : raw?.url

    if (!tryonUrl) {
      return NextResponse.json({ error: 'AI returned no result — try again' }, { status: 500 })
    }

    // Proxy image back to avoid CORS on canvas
    const imgRes = await fetch(tryonUrl)
    const imgBuf = await imgRes.arrayBuffer()
    const b64 = Buffer.from(imgBuf).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${b64}` })

  } catch (err: unknown) {
    console.error('[tryon]', err)
    const msg = err instanceof Error ? err.message : String(err)

    if (msg.includes('503') || msg.includes('loading') || msg.includes('waking')) {
      return NextResponse.json({ error: 'Model warming up — wait 60 sec and try again' }, { status: 503 })
    }
    return NextResponse.json({ error: msg.slice(0, 200) }, { status: 500 })
  }
}
