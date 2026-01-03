"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

interface Sector {
  id: string
  width: number
  height: number
  link_url: string
  alt_text: string
  image_url: string
}

export default function Home() {
  const [gridCells, setGridCells] = useState<React.ReactElement[]>([])

  useEffect(() => {
    const size = 20
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchAndPlaceSectors = async () => {
      const { data: sectors, error } = await supabase
        .from("sectors")
        .select("*")
        .order("order_index", { ascending: true })

      if (error || !sectors) return

      const cols = Math.floor(window.innerWidth / size)
      const visibleRows = Math.floor(window.innerHeight / size)

      // Step 1: Place sectors
      const grid: (Sector | null)[][] = []
      const sectorPositions: { sector: Sector; row: number; col: number }[] = []

      // Start with 100 rows — we'll adjust later
      const initialRows = 100
      for (let r = 0; r < initialRows; r++) {
        grid.push(Array.from({ length: cols }, () => null))
      }

      let bottomMostRow = 0

      for (const sector of sectors) {
        const { width, height } = sector
        let placed = false

        for (let r = 0; r <= grid.length - height; r++) {
          for (let c = 0; c <= cols - width; c++) {
            let canPlace = true
            for (let dr = 0; dr < height; dr++) {
              for (let dc = 0; dc < width; dc++) {
                if (grid[r + dr][c + dc] !== null) canPlace = false
              }
            }
            if (canPlace) {
              for (let dr = 0; dr < height; dr++) {
                for (let dc = 0; dc < width; dc++) {
                  grid[r + dr][c + dc] = sector
                }
              }
              sectorPositions.push({ sector, row: r, col: c })
              bottomMostRow = Math.max(bottomMostRow, r + height - 1)
              placed = true
              break
            }
          }
          if (placed) break
        }
      }

      // Step 2: Determine total rows to fill
      const totalRows = Math.max(bottomMostRow + 5, visibleRows)

      console.log("here")
      console.log(totalRows)
      console.log(cols)

      // Step 3: Generate empty cells
      const cells: React.ReactElement[] = []
      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < cols; c++) {

            cells.push(
              <div
                key={`cell-${r}-${c}`}
                className="h-[20px] w-[20px] border-2 border-gray-200"
              />
            )
        }
      }


      // Step 4: Add sectors as absolute elements
      const sectorElements = sectorPositions.map(({ sector, row, col }) => (
        <a
          key={sector.id}
          href={sector.link_url.startsWith("http") ? sector.link_url : `https://${sector.link_url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute block"
          style={{
            top: row * size,
            left: col * size,
            width: sector.width * size,
            height: sector.height * size,
          }}
        >
          <img
            src={sector.image_url}
            alt={sector.alt_text}
            className="object-cover w-full h-full"
          />
        </a>
      ))

      setGridCells([...cells, ...sectorElements])
    }

    fetchAndPlaceSectors()
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black overflow-y-auto">
      <div
        className="grid relative animate-grid-in"
        style={{ gridTemplateColumns: `repeat(auto-fill, 20px)` }}
      >
        {gridCells}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-white via-white/95 to-transparent dark:from-black dark:via-black/95" />

      <Link
        href="/buy"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-black px-6 py-3 text-white dark:bg-white dark:text-black"
      >
        Buy Space
      </Link>
    </div>
  )
}
