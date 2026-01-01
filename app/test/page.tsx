"use client"

import { supabase } from "@/lib/supabase"

export default function Test() {
  async function add() {
    await supabase.from("sectors").insert({
      width: 2,
      height: 2,
      link_url: "https://example.com",
      alt_text: "example",
      image_url: "",
      order_index: 1
    })
  }

  return (
    <button onClick={add}>
      Test Insert
    </button>
  )
}
