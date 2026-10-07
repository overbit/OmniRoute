import assert from "node:assert/strict";
import test from "node:test";

import { IMAGE_PROVIDERS } from "../../open-sse/config/imageRegistry.ts";
import { BASE_IMAGE_PROVIDER_IDS } from "../../open-sse/config/imageProviderServiceKinds.ts";

test("client-safe image provider service-kind membership matches base image registry", () => {
  assert.deepEqual([...BASE_IMAGE_PROVIDER_IDS].sort(), Object.keys(IMAGE_PROVIDERS).sort());
});
