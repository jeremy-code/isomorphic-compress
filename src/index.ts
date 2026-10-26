import { compress, decompress } from "isomorphic-compress/compress.js";
import { deflate, inflate } from "isomorphic-compress/deflate.js";
import { gzip, gunzip } from "isomorphic-compress/gzip.js";
import { zlib, unzlib } from "isomorphic-compress/zlib.js";

// https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/6843e1fa99039becc9a796fbcaaf577f5c4992e1/baselines/dom.generated.d.ts#L45179
type CompressionFormat = "deflate" | "deflate-raw" | "gzip";

// https://github.com/microsoft/TypeScript-DOM-lib-generator/blob/6843e1fa99039becc9a796fbcaaf577f5c4992e1/baselines/dom.generated.d.ts#L45035
type BufferSource = ArrayBufferView<ArrayBuffer> | ArrayBuffer;

export {
  type CompressionFormat,
  type BufferSource,
  compress,
  decompress,
  deflate,
  inflate,
  gzip,
  gunzip,
  zlib,
  unzlib,
};
