import { promisify } from "node:util";
import { deflate as zlibDeflate, inflate as zlibInflate } from "node:zlib";

import type { BufferSource } from "../index.ts";

const deflateAsync = /* @__PURE__ */ promisify(zlibDeflate);
const inflateAsync = /* @__PURE__ */ promisify(zlibInflate);

const zlib = /* @__NO_SIDE_EFFECTS__ */ async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const compressedBuffer = await deflateAsync(
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

const unzlib = /* @__NO_SIDE_EFFECTS__ */ async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressedBuffer = await inflateAsync(
    data as ArrayBuffer | NodeJS.ArrayBufferView<ArrayBuffer>,
  );
  // Convert Buffer to Uint8Array
  return new Uint8Array(
    decompressedBuffer.buffer,
    decompressedBuffer.byteOffset,
    decompressedBuffer.byteLength,
  );
};

export { zlib, unzlib };
