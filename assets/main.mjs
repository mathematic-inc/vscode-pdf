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

function loadConfig() {
  const elem = document.querySelector("#pdf-view-config");
  if (elem) {
    return JSON.parse(elem.dataset.config);
  }
  throw new Error("Could not load configuration.");
}

const config = loadConfig();

PDFViewerApplicationOptions.set("defaultUrl", "");
PDFViewerApplicationOptions.set("disablePreferences", true);
PDFViewerApplicationOptions.set("defaultZoomValue", config.defaultZoomValue ?? "auto");
PDFViewerApplicationOptions.set("sidebarViewOnLoad", config.sidebarViewOnLoad ?? 0);
PDFViewerApplicationOptions.set("workerSrc", config.workerSrc);
PDFViewerApplicationOptions.set("sandboxBundleSrc", config.sandboxBundleSrc);
PDFViewerApplicationOptions.set("cMapUrl", config.cMapUrl);
PDFViewerApplicationOptions.set("iccUrl", config.iccUrl);
PDFViewerApplicationOptions.set("standardFontDataUrl", config.standardFontDataUrl);
PDFViewerApplicationOptions.set("wasmUrl", config.wasmUrl);
PDFViewerApplicationOptions.set("imageResourcesPath", config.imageResourcesPath);

// Prevent pdf.js from intercepting Ctrl+P/Cmd+P and triggering the print dialog.
document.addEventListener(
  "keydown",
  (e) => {
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
  if (hash) {
    window.PDFViewerApplication.pdfLinkService.setHash(decodeURIComponent(hash));
  }
})();

window.addEventListener("message", async (event) => {
  if (event.origin !== window.origin) {
    return;
  }

  await window.PDFViewerApplication.initializedPromise;
  const currentPageNumber = window.PDFViewerApplication.pdfViewer.currentPageNumber;
  switch (event.data.action) {
    case "reload":
      await window.PDFViewerApplication.open(config);
      await window.PDFViewerApplication.pdfViewer.pagesPromise;
      window.PDFViewerApplication.pdfViewer.currentPageNumber = Math.min(
        currentPageNumber,
        window.PDFViewerApplication.pdfViewer.pagesCount,
      );
      break;
  }
});

window.addEventListener("error", (error) => {
  console.error(error);
});
