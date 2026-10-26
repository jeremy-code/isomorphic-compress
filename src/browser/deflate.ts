import type { BufferSource } from "../index.ts";
import { compress, decompress } from "./compress.ts";

const deflate = /* @__NO_SIDE_EFFECTS__ */ async (
  val: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => compress(val, "deflate-raw");

const inflate = /* @__NO_SIDE_EFFECTS__ */ async (
  val: BufferSource,
): Promise<Uint8Array<ArrayBuffer>> => decompress(val, "deflate-raw");

export { deflate, inflate };
