"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadPage() {
  const router = useRouter()

  const [link, setLink] = useState("")
  const [alt, setAlt] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [stage, setStage] = useState<"form" | "fadeOut" | "thanks" | "thanksOut">("form")

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    if (f && f.type === "image/png") setFile(f)
    else setFile(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setStage("fadeOut")

    setTimeout(() => {
      setStage("thanks")

      setTimeout(() => {
        setStage("thanksOut")

        setTimeout(() => {
          router.push("/")
        }, 1400)
      }, 5000)
    }, 1200)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black px-6">
      <div
        className={`w-full max-w-md transition-opacity duration-1000 ${
          stage === "fadeOut" ? "opacity-0" : "opacity-100"
        }`}
      >
        {stage !== "thanks" && stage !== "thanksOut" && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-center">Upload</h1>

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
              accept="image/png"
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
          <div
            className={`w-full text-center text-2xl mt-10 ${
              stage === "thanks" ? "animate-fadeInSlow" : "animate-fadeOutSlow"
            }`}
          >
            Thank you for your submission :)
          </div>
        )}
      </div>
    </div>
  )
}
