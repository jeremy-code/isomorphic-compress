import { promisify } from "node:util";
import {
  deflateRaw as zlibDeflateRaw,
  inflateRaw as zlibInflateRaw,
} from "node:zlib";

import type { BufferSource } from "../index.ts";

const deflateRawAsync = /* @__PURE__ */ promisify(zlibDeflateRaw);
const inflateRawAsync = /* @__PURE__ */ promisify(zlibInflateRaw);

const deflate = /* @__NO_SIDE_EFFECTS__ */ async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const compressedBuffer = await deflateRawAsync(
    // This cast is necessary because
    // `ArrayBufferView<ArrayBuffer> !== NodeJS.ArrayBufferView<ArrayBuffer>`
    data as ArrayBuffer | NodeJS.ArrayBufferView<ArrayBuffer>,
  );
  // Convert Buffer to Uint8Array
  return new Uint8Array(
    compressedBuffer.buffer,
    compressedBuffer.byteOffset,
    compressedBuffer.byteLength,
  );
};

const inflate = /* @__NO_SIDE_EFFECTS__ */ async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressedBuffer = await inflateRawAsync(
    data as ArrayBuffer | NodeJS.ArrayBufferView<ArrayBuffer>,
  );
  // Convert Buffer to Uint8Array
  return new Uint8Array(
    decompressedBuffer.buffer,
    decompressedBuffer.byteOffset,
    decompressedBuffer.byteLength,
  );
};

export { deflate, inflate };
