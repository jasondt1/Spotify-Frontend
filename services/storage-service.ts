const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

async function getSupabase() {
  const { createClient } = await import("@supabase/supabase-js")
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

function uniqueName(original: string) {
  const ext = original.includes(".") ? `.${original.split(".").pop()}` : ""
  const base = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2)
  return base + ext
}

export async function uploadImage(file: File, pathPrefix = ""): Promise<string> {
  const supabase = await getSupabase()
  const fileName = uniqueName(file.name)
  const path = `${pathPrefix}${fileName}`
  const { error } = await supabase.storage.from("images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from("images").getPublicUrl(path)
  return data.publicUrl
}

export async function uploadAudio(file: File, pathPrefix = ""): Promise<string> {
  const supabase = await getSupabase()
  const fileName = uniqueName(file.name)
  const path = `${pathPrefix}${fileName}`
  const { error } = await supabase.storage.from("audio").upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from("audio").getPublicUrl(path)
  return data.publicUrl
}
