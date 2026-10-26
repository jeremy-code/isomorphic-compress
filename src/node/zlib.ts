import { promisify, types } from "node:util";
import { deflate as zlibDeflate, inflate as zlibInflate } from "node:zlib";

import type { BufferSource } from "../index.ts";

const deflateAsync = /* @__PURE__ */ promisify(zlibDeflate);
const inflateAsync = /* @__PURE__ */ promisify(zlibInflate);

const zlib = async (data: BufferSource): Promise<Uint8Array<ArrayBuffer>> => {
  const compressedBuffer = await deflateAsync(
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

const unzlib = async (data: BufferSource): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressedBuffer = await inflateAsync(
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

export { zlib, unzlib };
