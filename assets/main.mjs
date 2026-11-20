/*
 * Copyright 2021 Mathematic, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { PDFViewerApplicationOptions } from "./pdf.js/web/viewer.mjs";

const stringOptions = [
  "url",
  "sandboxBundleSrc",
  "cMapUrl",
  "iccUrl",
  "standardFontDataUrl",
  "wasmUrl",
  "imageResourcesPath",
];

/**
 * @param {unknown} value
 * @returns {value is ViewerConfig}
 */
function isViewerConfig(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  /** @type {unknown} */
  const zoom = Reflect.get(value, "defaultZoomValue");
  /** @type {unknown} */
  const sidebar = Reflect.get(value, "sidebarViewOnLoad");
  return (
    stringOptions.every((option) => typeof Reflect.get(value, option) === "string") &&
    (zoom === undefined || typeof zoom === "string") &&
    (sidebar === undefined || typeof sidebar === "number")
  );
}

/** @returns {ViewerConfig} */
function loadConfig() {
  const elem = document.querySelector("#pdf-view-config");
  if (elem instanceof HTMLElement && elem.dataset.config !== undefined) {
    /** @type {unknown} */
    const config = JSON.parse(elem.dataset.config);
    if (isViewerConfig(config)) {
      return config;
    }
  }
  throw new Error("Could not load configuration.");
}

const config = loadConfig();

PDFViewerApplicationOptions.set("defaultUrl", "");
PDFViewerApplicationOptions.set("disablePreferences", true);
PDFViewerApplicationOptions.set("defaultZoomValue", config.defaultZoomValue ?? "auto");
PDFViewerApplicationOptions.set("sidebarViewOnLoad", config.sidebarViewOnLoad ?? 0);
PDFViewerApplicationOptions.set("sandboxBundleSrc", config.sandboxBundleSrc);
PDFViewerApplicationOptions.set("cMapUrl", config.cMapUrl);
PDFViewerApplicationOptions.set("iccUrl", config.iccUrl);
PDFViewerApplicationOptions.set("standardFontDataUrl", config.standardFontDataUrl);
PDFViewerApplicationOptions.set("wasmUrl", config.wasmUrl);
PDFViewerApplicationOptions.set("imageResourcesPath", config.imageResourcesPath);

// Prevent pdf.js from intercepting Ctrl+P/Cmd+P and triggering the print dialog.
document.addEventListener(
  "keydown",
  (/** @type {KeyboardEvent} */ e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },
  true,
);

void (async () => {
  await window.PDFViewerApplication.initializedPromise;
  await window.PDFViewerApplication.open(config);
  await window.PDFViewerApplication.pdfViewer.pagesPromise;
  const [, hash] = config.url.split("#");
  if (hash !== undefined && hash.length > 0) {
    window.PDFViewerApplication.pdfLinkService.setHash(decodeURIComponent(hash));
  }
})();

/** @param {MessageEvent} event */
async function handleMessage(event) {
  if (event.origin !== window.origin) {
    return;
  }

  await window.PDFViewerApplication.initializedPromise;
  const currentPageNumber = window.PDFViewerApplication.pdfViewer.currentPageNumber;
  /** @type {unknown} */
  const message = event.data;
  /** @type {unknown} */
  const action =
    typeof message === "object" && message !== null ? Reflect.get(message, "action") : undefined;
  switch (action) {
    case "reload":
      await window.PDFViewerApplication.open(config);
      await window.PDFViewerApplication.pdfViewer.pagesPromise;
      window.PDFViewerApplication.pdfViewer.currentPageNumber = Math.min(
        currentPageNumber,
        window.PDFViewerApplication.pdfViewer.pagesCount,
      );
      break;
  }
}

window.addEventListener("message", (event) => {
  void handleMessage(event);
});

window.addEventListener("error", (error) => {
  console.error(error);
});
