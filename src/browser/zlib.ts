import type { BufferSource } from "../index.ts";
import { compress, decompress } from "./compress.ts";

const zlib = async (val: BufferSource): Promise<Uint8Array<ArrayBuffer>> =>
  compress(val, "deflate");

const unzlib = async (val: BufferSource): Promise<Uint8Array<ArrayBuffer>> =>
  decompress(val, "deflate");

export { zlib, unzlib };
