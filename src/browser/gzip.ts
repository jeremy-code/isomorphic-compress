import type { BufferSource } from "../index.ts";
import { compress, decompress } from "./compress.ts";

const gzip = async (val: BufferSource): Promise<Uint8Array<ArrayBuffer>> =>
  compress(val, "gzip");

const gunzip = async (val: BufferSource): Promise<Uint8Array<ArrayBuffer>> =>
  decompress(val, "gzip");

export { gzip, gunzip };
