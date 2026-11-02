import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 200);

  try {
    let body;
    try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 200); }
    
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (prompt.length < 3) return json({ error: "Prompt is too short." }, 200);

    const togetherApiKey = Deno.env.get("TOGETHER_API_KEY");
    if (!togetherApiKey) return json({ error: "TOGETHER_API_KEY is missing in Supabase secrets." }, 200);

    // Call Together AI's text-to-image API
    const response = await fetch("https://api.together.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${togetherApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: prompt,
        steps: 3, // Flux Schnell generates high quality in just 3-4 steps
        response_format: "b64_json"
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return json({ error: "Together AI API failed", details: errText }, 200);
    }

    const data = await response.json();
    
    // Together AI returns the image as a base64 string when requested
    const base64Image = data.data[0].b64_json;
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    return json({ 
      imageDataUrl,
      model: "Flux.1 Schnell (Together AI)"
    });

  } catch (error: any) {
    console.error("Function error:", error);
    return json({ error: "Unexpected server error", details: error.message }, 200);
  }
});