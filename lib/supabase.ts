import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://wutsdsafnlivilkwkixp.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "sb_publishable_2QGgshehTCeczWTjqv0-lA_dV3SGbza";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_Publishable_key ||
  DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
