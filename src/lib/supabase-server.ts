import { createClient } from "@supabase/supabase-js";

export const createServerSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE! // only for server use
  );