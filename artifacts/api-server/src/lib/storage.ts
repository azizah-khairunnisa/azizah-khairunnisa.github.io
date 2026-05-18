import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "portfolio-files";

const useSupabase = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const supabase = useSupabase
  ? createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
  : null;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!useSupabase) {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function getUploadsDir(): string {
  return UPLOADS_DIR;
}

export function isUsingSupabase(): boolean {
  return useSupabase;
}

export async function saveFile(fileName: string, buffer: Buffer, contentType?: string): Promise<string> {
  if (useSupabase && supabase) {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, { upsert: true, contentType: contentType || "application/octet-stream" });
    if (error) throw new Error(`Supabase upload failed: ${error.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    return data.publicUrl;
  }

  const dest = path.join(UPLOADS_DIR, fileName);
  await writeFile(dest, buffer);
  return `/api/uploads/${fileName}`;
}

export async function removeFile(fileName: string): Promise<void> {
  if (useSupabase && supabase) {
    await supabase.storage.from(BUCKET).remove([fileName]);
    return;
  }

  try {
    const dest = path.join(UPLOADS_DIR, fileName);
    await unlink(dest);
  } catch {
    // Ignore if file doesn't exist
  }
}
