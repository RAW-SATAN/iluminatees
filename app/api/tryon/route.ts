import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

const SPACE_URL = 'https://yisol-idm-vton.hf.space'

// Upload a blob to the HF space, returns the remote file path
async function uploadFile(blob: Blob, filename: string): Promise<string> {
  const fd = new FormData()
  fd.append('files', blob, filename)
  const res = await fetch(`${SPACE_URL}/upload`, {
    method: 'POST',
    headers: process.env.HF_TOKEN ? { Authorization: `Bearer ${process.env.HF_TOKEN}` } : {},
    body: fd,
  })
  if (!res.ok) throw new Error(`Upload failed ${res.status}`)
  const json = await res.json()
  const path = Array.isArray(json) ? json[0] : json
  return typeof path === 'string' ? path : (path?.path ?? path?.name ?? '')
}

// Wrap a remote path into a Gradio FileData object
function fileData(path: string, name: string) {
  return { path, meta: { _type: 'gradio.FileData' }, orig_name: name, url: `${SPACE_URL}/file=${path}` }
}

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
    const mode = (formData.get('mode') as string | null) ?? 'user'

    const { Client } = await import('@gradio/client')

    let personBlob: Blob

    if (mode === 'model') {
      // Generate AI fashion model photo via pollinations.ai (free, no API key)
      const prompt = encodeURIComponent(
        'full body young person standing straight facing camera, plain white background, basic white t-shirt, professional fashion photography, studio lighting, 512x768'
      )
      const seed = Math.floor(Math.random() * 99999)
      const polUrl = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=768&nologo=true&seed=${seed}`
      console.log('[tryon] generating model photo from pollinations.ai...')
      const polRes = await fetch(polUrl)
      if (!polRes.ok) throw new Error(`Pollinations failed: ${polRes.status}`)
      const polBuf = await polRes.arrayBuffer()
      personBlob = new Blob([polBuf], { type: 'image/jpeg' })
      console.log('[tryon] model photo generated, size:', personBlob.size)
    } else {
      if (!personFile) {
        return NextResponse.json({ error: 'No photo uploaded' }, { status: 400 })
      }
      const personBuffer = await personFile.arrayBuffer()
      personBlob = new Blob([personBuffer], { type: personFile.type })
    }

    let garmentBlob: Blob = personBlob
    if (garmentUrl) {
      const absUrl = garmentUrl.startsWith('http')
        ? garmentUrl
        : `${req.nextUrl.protocol}//${req.headers.get('host')}${garmentUrl.startsWith('/') ? '' : '/'}${garmentUrl}`
      const r = await fetch(absUrl)
      garmentBlob = await r.blob()
    }

    console.log('[tryon] uploading images to space...')
    const [personPath, garmentPath] = await Promise.all([
      uploadFile(personBlob, 'person.jpg'),
      uploadFile(garmentBlob, 'garment.jpg'),
    ])
    console.log('[tryon] uploaded — person:', personPath, 'garment:', garmentPath)

    const client = await Client.connect('yisol/IDM-VTON')
    console.log('[tryon] connected, calling /tryon...')

    const result = await client.predict('/tryon', [
      // dict: ImageEditor — background must be FileData format
      { background: fileData(personPath, 'person.jpg'), layers: [], composite: null },
      fileData(garmentPath, 'garment.jpg'),   // garm_img
      'stylish oversized graphic streetwear tee', // garment_des
      true,   // is_checked (auto-masking)
      false,  // is_checked_crop
      30,     // denoise_steps
      42,     // seed
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out = (result?.data as any[])?.[0]
    console.log('[tryon] output:', JSON.stringify(out).slice(0, 200))

    const tryonUrl: string | null =
      typeof out === 'string'
        ? out
        : out?.url ?? (out?.path ? `${SPACE_URL}/file=${out.path}` : null)

    if (!tryonUrl) {
      return NextResponse.json({ error: 'No output — model may be warming up, try again in 60 sec' }, { status: 500 })
    }

    const imgRes = await fetch(tryonUrl.startsWith('http') ? tryonUrl : `${SPACE_URL}/file=${tryonUrl}`)
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
    if (msg.includes('503') || msg.includes('loading') || msg.includes('waking')) {
      return NextResponse.json({ error: 'Model warming up — wait 60 sec and retry' }, { status: 503 })
    }
    return NextResponse.json({ error: msg.slice(0, 300) }, { status: 500 })
  }
}
