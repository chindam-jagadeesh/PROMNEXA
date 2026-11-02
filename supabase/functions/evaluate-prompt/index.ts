// Secure prompt/image evaluation endpoint starter.
// Production evaluation should call a vision-capable model server-side and return separate
// prompt-quality and image-match scores. Do not treat keyword checks as semantic truth.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_ANON_KEY");
  const auth = req.headers.get("Authorization");
  if (!url || !key || !auth) return json({ error: "Missing configuration or authentication." }, 401);
  const client = createClient(url, key, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return json({ error: "Sign in required." }, 401);

  let body: { prompt?: string; targetImagePath?: string; generatedImagePath?: string };
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  if (!body.prompt?.trim()) return json({ error: "A prompt is required." }, 400);

  return json({
    error: "Vision evaluator is not configured.",
    setup: "Connect a vision-capable evaluation model on the server. Return prompt_quality_score, image_match_score, captured_details, missing_details, incorrect_details, and actionable_hints as separate fields."
  }, 503);
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
