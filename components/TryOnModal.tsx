"use client";

import { useRef, useState } from "react";
import { X, Upload, Download, Loader2 } from "lucide-react";

interface Props {
  productName: string;
  garmentImageUrl: string | null;
  onClose: () => void;
}

type Stage = "upload" | "processing" | "result" | "error";

const TIPS = [
  "📸 Full body photo (head to toe)",
  "🧍 Stand straight, face camera",
  "☀️ Bright lighting, plain background",
  "❌ No selfies / close-ups",
];

// Creates a 4-sec Ken Burns video from a data-URI image using Canvas + MediaRecorder
function makeVideo(dataUri: string): Promise<{ blob: Blob; ext: string }> {
  return new Promise((resolve, reject) => {
    const W = 540, H = 720;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const img = new Image();
    img.onload = () => {
      // Pick best supported format — MP4 for Safari/iPhone, WebM for others
      const mimeType =
        MediaRecorder.isTypeSupported("video/mp4")
          ? "video/mp4"
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
            ? "video/webm;codecs=vp9"
            : "video/webm";
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const stream = canvas.captureStream(25);
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_500_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => resolve({ blob: new Blob(chunks, { type: mimeType }), ext });
      recorder.start(100);

      const FPS = 25, SECS = 4;
      const total = FPS * SECS;
      let frame = 0;

      // Fit image into canvas (cover)
      const imgAR = img.width / img.height;
      const canAR = W / H;
      let bw: number, bh: number;
      if (imgAR > canAR) { bh = H; bw = bh * imgAR; }
      else { bw = W; bh = bw / imgAR; }

      function draw() {
        const t = frame / total; // 0 → 1

        // Ken Burns: gentle zoom 1.0 → 1.08 → 1.0 + slow pan
        const zoom = 1 + 0.08 * Math.sin(t * Math.PI);
        const panX = Math.sin(t * Math.PI * 2) * 12;
        const panY = Math.sin(t * Math.PI) * -8;

        const dw = bw * zoom;
        const dh = bh * zoom;
        const dx = (W - dw) / 2 + panX;
        const dy = (H - dh) / 2 + panY;

        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(img, dx, dy, dw, dh);

        // Subtle vignette overlay
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
        vg.addColorStop(0, "rgba(0,0,0,0)");
        vg.addColorStop(1, "rgba(0,0,0,0.18)");
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);

        frame++;
        if (frame <= total) requestAnimationFrame(draw);
        else recorder.stop();
      }

      draw();
    };
    img.onerror = reject;
    img.src = dataUri;
  });
}

