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

'use strict';

(function() {
function loadConfig() {
  const elem = document.getElementById('pdf-view-config');
  if (elem) {
    return JSON.parse(elem.getAttribute('data-config'));
  }
  throw new Error('Could not load configuration.');
}

const config = loadConfig();

window.addEventListener('webviewerloaded', async () => {
  // Wait for viewer to fully initialize.
  await window.PDFViewerApplication.initializedPromise;

  // Open the document.
  window.PDFViewerApplication.open(config.docPath);
}, {once: true});

window.addEventListener('message', async (event) => {
  const currentPageNumber =
      window.PDFViewerApplication.pdfViewer.currentPageNumber;
  switch (event.data.action) {
    case 'reload':
      await window.PDFViewerApplication.open(config.docPath);
      await window.PDFViewerApplication.pdfViewer.pagesPromise;
      window.PDFViewerApplication.pdfViewer.currentPageNumber = Math.min(
          currentPageNumber, window.PDFViewerApplication.pdfViewer.pagesCount);
      break;
  }
});

window.onerror = function() {
  const msg = document.createElement('body');
  msg.innerText =
      'An error occurred while loading the file. Please open it again.';
  document.body = msg;
};
})();
