import type { BufferSource, CompressionFormat } from "../index.ts";
import { deflate, inflate } from "./deflate.ts";
import { gzip, gunzip } from "./gzip.ts";
import { zlib, unzlib } from "./zlib.ts";

const compress = async (
  val: BufferSource,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> => {
  switch (format) {
    case "deflate":
      return zlib(val);
    case "deflate-raw":
      return deflate(val);
    case "gzip":
      return gzip(val);
    default:
      throw new TypeError(`Unsupported compression format: '${format}'`);
  }
};

const decompress = async (
  val: BufferSource,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> => {
  switch (format) {
    case "deflate":
      return unzlib(val);
    case "deflate-raw":
      return inflate(val);
    case "gzip":
      return gunzip(val);
    default:
      throw new TypeError(`Unsupported compression format: '${format}'`);
  }
};

export { compress, decompress };