export function TryOnModal({ productName, garmentImageUrl, onClose }: Props) {
  const [stage, setStage] = useState<Stage>("upload");
  const [personFile, setPersonFile] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [tryonImage, setTryonImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoExt, setVideoExt] = useState<string>("mp4");
  const [statusMsg, setStatusMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile(file: File) {
    setPersonFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPersonPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) pickFile(f);
  }

  async function generate() {
    if (!personFile) return;
    setStage("processing");
    setStatusMsg("Sending to AI... (30-60 sec)");

    try {
      const fd = new FormData();
      fd.append("person", personFile);
      if (garmentImageUrl) fd.append("garmentUrl", garmentImageUrl);

      const res = await fetch("/api/tryon", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || !json.image) {
        throw new Error(json.error ?? "Unknown error");
      }

      setTryonImage(json.image);
      setStatusMsg("Creating your video clip...");

      const { blob: videoBlob, ext } = await makeVideo(json.image);
      setVideoExt(ext);
      setVideoUrl(URL.createObjectURL(videoBlob));
      setStage("result");

    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : "Something went wrong");
      setStage("error");
    }
  }

  function downloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `iluminatees-tryon.${videoExt}`;
    a.click();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.7)", display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "1rem",
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 20,
        width: "100%", maxWidth: 480,
        maxHeight: "90vh", overflowY: "auto",
        padding: "1.6rem",
        position: "relative",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: "Anton, sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#111" }}>
              VIRTUAL TRY-ON
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#888", marginTop: 2 }}>
              {productName}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={18} color="#555" />
          </button>
        </div>

        {/* ── Upload stage ── */}
        {stage === "upload" && (
          <>
            {/* Tips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {TIPS.map(t => (
                <span key={t} style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.52rem",
                  background: "#f5f5f5", color: "#555",
                  padding: "3px 10px", borderRadius: 20,
                }}>
                  {t}
                </span>
              ))}
            </div>

            {/* Drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${personPreview ? "#111" : "#ddd"}`,
                borderRadius: 14, cursor: "pointer",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                minHeight: 220, overflow: "hidden",
                background: personPreview ? "#000" : "#fafafa",
                transition: "border-color 0.2s",
                position: "relative",
              }}
            >
              {personPreview ? (
                <>
                  <img
                    src={personPreview}
                    alt="Your photo"
                    style={{ maxHeight: 300, maxWidth: "100%", objectFit: "contain", display: "block" }}
                  />
                  <div style={{
                    position: "absolute", bottom: 10, right: 10,
                    background: "rgba(0,0,0,0.6)", color: "#fff",
                    fontFamily: "Inter, sans-serif", fontSize: "0.55rem",
                    padding: "4px 10px", borderRadius: 20,
                  }}>
                    tap to change
                  </div>
                </>
              ) : (
                <>
                  <Upload size={28} color="#ccc" />
                  <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#555", marginTop: 10 }}>
                    Upload your photo
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "#aaa", marginTop: 4 }}>
                    Drag & drop or tap to browse
                  </div>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pickFile(f);
              }}
            />

            {!garmentImageUrl && (
              <div style={{
                marginTop: 12, fontFamily: "Inter, sans-serif", fontSize: "0.58rem",
                color: "#e8000d", background: "#fff1f2", border: "1px solid #ffd7d9",
                borderRadius: 8, padding: "0.6rem 0.8rem",
              }}>
                ⚠ No product photo uploaded yet. Upload a product image first via Admin → Products for best results.
              </div>
            )}

            <button
              onClick={generate}
              disabled={!personFile}
              style={{
                width: "100%", marginTop: 14,
                padding: "1rem",
                background: personFile ? "#111" : "#e8e8e8",
                color: personFile ? "#fff" : "#aaa",
                border: "none", borderRadius: 10,
                fontFamily: "Inter, sans-serif", fontWeight: 700,
                fontSize: "0.82rem", cursor: personFile ? "pointer" : "not-allowed",
                transition: "background 0.2s",
              }}
            >
              ✨ Generate Try-On Video
            </button>

            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.5rem", color: "#bbb", textAlign: "center", marginTop: 8 }}>
              Powered by AI · Takes 30-60 seconds · Free
            </div>
          </>
        )}

        {/* ── Processing stage ── */}
        {stage === "processing" && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <Loader2 size={40} color="#111" style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#111", marginBottom: 8 }}>
              {statusMsg}
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", color: "#aaa" }}>
              AI is fitting the outfit on your photo...
            </div>

            {/* Progress animation */}
            <div style={{ marginTop: 20, background: "#f5f5f5", borderRadius: 20, height: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "#111", borderRadius: 20,
                animation: "tryonProgress 55s linear forwards",
              }} />
            </div>
            <style>{`
              @keyframes tryonProgress { from { width: 0% } to { width: 92% } }
              @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
            `}</style>
          </div>
        )}

        {/* ── Result stage ── */}
        {stage === "result" && (
          <>
            <div style={{
              background: "#f5f5f5", borderRadius: 14,
              overflow: "hidden", marginBottom: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              minHeight: 360,
            }}>
              {videoUrl ? (
                <video
                  src={videoUrl}
                  autoPlay loop muted playsInline
                  style={{ width: "100%", maxHeight: 420, objectFit: "contain", display: "block" }}
                />
              ) : tryonImage ? (
                <img src={tryonImage} alt="Try-on result" style={{ width: "100%", objectFit: "contain" }} />
              ) : null}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  setStage("upload");
                  setPersonFile(null);
                  setPersonPreview(null);
                  setTryonImage(null);
                  setVideoUrl(null);
                  setVideoExt("mp4");
                }}
                style={{
                  flex: 1, padding: "0.85rem",
                  background: "#fff", color: "#111",
                  border: "1.5px solid #111", borderRadius: 10,
                  fontFamily: "Inter, sans-serif", fontWeight: 700,
                  fontSize: "0.75rem", cursor: "pointer",
                }}
              >
                Try Again
              </button>
              {videoUrl && (
                <button
                  onClick={downloadVideo}
                  style={{
                    flex: 1, padding: "0.85rem",
                    background: "#111", color: "#fff",
                    border: "none", borderRadius: 10,
                    fontFamily: "Inter, sans-serif", fontWeight: 700,
                    fontSize: "0.75rem", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <Download size={14} /> Save Video
                </button>
              )}
            </div>
          </>
        )}

        {/* ── Error stage ── */}
        {stage === "error" && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#111", marginBottom: 8 }}>
              Generation Failed
            </div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "#888", marginBottom: 18, lineHeight: 1.6 }}>
              {errMsg}
            </div>
            <button
              onClick={() => setStage("upload")}
              style={{
                padding: "0.85rem 2rem",
                background: "#111", color: "#fff",
                border: "none", borderRadius: 10,
                fontFamily: "Inter, sans-serif", fontWeight: 700,
                fontSize: "0.75rem", cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
