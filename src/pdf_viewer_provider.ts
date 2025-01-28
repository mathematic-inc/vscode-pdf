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

import { join } from "path";
import {
  type CustomReadonlyEditorProvider,
  Disposable,
  type ExtensionContext,
  Uri,
  type Webview,
  type WebviewPanel,
  window,
  workspace,
} from "vscode";

import rawViewerHtml from "../assets/pdf.js/web/viewer.html";

import { disposeAll } from "./disposable";
import { PDFDocument } from "./pdf_document";
import { escapeAttribute } from "./utils";
import { WebviewCollection } from "./webview_collection";

const viewerHtml = rawViewerHtml
  .replace(
    /* html */
    `<link rel="resource" type="application/l10n" href="locale/locale.json">`,
    ""
  )
  .replace(
    /* html */ `<script src="../build/pdf.mjs" type="module"></script>`,
    ""
  )
  .replace(/* html */ `<script src="viewer.mjs" type="module"></script>`, "")
  .replace(/* html */ `<link rel="stylesheet" href="viewer.css">`, "");

export class PDFViewerProvider implements CustomReadonlyEditorProvider {
  public static readonly viewType = "pdf.view";

  public static register(context: ExtensionContext) {
    return window.registerCustomEditorProvider(
      PDFViewerProvider.viewType,
      new PDFViewerProvider(context),
      {
        supportsMultipleEditorsPerDocument: false,
      }
    );
  }

  /** Tracks all known webviews */
  private readonly webviews = new WebviewCollection();

  private extensionRoot: Uri;

  constructor(context: ExtensionContext) {
    this.extensionRoot = Uri.file(context.extensionPath);
  }

  async openCustomDocument(uri: Uri) {
    const document = new PDFDocument(uri);

    const listeners: Disposable[] = [];

    listeners.push(
      document.onDidChange((e) => {
        // Update all webviews when the document changes
        for (const webviewPanel of this.webviews.get(e)) {
          webviewPanel.webview.postMessage({ action: "reload" });
        }
      })
    );

    document.onDidDelete(() => disposeAll(listeners));

    return document;
  }

  private UriResolver(webview: Webview) {
    return (...paths: string[]): Uri =>
      webview.asWebviewUri(Uri.file(join(this.extensionRoot.path, ...paths)));
  }

  async resolveCustomEditor(
    document: PDFDocument,
    webviewPanel: WebviewPanel
  ): Promise<void> {
    // Add the webview to our internal set of active webviews
    this.webviews.add(document.uri, webviewPanel);

    // Setup initial content for the webview
    const resourceRoot = document.uri.with({
      path: document.uri.path.replace(/\/[^/]+?\.\w+$/, "/"),
    });
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [resourceRoot, this.extensionRoot],
    };

    webviewPanel.webview.html = this.getHtmlForWebview(
      document,
      webviewPanel.webview
    );
  }

  private getHtmlForWebview(document: PDFDocument, webview: Webview): string {
    const resolveUri = this.UriResolver(webview);
    const resolveAssetURI = (...paths: string[]) =>
      resolveUri("assets", ...paths);
    const resolvePdfJsURI = (...paths: string[]) =>
      resolveUri("assets", "pdf.js", ...paths);

    const cspSource = webview.cspSource;

    const pageColorTheme = workspace
      .getConfiguration("vscode-pdf")
      .get("pageColorTheme");

    const settings = {
      url: `${webview.asWebviewUri(document.uri)}`,
      workerSrc: `${resolvePdfJsURI("build", "pdf.worker.mjs")}`,
      pageColorTheme,
    };

    return viewerHtml
      .replace(
        /* html */ `<title>PDF.js viewer</title>`,
        /* html */
        `
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${cspSource}; script-src 'unsafe-inline' ${cspSource}; worker-src blob: ${cspSource}; style-src 'unsafe-inline' ${cspSource}; img-src * ${cspSource} data:;">
<meta id="pdf-view-config" data-config="${escapeAttribute(settings)}">

<title>PDF.js viewer</title>

<link rel="stylesheet" href="${resolvePdfJsURI("web", "viewer.css")}">
<link rel="stylesheet" href="${resolveAssetURI("main.css")}">

<script src="${resolvePdfJsURI("build", "pdf.mjs")}" type="module"></script>
<script src="${resolveAssetURI("main.mjs")}" type="module"></script>

<link rel="resource" type="application/l10n" href="${resolvePdfJsURI(
          "web",
          "locale",
          "locale.json"
        )}">`
      )
      .trim();
  }
}
