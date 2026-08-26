/*
 * Copyright 2021 Mathematic Inc
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

import { join } from "node:path";

import {
  type CustomReadonlyEditorProvider,
  commands,
  type Disposable,
  type ExtensionContext,
  Uri,
  type Webview,
  type WebviewPanel,
  window,
  workspace,
} from "vscode";

import rawViewerHtml from "../assets/pdf.js/web/viewer.html";
import { disposeAll } from "./disposable";
import { PDFDocument } from "./pdf-document";
import { escapeAttribute } from "./utils";
import { WebviewCollection } from "./webview-collection";

const viewerHtml = rawViewerHtml
  .replace(
    /* html */
    `<link rel="resource" type="application/l10n" href="locale/locale.json" />`,
    "",
  )
  .replace(/* html */ `<script src="../build/pdf.mjs" type="module"></script>`, "")
  .replace(/* html */ `<script src="viewer.mjs" type="module"></script>`, "")
  .replace(/* html */ `<link rel="stylesheet" href="viewer.css" />`, "");

const resourcePathRegex = /\/[^/]+?\.\w+$/u;

function withTrailingSlash(uri: Uri): string {
  const value = uri.toString();
  return value.endsWith("/") ? value : `${value}/`;
}

export class PDFViewerProvider implements CustomReadonlyEditorProvider {
  static readonly viewType = "pdf.view";

  static register(context: ExtensionContext) {
    return window.registerCustomEditorProvider(
      PDFViewerProvider.viewType,
      new PDFViewerProvider(context),
      {
        supportsMultipleEditorsPerDocument: false,
      },
    );
  }

  /** Tracks all known webviews */
  private readonly webviews = new WebviewCollection();

  private readonly extensionRoot: Uri;

  constructor(context: ExtensionContext) {
    this.extensionRoot = Uri.file(context.extensionPath);
  }

  openCustomDocument(uri: Uri) {
    const document = new PDFDocument(uri);

    const listeners: Disposable[] = [];

    listeners.push(
      document.onDidChange((e) => {
        // Update all webviews when the document changes
        for (const webviewPanel of this.webviews.get(e)) {
          webviewPanel.webview.postMessage({ action: "reload" });
        }
      }),
    );

    document.onDidDelete(() => disposeAll(listeners));

    return document;
  }

  private UriResolver(webview: Webview) {
    return (...paths: string[]): Uri =>
      webview.asWebviewUri(Uri.file(join(this.extensionRoot.path, ...paths)));
  }

  resolveCustomEditor(document: PDFDocument, webviewPanel: WebviewPanel): void {
    // Add the webview to our internal set of active webviews
    this.webviews.add(document.uri, webviewPanel);

    // Setup initial content for the webview
    const resourceRoot = document.uri.with({
      path: document.uri.path.replace(resourcePathRegex, "/"),
    });
    const webviewResourceRoot = withTrailingSlash(webviewPanel.webview.asWebviewUri(resourceRoot));
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [resourceRoot, this.extensionRoot],
    };

    webviewPanel.webview.html = this.getHtmlForWebview(
      document,
      webviewPanel.webview,
      resourceRoot,
    );

    webviewPanel.webview.onDidReceiveMessage(async (message: unknown) => {
      if (
        typeof message !== "object" ||
        message === null ||
        !("open" in message) ||
        typeof message.open !== "string"
      ) {
        return;
      }

      try {
        const resourceRootUrl = new URL(webviewResourceRoot);
        const targetUrl = new URL(message.open);
        if (
          targetUrl.origin !== resourceRootUrl.origin ||
          !targetUrl.pathname.startsWith(resourceRootUrl.pathname)
        ) {
          return;
        }

        const relativePath = decodeURIComponent(
          targetUrl.pathname.slice(resourceRootUrl.pathname.length),
        );
        const fragment = decodeURIComponent(targetUrl.hash.slice(1));
        await commands.executeCommand(
          "vscode.open",
          Uri.joinPath(resourceRoot, relativePath).with({ fragment }),
        );
      } catch {
        // Ignore malformed or non-local messages from the webview.
      }
    });
  }

  private getHtmlForWebview(document: PDFDocument, webview: Webview, resourceRoot: Uri): string {
    const resolveUri = this.UriResolver(webview);
    const resolveAssetURI = (...paths: string[]) => resolveUri("assets", ...paths);
    const resolvePdfJsURI = (...paths: string[]) => resolveUri("assets", "pdf.js", ...paths);

    const cspSource = webview.cspSource;

    const config = workspace.getConfiguration("pdf", document.uri);
    const settings = {
      url: `${webview.asWebviewUri(document.uri)}`,
      docBaseUrl: `${webview.asWebviewUri(document.uri)}`,
      resourceRoot: withTrailingSlash(webview.asWebviewUri(resourceRoot)),
      defaultZoomValue: config.get<string>("defaultZoomValue", "auto"),
      sidebarViewOnLoad: config.get<number>("sidebarViewOnLoad", 0),
      workerSrc: `${resolvePdfJsURI("build", "pdf.worker.mjs")}`,
      sandboxBundleSrc: `${resolvePdfJsURI("build", "pdf.sandbox.mjs")}`,
      cMapUrl: withTrailingSlash(resolvePdfJsURI("web", "cmaps")),
      iccUrl: withTrailingSlash(resolvePdfJsURI("web", "iccs")),
      standardFontDataUrl: withTrailingSlash(resolvePdfJsURI("web", "standard_fonts")),
      wasmUrl: withTrailingSlash(resolvePdfJsURI("web", "wasm")),
      imageResourcesPath: withTrailingSlash(resolvePdfJsURI("web", "images")),
    };

    return viewerHtml
      .replace(
        /* html */ "<title>PDF.js viewer</title>",
        /* html */
        `
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src ${cspSource} blob: data:; script-src ${cspSource} 'wasm-unsafe-eval'; worker-src ${cspSource} blob:; style-src ${cspSource} 'unsafe-inline'; img-src ${cspSource} blob: data:; font-src ${cspSource} data:; media-src blob:; base-uri 'none'; form-action 'none';">
<meta id="pdf-view-config" data-config="${escapeAttribute(settings)}">

<title>PDF.js viewer</title>

<link rel="stylesheet" href="${resolvePdfJsURI("web", "viewer.css")}">
<link rel="stylesheet" href="${resolveAssetURI("main.css")}">

<script src="${resolvePdfJsURI("build", "pdf.mjs")}" type="module"></script>
<script src="${resolveAssetURI("main.mjs")}" type="module"></script>

<link rel="resource" type="application/l10n" href="${resolvePdfJsURI(
          "web",
          "locale",
          "locale.json",
        )}">`,
      )
      .trim();
  }
}
