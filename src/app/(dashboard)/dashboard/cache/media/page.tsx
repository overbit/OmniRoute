import { IMAGE_PROVIDERS } from "@omniroute/open-sse/config/imageRegistry.ts";

import MediaPageClient from "./MediaPageClient";
import { toProviderModels } from "./mediaProviderModels";

const IMAGE_PROVIDER_MODELS = toProviderModels(IMAGE_PROVIDERS);

export default function MediaPage() {
  return <MediaPageClient imageProviderModels={IMAGE_PROVIDER_MODELS} />;
}
