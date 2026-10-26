import type { BufferSource, CompressionFormat } from "../index.ts";

const compress = async (
  val: BufferSource,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> => {
  const compressionStream = new CompressionStream(format);
  const response = new Response(compressionStream.readable);
  const writer = compressionStream.writable.getWriter();
  return (
    await Promise.all([response.bytes(), writer.write(val), writer.close()])
  )[0];
};

const decompress = async (
  val: BufferSource,
  format: CompressionFormat,
): Promise<Uint8Array<ArrayBuffer>> => {
  const decompressionStream = new DecompressionStream(format);
  const response = new Response(decompressionStream.readable);
  const writer = decompressionStream.writable.getWriter();
  return (
    await Promise.all([response.bytes(), writer.write(val), writer.close()])
  )[0];
};

export { compress, decompress };
