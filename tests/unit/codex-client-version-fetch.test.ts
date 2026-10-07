import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_CODEX_CLIENT_VERSION } from "../../src/shared/constants/codexClient.ts";
import {
  clearCodexClientVersionCache,
  getCodexClientVersion,
  getCodexDefaultHeaders,
  resolveCodexClientVersion,
} from "../../open-sse/config/codexClient.ts";

const CODEX_METADATA_URL = "https://registry.npmjs.org/@openai%2Fcodex/latest";

function metadataFetch(version: string): Parameters<typeof resolveCodexClientVersion>[0] {
  return (async (url, init) => {
    assert.equal(String(url), CODEX_METADATA_URL);
    assert.equal(init.method, "GET");
    assert.deepEqual(init.headers, { Accept: "application/json" });
    assert.equal(init.guard, "public-only");
    assert.equal(init.pinDns, true);
    assert.equal(init.retry, false);
    return Response.json({ name: "@openai/codex", version });
  }) as Parameters<typeof resolveCodexClientVersion>[0];
}

async function withEnv<T>(
  entries: Record<string, string | undefined>,
  fn: () => T | Promise<T>
): Promise<T> {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(entries)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test.afterEach(() => {
  clearCodexClientVersionCache();
  delete process.env.CODEX_CLIENT_VERSION;
});

test("discovery refresh caches a newer official Codex package version", async () => {
  await withEnv({ CODEX_CLIENT_VERSION: undefined }, async () => {
    const version = await resolveCodexClientVersion(metadataFetch("0.160.1"));
    assert.equal(version, "0.160.1");
    assert.equal(getCodexClientVersion(), "0.160.1");
    assert.equal(getCodexDefaultHeaders().Version, "0.160.1");
    assert.notEqual(version, DEFAULT_CODEX_CLIENT_VERSION);
  });
});

test("failed metadata lookup falls back to the pinned Codex identity", async () => {
  await withEnv({ CODEX_CLIENT_VERSION: undefined }, async () => {
    const failingFetch = (async () => {
      throw new Error("network down");
    }) as Parameters<typeof resolveCodexClientVersion>[0];

    const version = await resolveCodexClientVersion(failingFetch);
    assert.equal(version, DEFAULT_CODEX_CLIENT_VERSION);
    assert.equal(getCodexClientVersion(), DEFAULT_CODEX_CLIENT_VERSION);
  });
});

test("explicit CODEX_CLIENT_VERSION wins and suppresses metadata lookup", async () => {
  await withEnv({ CODEX_CLIENT_VERSION: "0.159.1" }, async () => {
    const version = await resolveCodexClientVersion((async () => {
      assert.fail("explicit operator version must not trigger metadata lookup");
    }) as Parameters<typeof resolveCodexClientVersion>[0]);
    assert.equal(version, "0.159.1");
    assert.equal(getCodexClientVersion(), "0.159.1");
  });
});

test("older registry metadata cannot downgrade the stable pin", async () => {
  await withEnv({ CODEX_CLIENT_VERSION: undefined }, async () => {
    const version = await resolveCodexClientVersion(metadataFetch("0.158.0"));
    assert.equal(version, DEFAULT_CODEX_CLIENT_VERSION);
    assert.equal(getCodexClientVersion(), DEFAULT_CODEX_CLIENT_VERSION);
  });
});
