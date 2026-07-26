import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

// GET: debug — visit /api/tryon in browser to see available endpoints
export async function GET() {
  const { Client } = await import('@gradio/client')
  try {
    const client = await Client.connect('yisol/IDM-VTON')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const api = await (client as any).view_api()
    return NextResponse.json({ space: 'yisol/IDM-VTON', api })
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) })
  }
}

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

    let garmentBlob: Blob = personBlob
    if (garmentUrl) {
      const absUrl = garmentUrl.startsWith('http')
        ? garmentUrl
        : `${req.nextUrl.protocol}//${req.headers.get('host')}${garmentUrl.startsWith('/') ? '' : '/'}${garmentUrl}`
      const r = await fetch(absUrl)
      garmentBlob = await r.blob()
    }

    console.log('[tryon] connecting to yisol/IDM-VTON...')
    const client = await Client.connect('yisol/IDM-VTON')
    console.log('[tryon] connected, calling /tryon...')

    // IDM-VTON /tryon: dict(ImageEditor), garm_img, garment_des,
    //                   is_checked, is_checked_crop, denoise_steps, seed
    const result = await client.predict('/tryon', [
      { background: personBlob, layers: [], composite: null }, // ImageEditor dict
      garmentBlob,
      'stylish oversized graphic streetwear tee',
      true,   // is_checked
      false,  // is_checked_crop
      30,     // denoise_steps
      42,     // seed
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultData = (result?.data as any[]) ?? []
    console.log('[tryon] output[0]:', JSON.stringify(resultData[0]).slice(0, 200))

    const outData = resultData[0]
    const tryonUrl: string | null =
      typeof outData === 'string'
        ? outData
        : outData?.url ?? (outData?.path ? `https://yisol-idm-vton.hf.space/file=${outData.path}` : null)

    if (!tryonUrl) {
      return NextResponse.json({ error: 'No output — try again in 60 sec (model may be warming up)' }, { status: 500 })
    }

    const imgRes = await fetch(tryonUrl.startsWith('http') ? tryonUrl : `https://yisol-idm-vton.hf.space/file=${tryonUrl}`)
    const imgBuf = await imgRes.arrayBuffer()
    const b64 = Buffer.from(imgBuf).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${b64}` })

  } catch (err: unknown) {
    console.error('[tryon] FATAL:', JSON.stringify(err, null, 2))
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null
          ? JSON.stringify(err)
          : String(err)

    if (msg.includes('503') || msg.includes('loading') || msg.includes('waking') || msg.includes('sleeping')) {
      return NextResponse.json({ error: 'Model warming up — wait 60 sec and retry' }, { status: 503 })
    }
    return NextResponse.json({ error: msg.slice(0, 300) }, { status: 500 })
  }
}
