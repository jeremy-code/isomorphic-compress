import type { BufferSource } from "../index.ts";
import { compress, decompress } from "./compress.ts";

const gzip = /* @__NO_SIDE_EFFECTS__ */ async (
  val: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => compress(val, "gzip");

const gunzip = /* @__NO_SIDE_EFFECTS__ */ async (
  val: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => decompress(val, "gzip");

export { gzip, gunzip };
