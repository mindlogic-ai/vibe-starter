import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!client) {
    if (!url || !anonKey) {
      throw new Error("Supabase is not configured. Fill in .env.local first.");
    }
    client = createClient(url, anonKey);
  }
  return client;
}

export type Item = {
  id: number;
  title: string;
  done: boolean;
  note: string | null;
  created_at: string;
};
