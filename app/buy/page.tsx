import Bitcoin from "./Bitcoin.svg"
import QR from "./QR.svg"
import Image from "next/image"
import Link from "next/link"

export default function BuyPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black px-6">
      <div className="w-full max-w-md flex flex-col items-center text-center gap-8">
        <h1 className="text-3xl font-semibold">Buy Space</h1>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xl font-medium">Current price:</p>
            <div className="flex items-center gap-3">
                <Image
                src={Bitcoin}
                alt="Bitcoin"
                width={32}
                height={32}
                />

                <p className="text-2xl font-bold">0.00001</p>
            </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Image
            src={QR}
            alt="QR Code"
            width={220}
            height={220}
          />

          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Bitcoin address:
          </p>

          <p className="text-sm font-mono break-all">
            bc1q9x7h3p0t8k0qy2d4s7w9r03f8a9l3t9c5x2y4e
          </p>
        </div>

        <div className="w-full pt-10">
          <h2 className="text-xl font-semibold mb-4">Redeem Purchase</h2>

          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter redeem code"
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-3 bg-white dark:bg-zinc-900"
            />

            <Link
              href="/upload"
              className="block w-full rounded-lg bg-black py-3 text-white text-center dark:bg-white dark:text-black"
            >
              Submit
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
