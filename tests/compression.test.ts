/// <reference lib="esnext.typedarrays" />

import {
  compress,
  decompress,
  type CompressionFormat,
} from "isomorphic-compress";
import { describe, expect, it } from "vitest";

const FORMATS: CompressionFormat[] = ["deflate", "deflate-raw", "gzip"];

type Fixture = {
  input: Uint8Array<ArrayBuffer>;
  output: Record<CompressionFormat, Uint8Array<ArrayBuffer>>;
};

// The ninth byte in the gzip header is defined as the operating system.
// Normalize it as 255 (for unknown)
// https://www.rfc-editor.org/info/rfc1952/#page-7
const normalizeGzip = (bytes: Uint8Array<ArrayBuffer>) => {
  bytes[9] = 255;
  return bytes;
};

const FIXTURES = {
  "empty input": {
    input: new Uint8Array(),
    output: {
      // node -e 'console.log(await import("node:zlib").then(({ gzipSync }) => gzipSync(new Uint8Array([])).toBase64()))'
      gzip: normalizeGzip(
        Uint8Array.fromBase64("H4sIAAAAAAAAEwMAAAAAAAAAAAA="),
      ),
      // node -e 'console.log(await import("node:zlib").then(({ deflateSync }) => deflateSync(new Uint8Array([])).toBase64()))'
      deflate: Uint8Array.fromBase64("eJwDAAAAAAE="),
      // node -e 'console.log(await import("node:zlib").then(({ deflateRawSync }) => deflateRawSync(new Uint8Array([])).toBase64()))'
      "deflate-raw": Uint8Array.fromBase64("AwA="),
    },
  },
  "UTF-8 text": {
    input: new TextEncoder().encode(
      "Hello world! 🌍\n你好，世界！\nこんにちは世界！",
    ),
    output: {
      // node -e 'console.log(await import("node:zlib").then(({ deflateSync }) => deflateSync(new TextEncoder().encode("Hello world! 🌍\n你好，世界！\nこんにちは世界！")).toBase64()))'
      deflate: Uint8Array.fromBase64(
        "eJzzSM3JyVcozy/KSVFU+DC/p5fryd4FT5fufb+n58mOac+n9rzf08j1uHHy46bJjxtXP25c+LhxPVwCAA52JNs=",
      ),
      // node -e 'console.log(await import("node:zlib").then(({ deflateRawSync }) => deflateRawSync(new TextEncoder().encode("Hello world! 🌍\n你好，世界！\nこんにちは世界！")).toBase64()))'
      "deflate-raw": Uint8Array.fromBase64(
        "80jNyclXKM8vyklRVPgwv6eX68neBU+X7n2/p+fJjmnPp/a839PI9bhx8uOmyY8bVz9uXPi4cT1cAgA=",
      ),
      // node -e 'console.log(await import("node:zlib").then(({ gzipSync }) => gzipSync(new TextEncoder().encode("Hello world! 🌍\n你好，世界！\nこんにちは世界！")).toBase64()))'
      gzip: normalizeGzip(
        Uint8Array.fromBase64(
          "H4sIAAAAAAAAE/NIzcnJVyjPL8pJUVT4ML+nl+vJ3gVPl+59v6fnyY5pz6f2vN/TyPW4cfLjpsmPG1c/blz4uHE9XAIAf9JbfT0AAAA=",
        ),
      ),
    },
  },
  "WebAssembly binary": {
    // https://github.com/bytecodealliance/wasmtime-go/blob/1da9be3b7b0988defcb453acc85dddeddd9405fe/example_test.go#L722-L748
    input: Uint8Array.fromBase64(
      "AGFzbQEAAAABBwFgAn9/AX8DAgEABwcBA2djZAAACiwBKgEBfwJAAkAgAA0AIAEhAgwBCwNAIAEgACICcCEAIAIhASAADQALCyACCwASBG5hbWUBBgEAA2djZAIDAQAA",
    ),
    output: {
      // node -e 'console.log(await import("node:zlib").then(({ deflateSync }) => deflateSync(Uint8Array.fromBase64("AGFzbQEAAAABBwFgAn9/AX8DAgEABwcBA2djZAAACiwBKgEBfwJAAkAgAA0AIAEhAgwBCwNAIAEgACICcCEAIAIhASAADQALCyACCwASBG5hbWUBBgEAA2djZAIDAQAA")).toBase64()))'
      deflate: Uint8Array.fromBase64(
        "eJwVzEEOQDAYROGZqWiibJzgr6U4RI+iQawqEgfo1bF++R7yUwiAnqtqZXUivKc7tx3oFs5kVVIyDDBG9QwuGQ2T7ghT5F9CMAWMzZXLwZb4udw3fgFDcAtE",
      ),
      // node -e 'console.log(await import("node:zlib").then(({ deflateRawSync }) => deflateRawSync(Uint8Array.fromBase64("AGFzbQEAAAABBwFgAn9/AX8DAgEABwcBA2djZAAACiwBKgEBfwJAAkAgAA0AIAEhAgwBCwNAIAEgACICcCEAIAIhASAADQALCyACCwASBG5hbWUBBgEAA2djZAIDAQAA")).toBase64()))'
      "deflate-raw": Uint8Array.fromBase64(
        "FcxBDkAwGEThmaloomyc4K+lOESPokGsKhIH6NWxfvke8lMIgJ6ramV1IrynO7cd6BbOZFVSMgwwRvUMLhkNk+4IU+RfQjAFjM2Vy8GW+LncN34B",
      ),
      // node -e 'console.log(await import("node:zlib").then(({ gzipSync }) => gzipSync(Uint8Array.fromBase64("AGFzbQEAAAABBwFgAn9/AX8DAgEABwcBA2djZAAACiwBKgEBfwJAAkAgAA0AIAEhAgwBCwNAIAEgACICcCEAIAIhASAADQALCyACCwASBG5hbWUBBgEAA2djZAIDAQAA")).toBase64()))'
      gzip: normalizeGzip(
        Uint8Array.fromBase64(
          "H4sIAAAAAAAAExXMQQ5AMBhE4ZmpaKJsnOCvpThEj6JBrCoSB+jVsX75HvJTCICeq2pldSK8pzu3HegWzmRVUjIMMEb1DC4ZDZPuCFPkX0IwBYzNlcvBlvi53Dd+AcnVmDBgAAAA",
        ),
      ),
    },
  },
} satisfies Record<string, Fixture>;

