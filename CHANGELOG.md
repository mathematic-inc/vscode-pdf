# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.12](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.11...v0.1.12) (2026-08-23)


### Features

* Add support for opening relative links to other PDFs ([#9](https://github.com/mathematic-inc/vscode-pdf/issues/9)) ([d9abc8f](https://github.com/mathematic-inc/vscode-pdf/commit/d9abc8fa53f42e2565f66a217e7c402ae07f6104))
* Default zoom, sidebar, Ctrl+P, and drag crash fixes ([#30](https://github.com/mathematic-inc/vscode-pdf/issues/30)) ([0a01b8b](https://github.com/mathematic-inc/vscode-pdf/commit/0a01b8b35f7a77cc3d7f56d251bc06cc747bfdd7))
* Modernize tooling and project structure ([#26](https://github.com/mathematic-inc/vscode-pdf/issues/26)) ([bc9845b](https://github.com/mathematic-inc/vscode-pdf/commit/bc9845b1728046f82ee19afb988db9a32b22e26c))
* Update PDF.js to 4.10.38 ([af2026e](https://github.com/mathematic-inc/vscode-pdf/commit/af2026e5d639f2fd12cdc0bba1c513e9028ae42c))


### Bug Fixes

* Add better error handling ([1ccb135](https://github.com/mathematic-inc/vscode-pdf/commit/1ccb135bd591712e06af4de1ade10ded2657797a))
* Remove error overlay and loaded tracking causing PDF open failures ([#35](https://github.com/mathematic-inc/vscode-pdf/issues/35)) ([93b2ca9](https://github.com/mathematic-inc/vscode-pdf/commit/93b2ca962a84342cdcf6f00a7d87015b1e28934e)), closes [#32](https://github.com/mathematic-inc/vscode-pdf/issues/32)
* Remove worker src ([214015e](https://github.com/mathematic-inc/vscode-pdf/commit/214015e5df474fb557abf7c5bc00fef3e77b7194))
* Resolve VSIX glob path before publishing extension ([#28](https://github.com/mathematic-inc/vscode-pdf/issues/28)) ([54d5272](https://github.com/mathematic-inc/vscode-pdf/commit/54d5272630d89e05bd574d93a6a04cadccaf2956))
* Set loaded=true after open() to prevent overlay manager crash on load ([#33](https://github.com/mathematic-inc/vscode-pdf/issues/33)) ([2073045](https://github.com/mathematic-inc/vscode-pdf/commit/20730456855bff41061a9770305ba307ab7407b9))
* **thumbnails:** Adapt csp to fix thumbnails ([a581b72](https://github.com/mathematic-inc/vscode-pdf/commit/a581b72446c00a1f9cfbf18a2a918b984999d80a))
* **thumbnails:** Adapt csp to fix thumbnails ([#3](https://github.com/mathematic-inc/vscode-pdf/issues/3)) ([7795c28](https://github.com/mathematic-inc/vscode-pdf/commit/7795c28d0e767d78a2482eefa788ee7d29683c2e))
* Update engine ([1f07162](https://github.com/mathematic-inc/vscode-pdf/commit/1f071628f8fbd3d119000ba9c8d99a426706f4b6))
* Update pdf.js to fix viewer initialization errors ([#37](https://github.com/mathematic-inc/vscode-pdf/issues/37)) ([7934a12](https://github.com/mathematic-inc/vscode-pdf/commit/7934a122f124165f182d39e90e5ad35550c5ffce)), closes [#32](https://github.com/mathematic-inc/vscode-pdf/issues/32)

## [0.1.11](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.10...v0.1.11) (2026-03-13)


### Bug Fixes

* Update pdf.js to fix viewer initialization errors ([#37](https://github.com/mathematic-inc/vscode-pdf/issues/37)) ([5b471bb](https://github.com/mathematic-inc/vscode-pdf/commit/5b471bb747b2897faa2283d66e97a45e9b1c3ef4)), closes [#32](https://github.com/mathematic-inc/vscode-pdf/issues/32)

## [0.1.10](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.9...v0.1.10) (2026-03-12)


### Bug Fixes

* Remove error overlay and loaded tracking causing PDF open failures ([#35](https://github.com/mathematic-inc/vscode-pdf/issues/35)) ([053a47f](https://github.com/mathematic-inc/vscode-pdf/commit/053a47f66b4910ed361c17d917cf3f6dd03994c8)), closes [#32](https://github.com/mathematic-inc/vscode-pdf/issues/32)

## [0.1.9](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.8...v0.1.9) (2026-03-11)


### Bug Fixes

* Set loaded=true after open() to prevent overlay manager crash on load ([#33](https://github.com/mathematic-inc/vscode-pdf/issues/33)) ([bb0f4d5](https://github.com/mathematic-inc/vscode-pdf/commit/bb0f4d53670780bb9b13e26428a62dca4585f8fb))

## [0.1.8](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.7...v0.1.8) (2026-03-11)


### Features

* Default zoom, sidebar, Ctrl+P, and drag crash fixes ([#30](https://github.com/mathematic-inc/vscode-pdf/issues/30)) ([50a181b](https://github.com/mathematic-inc/vscode-pdf/commit/50a181b5eb323c37899ae67c15f89e18f5ff6327))

## [0.1.7](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.6...v0.1.7) (2026-03-11)


### Features

* Modernize tooling and project structure ([#26](https://github.com/mathematic-inc/vscode-pdf/issues/26)) ([b9ab389](https://github.com/mathematic-inc/vscode-pdf/commit/b9ab389391ef64d369ebc0f4ef034c0ad231c54c))

## [0.1.6](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.5...v0.1.6) (2025-04-16)


### Features

* Add support for opening relative links to other PDFs ([#9](https://github.com/mathematic-inc/vscode-pdf/issues/9)) ([0dd02b7](https://github.com/mathematic-inc/vscode-pdf/commit/0dd02b71650fba7b1fb2d25259913aae272aa468))

## [0.1.5](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.4...v0.1.5) (2025-02-02)


### Bug Fixes

* Remove worker src ([ba13d00](https://github.com/mathematic-inc/vscode-pdf/commit/ba13d001e982b87e39ec05fc4a17bc3fe6692257))

## [0.1.4](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.3...v0.1.4) (2025-01-28)


### Bug Fixes

* Add better error handling ([0fa5989](https://github.com/mathematic-inc/vscode-pdf/commit/0fa5989c7c7225daa98481f75a6c8dd75197ced3))

## [0.1.3](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.2...v0.1.3) (2025-01-28)


### Bug Fixes

* **thumbnails:** Adapt csp to fix thumbnails ([7a773f5](https://github.com/mathematic-inc/vscode-pdf/commit/7a773f5e3e1e835fb15a15d2774e06d0feab80a1))
* **thumbnails:** Adapt csp to fix thumbnails ([#3](https://github.com/mathematic-inc/vscode-pdf/issues/3)) ([a847b6c](https://github.com/mathematic-inc/vscode-pdf/commit/a847b6cc922fa3845efe76956e5bb9cd23a62dec))

## [0.1.2](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.1...v0.1.2) (2025-01-12)


### Bug Fixes

* Update engine ([8cd4434](https://github.com/mathematic-inc/vscode-pdf/commit/8cd4434985a1d961e6db8e0a7338d9d89ae9efe1))

## [0.1.1](https://github.com/mathematic-inc/vscode-pdf/compare/v0.1.0...v0.1.1) (2025-01-12)


### Features

* Update PDF.js to 4.10.38 ([db6b881](https://github.com/mathematic-inc/vscode-pdf/commit/db6b8813c9a18bfbd39276d35ec313f2702134d6))

## [0.0.6]

- Retain page number on refresh.

## [0.0.5]

- Fix issue where sidebar opens on PDF update.

## [0.0.4]

- Fix links.

## [0.0.3]

- Keep sidebar closed.
- Disable printing, opening, and download keyboard shortcuts.

## [0.0.2]

- Add license.
- Remove inactive button.

## [0.0.1]

- Initial release
