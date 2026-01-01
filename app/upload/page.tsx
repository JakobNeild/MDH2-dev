"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function UploadPage() {
  const router = useRouter()
  const [sectorSize, setSectorSize] = useState<number | null>(null)
  const [link, setLink] = useState("")
  const [alt, setAlt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [stage, setStage] = useState<"form" | "fadeOut" | "thanks" | "thanksOut">("form")

  useEffect(() => {
    const value = sessionStorage.getItem("sectorSize")
    if (value) setSectorSize(Number(value))
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    if (!f) return
    if (f.type === "image/png" || f.type === "image/jpeg") setFile(f)
    else setFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !sectorSize) return

    const canvasSize = sectorSize * 20
    const canvas = document.createElement("canvas")
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = URL.createObjectURL(file)
    })

    // Use Math.max to cover the entire canvas
    const scale = Math.max(canvasSize / img.width, canvasSize / img.height)
    const w = img.width * scale
    const h = img.height * scale
    const x = (canvasSize - w) / 2
    const y = (canvasSize - h) / 2

    ctx.drawImage(img, x, y, w, h)

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(b => resolve(b), "image/png")
    )

    if (!blob) return

    const res = await fetch("/api/getUploadUrl")
    const { signedURL, filename, error } = await res.json()
    if (error) return alert("Could not get upload URL: " + error)

    await fetch(signedURL, {
      method: "PUT",
      body: blob,
      headers: { "Content-Type": "image/png" }
    })


    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sectorImages/${filename}`

    const { error: dbError } = await supabase.from("sectors").insert({
      width: sectorSize,
      height: sectorSize,
      link_url: link,
      alt_text: alt,
      image_url: imageUrl,
      order_index: 1
    })

    

    if (dbError) {
      alert("DB insert failed: " + dbError.message)
      return
    }

    setStage("fadeOut")
    setTimeout(() => {
      setStage("thanks")
      setTimeout(() => {
        setStage("thanksOut")
        setTimeout(() => router.push("/"), 1400)
      }, 3000)
    }, 500)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black px-6">
      <div className={`w-full max-w-md transition-opacity duration-1000 ${stage === "fadeOut" ? "opacity-0" : "opacity-100"}`}>
        {stage !== "thanks" && stage !== "thanksOut" && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-center">Upload</h1>

            {sectorSize && (
              <div className="text-center text-sm space-y-1">
                <p>Your sector size: {sectorSize}</p>
                <p>
                  Sector size: {sectorSize * 20} × {sectorSize * 20}. Larger or smaller images will be
                  cropped or padded. PNG and JPG accepted.
                </p>
              </div>
            )}

            <input
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="Hyperlink"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-3 bg-white dark:bg-zinc-900"
            />

            <input
              value={alt}
              onChange={e => setAlt(e.target.value)}
              placeholder="Alt text"
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-3 bg-white dark:bg-zinc-900"
            />

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFile}
              className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-white dark:bg-zinc-900"
            />

            <button
              disabled={!file || stage !== "form"}
              className={`w-full rounded-lg py-3 text-center transition-all duration-150 active:scale-95 ${
                file
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-zinc-300 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              }`}
            >
              Finalize
            </button>
          </form>
        )}

        {(stage === "thanks" || stage === "thanksOut") && (
          <div className={`w-full text-center text-2xl mt-10 ${stage === "thanks" ? "animate-fadeInSlow" : "animate-fadeOutSlow"}`}>
            Thank you for your submission :)
          </div>
        )}
      </div>
    </div>
  )
}