describe("survives roundtrip conversion", () => {
  describe.for(FORMATS)("%s", (compressionFormat) => {
    it.for(Object.entries(FIXTURES))("%s", async ([, fixture]) => {
      expect(
        await decompress(
          await compress(fixture.input, compressionFormat),
          compressionFormat,
        ),
      ).toEqual(fixture.input);
    });
  });
});

describe("compress", () => {
  it("rejects invalid compression formats", async () => {
    await expect(() =>
      compress(new Uint8Array(), "foo" as never),
    ).rejects.toThrow(TypeError);
  });

  it.for(
    Object.entries({
      Uint8Array: new Uint8Array(),
      Uint16Array: new Uint16Array(),
      Int32Array: new Int32Array(),
      Float64Array: new Float64Array(),
      ArrayBuffer: new ArrayBuffer(),
      DataView: new DataView(new ArrayBuffer()),
    }),
  )("handles %s for input", async ([, input]) => {
    expect(normalizeGzip(await compress(input, "gzip"))).toEqual(
      FIXTURES["empty input"].output.gzip,
    );
  });

  describe.for(FORMATS)("%s", (compressionFormat) => {
    it("only compresses the ArrayBufferView's bytes", async () => {
      const fixture = FIXTURES["UTF-8 text"];
      const input = new Uint8Array(fixture.input.length + 20).fill(0xff);
      input.set(fixture.input, 10);
      const compressedInput = await compress(
        input.subarray(10, 10 + fixture.input.length),
        compressionFormat,
      );
      expect(
        compressionFormat === "gzip"
          ? normalizeGzip(compressedInput)
          : compressedInput,
      ).toEqual(fixture.output[compressionFormat]);
    });

    it("returns Uint8Array<ArrayBuffer>", async () => {
      const compressedOutput = await compress(
        new Uint8Array().buffer,
        compressionFormat,
      );
      expect(compressedOutput).toBeInstanceOf(Uint8Array);
      expect(compressedOutput.buffer).toBeInstanceOf(ArrayBuffer);
    });

    it.for(Object.entries(FIXTURES))(
      "returns expected input for %s",
      async ([, fixture]) => {
        const compressedInput = await compress(
          fixture.input,
          compressionFormat,
        );

        expect(
          compressionFormat === "gzip"
            ? normalizeGzip(compressedInput)
            : compressedInput,
        ).toEqual(fixture.output[compressionFormat]);
      },
    );
  });
});

describe("decompress", () => {
  it("rejects invalid compression formats", async () => {
    await expect(() =>
      decompress(new Uint8Array(), "foo" as never),
    ).rejects.toThrow(TypeError);
  });

  it.for(
    Object.entries({
      Uint8Array: new Uint8Array(
        FIXTURES["empty input"].output.gzip.slice().buffer,
      ),
      Uint16Array: new Uint16Array(
        FIXTURES["empty input"].output.gzip.slice().buffer,
      ),
      Int32Array: new Int32Array(
        FIXTURES["empty input"].output.gzip.slice().buffer,
      ),
      Float16Array: new Float16Array(
        FIXTURES["empty input"].output.gzip.slice().buffer,
      ),
      ArrayBuffer: FIXTURES["empty input"].output.gzip.slice().buffer,
      DataView: new DataView(
        FIXTURES["empty input"].output.gzip.slice().buffer,
      ),
    }),
  )("handles %s for input", async ([, input]) => {
    expect(normalizeGzip(await decompress(input, "gzip"))).toEqual(
      FIXTURES["empty input"].input,
    );
  });

  describe.for(FORMATS)("%s", (compressionFormat) => {
    it("rejects malformed compressed data", async () => {
      await expect(
        decompress(new Uint8Array([0xff, 0x00]), compressionFormat),
      ).rejects.toThrow();
    });

    it("returns Uint8Array<ArrayBuffer>", async () => {
      const decompressedOutput = await decompress(
        FIXTURES["empty input"].output[compressionFormat].buffer,
        compressionFormat,
      );
      expect(decompressedOutput).toBeInstanceOf(Uint8Array);
      expect(decompressedOutput.buffer).toBeInstanceOf(ArrayBuffer);
    });

    it("only decompresses the ArrayBufferView's bytes", async () => {
      const fixture = FIXTURES["UTF-8 text"];
      const input = new Uint8Array(
        fixture.output[compressionFormat].length + 20,
      ).fill(0xff);
      input.set(fixture.output[compressionFormat], 10);
      expect(
        await decompress(
          input.subarray(10, 10 + fixture.output[compressionFormat].length),
          compressionFormat,
        ),
      ).toEqual(fixture.input);
    });

    it.for(Object.entries(FIXTURES))(
      "returns expected input for %s",
      async ([, fixture]) => {
        expect(
          await decompress(
            fixture.output[compressionFormat],
            compressionFormat,
          ),
        ).toEqual(fixture.input);
      },
    );
  });
});
