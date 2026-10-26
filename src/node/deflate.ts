import { promisify, types } from "node:util";
import {
  deflateRaw as zlibDeflateRaw,
  inflateRaw as zlibInflateRaw,
} from "node:zlib";

import type { BufferSource } from "../index.ts";

const deflateRawAsync = /* @__PURE__ */ promisify(zlibDeflateRaw);
const inflateRawAsync = /* @__PURE__ */ promisify(zlibInflateRaw);

const deflate = async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const compressedBuffer = await deflateRawAsync(
    // This predicate is necessary because
    // `ArrayBufferView<ArrayBuffer> !== NodeJS.ArrayBufferView<ArrayBuffer>`
    types.isArrayBufferView(data) || types.isArrayBuffer(data)
      ? data
      : Buffer.from(data.buffer, data.byteOffset, data.byteLength),
  );
  // Convert Buffer to Uint8Array
  return new Uint8Array(
    compressedBuffer.buffer,
    compressedBuffer.byteOffset,
    compressedBuffer.byteLength,
  );
};

const inflate = async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressedBuffer = await inflateRawAsync(
    // This predicate is necessary because
    // `ArrayBufferView<ArrayBuffer> !== NodeJS.ArrayBufferView<ArrayBuffer>`
    types.isArrayBufferView(data) || types.isArrayBuffer(data)
      ? data
      : Buffer.from(data.buffer, data.byteOffset, data.byteLength),
  );
  // Convert Buffer to Uint8Array
  return new Uint8Array(
    decompressedBuffer.buffer,
    decompressedBuffer.byteOffset,
    decompressedBuffer.byteLength,
  );
};

export { deflate, inflate };
