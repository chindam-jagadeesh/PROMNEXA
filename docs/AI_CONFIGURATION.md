# AI integration notes

PROMNEXA prefers a provider with a usable free tier, but no free quota or model availability is guaranteed. Check the provider's official pricing, rate limits, commercial-use terms, data retention, and regional availability before selecting it.

Keep the provider interface server-side. The frontend should call a Supabase Edge Function with the signed-in user's access token; the function should validate the user, validate prompt length, enforce quotas/rate limits, call the selected provider, and upload the returned image to private Storage.

Expected generation response shape:
```json
{
  "imagePath": "user-id/generated-image-id.webp",
  "provider": "provider-name",
  "model": "model-name",
  "width": 1024,
  "height": 1024
}
```

Expected evaluation response shape:
```json
{
  "promptQualityScore": 0,
  "imageMatchScore": 0,
  "capturedDetails": [],
  "missingDetails": [],
  "incorrectDetails": [],
  "hints": [],
  "improvedPrompt": ""
}
```

The two scores measure different things. Prompt quality measures how well the prompt communicates its intent; image match measures similarity between a generated image and a target. The vision evaluator should compare actual images, not infer visual correctness from prompt keywords alone.
