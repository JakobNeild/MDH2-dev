import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const cells = Array.from({ length: 2000 })

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black">
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, 20px)",
        }}
      >
        {cells.map((_, i) => (
          <div
            key={i}
            className="h-[20px] w-[20px] border-2 border-gray-300"
          />
        ))}
      </div>

      <Link
        href="/buy"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-black px-6 py-3 text-white dark:bg-white dark:text-black"
      >
        Buy Space
      </Link>
    </div>
  )
}
