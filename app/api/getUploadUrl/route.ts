import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(req: NextRequest) {
  const filename = `${crypto.randomUUID()}.png`;
  const bucket = "sectorImages";

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(filename); // 60 seconds validity

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const signedURL = data.signedUrl; 

  return NextResponse.json({ signedURL, filename });
}
