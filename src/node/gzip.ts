import { promisify, types } from "node:util";
import { gunzip as zlibGunzip, gzip as zlibGzip } from "node:zlib";

import type { BufferSource } from "../index.ts";

const gzipAsync = /* @__PURE__ */ promisify(zlibGzip);
const gunzipAsync = /* @__PURE__ */ promisify(zlibGunzip);

const gzip = async (data: BufferSource): Promise<Uint8Array<ArrayBuffer>> => {
  const compressedBuffer = await gzipAsync(
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

const gunzip = async (data: BufferSource): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressedBuffer = await gunzipAsync(
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

export { gunzip, gzip };
