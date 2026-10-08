/**
 * Client-safe image provider membership for dashboard service-kind filtering.
 *
 * Keep this list aligned with the base IMAGE_PROVIDERS registry. The runtime
 * image registry may layer feature-flagged providers on top server-side, but
 * client bundles must not import that server-only flag resolver.
 */
export const BASE_IMAGE_PROVIDER_IDS = [
  "zenmux",
  "agnes",
  "qwen-cloud-token-plan",
  "openai",
  "codex",
  "cursor",
  "maxai",
  "xai",
  "vercel-ai-gateway",
  "together",
  "fireworks",
  "antigravity",
  "nebius",
  "hyperbolic",
  "nanobanana",
  "kie",
  "haiper",
  "minimax",
  "leonardo",
  "ideogram",
  "magnific",
  "sdwebui",
  "comfyui",
  "openrouter",
  "pollinations",
  "fal-ai",
  "stability-ai",
  "black-forest-labs",
  "recraft",
  "topaz",
  "segmind",
  "nanogpt",
  "nvidia",
  "sensenova",
  "huggingface",
  "lmarena",
  "adobe-firefly",
  "cheaperinference",
  "bailian-coding-plan",
  "alibaba",
  "qwen-cloud",
  "aihorde",
  "uc",
  "cloudflare-ai",
] as const;

export const BASE_IMAGE_PROVIDER_REGISTRY: Readonly<Record<string, true>> = Object.freeze(
  Object.fromEntries(BASE_IMAGE_PROVIDER_IDS.map((providerId) => [providerId, true]))
);
