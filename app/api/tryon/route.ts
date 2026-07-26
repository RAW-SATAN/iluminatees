import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

const SPACE = 'Kwai-Kolors/Kolors-Virtual-Try-On'
const SPACE_URL = 'https://kwai-kolors-kolors-virtual-try-on.hf.space'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const personFile = formData.get('person') as File | null
    const garmentUrl = formData.get('garmentUrl') as string | null

    if (!personFile) {
      return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 })
    }

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

    // Upload files to Gradio space
    const uploadPerson = await uploadToSpace(SPACE_URL, personBlob, 'person.jpg')
    const uploadGarment = await uploadToSpace(SPACE_URL, garmentBlob, 'garment.jpg')

    // Call predict with fn_index 0 (first function in the space)
    const predictRes = await fetch(`${SPACE_URL}/run/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fn_index: 0,
        data: [
          { path: uploadPerson, meta: { _type: 'gradio.FileData' } },
          { path: uploadGarment, meta: { _type: 'gradio.FileData' } },
        ],
        event_data: null,
      }),
    })

    if (!predictRes.ok) {
      const txt = await predictRes.text()
      console.error('[tryon] predict failed', predictRes.status, txt.slice(0, 300))
      throw new Error(`Space error ${predictRes.status}: ${txt.slice(0, 120)}`)
    }

    const prediction = await predictRes.json()
    console.log('[tryon] raw prediction:', JSON.stringify(prediction).slice(0, 400))

    // Extract result URL from prediction data
    const outData = prediction?.data?.[0]
    const tryonUrl: string | null =
      typeof outData === 'string'
        ? outData
        : outData?.url ?? outData?.path
          ? `${SPACE_URL}/file=${outData.path}`
          : null

    if (!tryonUrl) {
      return NextResponse.json({ error: 'AI returned no result — try again' }, { status: 500 })
    }

    // Proxy image back
    const imgRes = await fetch(tryonUrl.startsWith('http') ? tryonUrl : `${SPACE_URL}/file=${tryonUrl}`)
    const imgBuf = await imgRes.arrayBuffer()
    const b64 = Buffer.from(imgBuf).toString('base64')
    const mime = imgRes.headers.get('content-type') ?? 'image/jpeg'

    return NextResponse.json({ image: `data:${mime};base64,${b64}` })

  } catch (err: unknown) {
    console.error('[tryon]', err)
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.includes('503') || msg.includes('loading')) {
      return NextResponse.json({ error: 'Model warming up — wait 60 sec and try again' }, { status: 503 })
    }
    return NextResponse.json({ error: msg.slice(0, 200) }, { status: 500 })
  }
}

async function uploadToSpace(spaceUrl: string, blob: Blob, filename: string): Promise<string> {
  const fd = new FormData()
  fd.append('files', blob, filename)
  const res = await fetch(`${spaceUrl}/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
  const json = await res.json()
  // Returns array of file paths
  const path = Array.isArray(json) ? json[0] : json
  console.log('[tryon] uploaded', filename, '->', path)
  return typeof path === 'string' ? path : path?.path ?? path?.name ?? ''
}
