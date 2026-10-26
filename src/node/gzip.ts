import { promisify } from "node:util";
import { gunzip as zlibGunzip, gzip as zlibGzip } from "node:zlib";

import type { BufferSource } from "../index.ts";

const gzipAsync = /* @__PURE__ */ promisify(zlibGzip);
const gunzipAsync = /* @__PURE__ */ promisify(zlibGunzip);

const gzip = /* @__NO_SIDE_EFFECTS__ */ async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const compressedBuffer = await gzipAsync(
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

const gunzip = /* @__NO_SIDE_EFFECTS__ */ async (
  data: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressedBuffer = await gunzipAsync(
    data as ArrayBuffer | NodeJS.ArrayBufferView<ArrayBuffer>,
  );
  // Convert Buffer to Uint8Array
  return new Uint8Array(
    decompressedBuffer.buffer,
    decompressedBuffer.byteOffset,
    decompressedBuffer.byteLength,
  );
};

export { gunzip, gzip };
