# isomorphic-compress

<!-- Link references -->

[github-actions]: https://www.github.com/jeremy-code/isomorphic-compress/actions/workflows/ci.yml
[github-actions-badge]: https://www.github.com/jeremy-code/isomorphic-compress/actions/workflows/ci.yml/badge.svg
[license-badge]: https://img.shields.io/github/license/jeremy-code/isomorphic-compress
[npm-version-badge]: https://img.shields.io/npm/v/isomorphic-compress
[npm-package]: https://www.npmjs.com/package/isomorphic-compress
[npm-package-size-badge]: https://badgen.net/packagephobia/install/isomorphic-compress
[npm-package-size]: https://packagephobia.com/result?p=isomorphic-compress

[![GitHub Actions][github-actions-badge]][github-actions] [![License][license-badge]](LICENSE) [![NPM version][npm-version-badge]][npm-package] [![NPM package size][npm-package-size-badge]][npm-package-size]

## Installation

```shell
npm install isomorphic-compress # npm
yarn add isomorphic-compress    # yarn
pnpm add isomorphic-compress    # pnpm
```

## Usage

Documentation is also avaliable at this URL: https://npmx.dev/package-docs/isomorphic-compress.

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

## Notes

### Why should I use this over `fflate`, `pako`?

In Node.js, `isomorphic-compress` uses the native zlib API; in other runtimes, including browsers, it uses the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API). This means the library has a tiny code footprint compared to JavaScript-based implementations. Furthermore, a native implementation is faster; according to Facebook benchmarks,native compression libraries outperformed their JavaScript counterparts by 20x and their WebAssembly counterparts by 10x.[^1]

However, there are some caveats. Since the browser implementation is backed by the Compression Streams API, the compression and decompression functions are all asynchronous. This also means that performance will suffer for small inputs due to the overhead of promises.

### Why shouldn't I just use the Compression Streams API?

You probably should if you fully intend on writing runtime-agnostic code, as Node.js has supported the feature since Node 18.[^2] However, there is a large performance hit that occurs when using the Node.js Compression Streams API. Vercel found that Node.js web streams could be improved by 10x by recreating their interfaces with Node streams.[^3] Furthermore, there is also reduced performance when the data is already loaded into memory and is not streamed.

By instead using the native zlib API in Node, compression and decompression have signficantly higher throughput. This package does this with [conditional exports](https://nodejs.org/api/packages.html#conditional-exports).

### Why are the functions named like that?

I used the function naming scheme of `fflate` for the individual functions:

|           `pako`            |       `fflate`        |       Node.js `zlib`        |
| :-------------------------: | :-------------------: | :-------------------------: |
|    `deflate` / `inflate`    |   `zlib` / `unzlib`   |    `deflate` / `inflate`    |
| `deflateRaw` / `inflateRaw` | `deflate` / `inflate` | `deflateRaw` / `inflateRaw` |
|      `gzip` / `ungzip`      |   `gzip` / `gunzip`   |      `gzip` / `gunzip`      |

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Footnotes

[^1]: https://github.com/whatwg/compression/blob/main/explainer.md#motivation

[^2]: https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API#browser_compatibility

[^3]: https://vercel.com/blog/we-ralph-wiggumed-webstreams-to-make-them-10x-faster
