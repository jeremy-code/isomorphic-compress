import type { BufferSource, CompressionFormat } from "../index.ts";

const compress = /* @__NO_SIDE_EFFECTS__ */ async (
  val: BufferSource,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> => {
  const compressionStream = new CompressionStream(format);
  const response = new Response(compressionStream.readable);
  const writer = compressionStream.writable.getWriter();
  return new Uint8Array(
    (
      await Promise.all([
        // Response.arrayBuffer (baseline March 2017, Node 18) has slightly
        // better support compared to Response.bytes (baseline January 2025,
        // Node 22.3)
        // https://developer.mozilla.org/en-US/docs/Web/API/Response/bytes
        response.arrayBuffer(),
        writer.write(val),
        writer.close(),
      ])
    )[0],
  );
};

const decompress = /* @__NO_SIDE_EFFECTS__ */ async (
  val: BufferSource,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressionStream = new DecompressionStream(format);
  const response = new Response(decompressionStream.readable);
  const writer = decompressionStream.writable.getWriter();
  return new Uint8Array(
    (
      await Promise.all([
        response.arrayBuffer(),
        writer.write(val),
        writer.close(),
      ])
    )[0],
  );
};

export { compress, decompress };
