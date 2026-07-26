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

    let garmentBlob: Blob = personBlob
    if (garmentUrl) {
      const absUrl = garmentUrl.startsWith('http')
        ? garmentUrl
        : `${req.nextUrl.protocol}//${req.headers.get('host')}${garmentUrl.startsWith('/') ? '' : '/'}${garmentUrl}`
      const r = await fetch(absUrl)
      garmentBlob = await r.blob()
    }

    const client = await Client.connect('Kwai-Kolors/Kolors-Virtual-Try-On')

    // Discover available API endpoints — will appear in Vercel logs
    let endpoint: string | number = 0
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const api = await (client as any).view_api()
      const named = Object.keys(api?.named_endpoints ?? {})
      const unnamed = api?.unnamed_endpoints?.length ?? 0
      console.log('[tryon] named_endpoints:', named)
      console.log('[tryon] unnamed_endpoints count:', unnamed)
      if (named.length > 0) endpoint = named[0]
    } catch (e) {
      console.log('[tryon] view_api failed:', e)
    }

    console.log('[tryon] using endpoint:', endpoint)

    const result = await client.predict(endpoint, [personBlob, garmentBlob])

    console.log('[tryon] result keys:', Object.keys(result ?? {}))
    console.log('[tryon] data[0]:', JSON.stringify(result?.data?.[0]).slice(0, 200))

    const outData = result?.data?.[0]
    const tryonUrl: string | null =
      typeof outData === 'string'
        ? outData
        : outData?.url ?? (outData?.path ? `https://kwai-kolors-kolors-virtual-try-on.hf.space/file=${outData.path}` : null)

    if (!tryonUrl) {
      return NextResponse.json({ error: 'No output from AI — check Vercel logs' }, { status: 500 })
    }

    const imgRes = await fetch(tryonUrl.startsWith('http') ? tryonUrl : `https://kwai-kolors-kolors-virtual-try-on.hf.space/file=${tryonUrl}`)
    const imgBuf = await imgRes.arrayBuffer()
    const b64 = Buffer.from(imgBuf).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${b64}` })

  } catch (err: unknown) {
    console.error('[tryon] FATAL:', err)
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('503') || msg.includes('loading')) {
      return NextResponse.json({ error: 'Model warming up — wait 60 sec and retry' }, { status: 503 })
    }
    return NextResponse.json({ error: msg.slice(0, 200) }, { status: 500 })
  }
}
