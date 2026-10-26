# isomorphic-compress

<!-- Link references -->

[github-actions]: https://www.github.com/jeremy-code/isomorphic-compress/actions/workflows/ci.yml
[github-actions-badge]: https://www.github.com/jeremy-code/isomorphic-compress/actions/workflows/ci.yml/badge.svg
[license-badge]: https://img.shields.io/github/license/jeremy-code/isomorphic-compress

[![GitHub Actions][github-actions-badge]][github-actions] [![License][license-badge]](LICENSE)

## Installation

```shell
npm install libexif-wasm # npm
yarn add libexif-wasm    # yarn
pnpm add libexif-wasm    # pnpm
```

## Usage

```ts
// Import `compress` and `decompress` to select formats "gzip", "deflate" (zlib), or "deflate-raw"
import { compress, decompress } from "isomorphic-compress";

// "H4sIAAAAAAAAE/NIzcnJVyjPL8pJUQQAlRmFGwwAAAA="
(await compress(new TextEncoder().encode("Hello world!"), "gzip")).toBase64();
// "Hello world!"
new TextDecoder().decode(
  await decompress(
    Uint8Array.fromBase64("H4sIAAAAAAAAE/NIzcnJVyjPL8pJUQQAlRmFGwwAAAA="),
    "gzip",
  ),
);

// You can also import each format's respective function (deflate/inflate, gzip/gunzip, zlib/unzlib)
import { zlib, unzlib } from "isomorphic-compress";

(await zlib(new Uint8Array())).toBase64(); // "eJwDAAAAAAE="
(await unzlib(Uint8Array.fromBase64("eJwDAAAAAAE="))).toBase64(); // ""

// Each format (deflate, gzip, zlib)'s entrypoint is also exported
import { deflate, inflate } from "isomorphic-compress/deflate.js";

(await deflate(new Uint8Array())).toBase64(); // "AwA="
(await inflate(Uint8Array.fromBase64("AwA="))).toBase64(); // ""
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
