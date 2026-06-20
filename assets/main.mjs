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
  const elem = document.getElementById("pdf-view-config");
  if (elem) {
    return JSON.parse(elem.getAttribute("data-config"));
  }
  throw new Error("Could not load configuration.");
}

const config = loadConfig();
let updateNavigationHistory;

function setupNavigationHistory() {
  const application = window.PDFViewerApplication;
  const history = application.pdfHistory;
  const findButtonContainer =
    document.getElementById("viewFindButton")?.parentElement;

  if (!(history && findButtonContainer)) {
    return;
  }

  const container = document.createElement("div");
  container.className = "toolbarHorizontalGroup hiddenSmallView";
  container.innerHTML = `
    <button id="navigateBack" class="toolbarButton" type="button" disabled title="Go Back" aria-label="Go Back">
      <span>Go Back</span>
    </button>
    <div class="splitToolbarButtonSeparator"></div>
    <button id="navigateForward" class="toolbarButton" type="button" disabled title="Go Forward" aria-label="Go Forward">
      <span>Go Forward</span>
    </button>`;
  findButtonContainer.after(container);

  const backButton = document.getElementById("navigateBack");
  const forwardButton = document.getElementById("navigateForward");
  const updateButtons = () => {
    backButton.disabled = !history.canGoBack;
    forwardButton.disabled = !history.canGoForward;
  };

  backButton.addEventListener("click", () => history.back());
  forwardButton.addEventListener("click", () => history.forward());
  window.addEventListener("popstate", () => queueMicrotask(updateButtons));
  application.eventBus.on("updateviewarea", updateButtons);

  updateButtons();
  return updateButtons;
}

PDFViewerApplicationOptions.set("defaultUrl", "");
PDFViewerApplicationOptions.set("disablePreferences", true);
PDFViewerApplicationOptions.set(
  "defaultZoomValue",
  config.defaultZoomValue ?? "auto"
);
PDFViewerApplicationOptions.set(
  "sidebarViewOnLoad",
  config.sidebarViewOnLoad ?? 0
);

// Prevent pdf.js from intercepting Ctrl+P/Cmd+P and triggering the print dialog.
document.addEventListener(
  "keydown",
  (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "p") {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },
  true
);

void (async () => {
  await window.PDFViewerApplication.initializedPromise;
  updateNavigationHistory = setupNavigationHistory();
  await window.PDFViewerApplication.open(config);
  updateNavigationHistory?.();
  const [, hash] = config.url.split("#");
  if (hash) {
    window.PDFViewerApplication.pdfLinkService.setHash(
      decodeURIComponent(hash)
    );
  }
})();

window.addEventListener("message", async (event) => {
  await window.PDFViewerApplication.initializedPromise;
  const currentPageNumber =
    window.PDFViewerApplication.pdfViewer.currentPageNumber;
  switch (event.data.action) {
    case "reload":
      await window.PDFViewerApplication.open(config);
      await window.PDFViewerApplication.pdfViewer.pagesPromise;
      window.PDFViewerApplication.pdfViewer.currentPageNumber = Math.min(
        currentPageNumber,
        window.PDFViewerApplication.pdfViewer.pagesCount
      );
      updateNavigationHistory?.();
      break;
  }
});

window.addEventListener("error", (error) => {
  console.error(error);
});
