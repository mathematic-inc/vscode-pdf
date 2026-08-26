import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = dirname(import.meta.dirname);
const read = (path) => readFileSync(join(root, path), "utf8");

const viewerHtml = read("assets/pdf.js/web/viewer.html");
const provider = read("src/pdf-viewer-provider.ts");
const main = read("assets/main.mjs");
const patch = read("patches/pdf.js.patch");

assert.equal(viewerHtml.match(/Content-Security-Policy/gu)?.length ?? 0, 0);
assert.equal(provider.match(/Content-Security-Policy/gu)?.length ?? 0, 1);
for (const directive of ["'wasm-unsafe-eval'", "base-uri 'none'", "form-action 'none'"]) {
  assert.ok(provider.includes(directive), `Missing CSP directive: ${directive}`);
}

for (const tag of [
  '<link rel="resource" type="application/l10n" href="locale/locale.json" />',
  '<script src="../build/pdf.mjs" type="module"></script>',
  '<script src="viewer.mjs" type="module"></script>',
  '<link rel="stylesheet" href="viewer.css" />',
]) {
  assert.equal(viewerHtml.split(tag).length, 2, `Expected one PDF.js tag: ${tag}`);
}

const assets = new Map([
  ["workerSrc", "assets/pdf.js/build/pdf.worker.mjs"],
  ["sandboxBundleSrc", "assets/pdf.js/build/pdf.sandbox.mjs"],
  ["cMapUrl", "assets/pdf.js/web/cmaps/LICENSE"],
  ["iccUrl", "assets/pdf.js/web/iccs/CGATS001Compat-v2-micro.icc"],
  ["standardFontDataUrl", "assets/pdf.js/web/standard_fonts/LICENSE_FOXIT"],
  ["wasmUrl", "assets/pdf.js/web/wasm/openjpeg.wasm"],
  ["imageResourcesPath", "assets/pdf.js/web/images/annotation-note.svg"],
]);

for (const [option, path] of assets) {
  assert.ok(provider.includes(`${option}:`), `Missing provider option: ${option}`);
  assert.ok(main.includes(`set("${option}"`), `Missing viewer option: ${option}`);
  assert.ok(existsSync(join(root, path)), `Missing PDF.js asset: ${path}`);
}

for (const snippet of [
  "super.addLinkAttributes(link, url, newWindow)",
  "url.startsWith(this.#resourceRoot)",
  "event.preventDefault()",
]) {
  assert.ok(patch.includes(snippet), `Missing link guard: ${snippet}`);
}
for (const snippet of ["targetUrl.origin", "resourceRootUrl.pathname", "Uri.joinPath"]) {
  assert.ok(provider.includes(snippet), `Missing message guard: ${snippet}`);
}
assert.ok(!`${provider}\n${patch}`.includes("vscode-cdn"), "Found a fixed webview CDN host");

const localeRoot = join(root, "assets/pdf.js/web/locale");
const locales = Object.values(JSON.parse(read("assets/pdf.js/web/locale/locale.json")));
for (const locale of locales) {
  assert.ok(existsSync(join(localeRoot, locale)), `Missing locale: ${locale}`);
}

const cssRoot = join(root, "assets/pdf.js/web");
const css = read("assets/pdf.js/web/viewer.css");
const cssUrls = [...css.matchAll(/url\((?:"|')?([^"')]+)(?:"|')?\)/gu)].map((match) => match[1]);
for (const url of cssUrls) {
  if (url?.startsWith("data:") || url?.startsWith("#")) {
    continue;
  }
  assert.ok(existsSync(join(cssRoot, url)), `Missing CSS asset: ${url}`);
}

process.stdout.write(`PDF.js assets verified (${locales.length} locales).\n`);
