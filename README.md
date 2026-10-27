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

Uses the native `zlib` API in Node.js and the Compression Streams API everywhere else. Tiny bundle with native performance.

## Installation

```shell
npm install isomorphic-compress # npm
yarn add isomorphic-compress    # yarn
pnpm add isomorphic-compress    # pnpm
```

## Usage

Documentation is also available at this URL: https://npmx.dev/package-docs/isomorphic-compress.

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

## Compatibility

The Compression Streams API is baseline available across all browsers since May 2023 for compression formats `deflate`, `gzip`, and `deflate-raw`.[^1]

| Compression format | Chrome | Edge | Firefox | Safari |
| ------------------ | :----: | :--: | :-----: | :----: |
| deflate            |   80   |  80  |   113   |  16.4  |
| deflate-raw        |  103   | 103  |   113   |  16.4  |
| gzip               |   80   |  80  |   113   |  16.4  |

Node.js added support for `deflate`, `gzip`, and `deflateRaw` in Node v0.6.0[^2] and `util.promisify` in v8.0.0.[^3] Node.js has supported conditional exports since version 12.16.0.[^4] This package is supported for Bun v0.5.2 and Deno v2.4.

<!-- I think it also has to be prefixed with npm: before v2.8, but Cloudflare bought Deno, so this amount of specificity is unimportant. (https://deno.com/blog/v2.8#deno-now-defaults-to-npm )-->

<!-- `node:zlib` support was introdued in Deno 1.32.2 (https://github.com/denoland/deno/blob/main/Releases.md#1322--20230331) and Bun v0.5.2 (https://bun.com/blog/bun-v0.5.2#node-js-compatibility-fixes). `util.promisify` support was added in [Deno 1.1.0](https://github.com/denoland/deno/blob/main/Releases.md#110--20200612) and Bun v0.4 (https://bun.com/blog/bun-v0.4.0#node-js-compatibility) (https://github.com/oven-sh/bun/blob/8c8accf968e4e108a6fcdaf4158440886cf476d8/src/bun.js/util.exports.js). Deno supported conditional exports with `node` condition since v2.4 (https://deno.com/blog/v2.4#conditional-packagejson-exports) and Bun since v0.5.0. (https://bun.com/blog/bun-v0.5.0#module-resolution-changes) -->

## Notes

### Why should I use this over `fflate`, `pako`?

In Node.js, `isomorphic-compress` uses the native `zlib` API; in other runtimes, including browsers, it uses the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API). This means the library has a tiny code footprint compared to JavaScript-based implementations. Furthermore, a native implementation is faster; according to Facebook benchmarks, native compression libraries outperformed their JavaScript counterparts by 20x and their WebAssembly counterparts by 10x.[^5]

However, there are some caveats. Since the browser implementation is backed by the Compression Streams API, the compression and decompression functions are all asynchronous. This also means that performance will suffer for small inputs due to the overhead of promises.

### Why shouldn't I just use the Compression Streams API?

You probably should if you fully intend to write runtime-agnostic code, as Node.js has supported the feature since Node 18.[^1] However, there is a large performance hit that occurs when using the Node.js Compression Streams API. Vercel found that Node.js web streams could be improved by 10x by recreating their interfaces with Node streams.[^6] Furthermore, there is also reduced performance when the data is already loaded into memory and is not streamed.

By instead using the native `zlib` API in Node, compression and decompression have significantly higher throughput. This package does this with [conditional exports](https://nodejs.org/api/packages.html#conditional-exports).

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

[^1]: https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API#browser_compatibility

[^2]: https://nodejs.org/api/zlib.html#zlibdeflatebuffer-options-callback

[^3]: https://nodejs.org/api/util.html#utilpromisifyoriginal

[^4]: https://nodejs.org/api/packages.html#conditional-exports

[^5]: https://github.com/whatwg/compression/blob/main/explainer.md#motivation

[^6]: https://vercel.com/blog/we-ralph-wiggumed-webstreams-to-make-them-10x-faster
