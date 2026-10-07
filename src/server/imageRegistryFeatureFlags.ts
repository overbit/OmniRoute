import { setImageRegistryFeatureFlagResolver } from "@omniroute/open-sse/config/imageRegistry.ts";
import { isFeatureFlagEnabled } from "@/shared/utils/featureFlags";

setImageRegistryFeatureFlagResolver(isFeatureFlagEnabled);
