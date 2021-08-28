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

import {Uri, WebviewPanel} from 'vscode';

/** Tracks all webviews. */
export class WebviewCollection {
  private readonly _webviews = new Set<
      {readonly resource: string; readonly webviewPanel: WebviewPanel;}>();

  /** Get all known webviews for a given uri. */
  public * get(uri: Uri): Iterable<WebviewPanel> {
    const key = uri.toString();
    for (const entry of this._webviews) {
      if (entry.resource === key) {
        yield entry.webviewPanel;
      }
    }
  }

  /** Add a new webview to the collection. */
  public add(uri: Uri, webviewPanel: WebviewPanel) {
    const entry = {resource: uri.toString(), webviewPanel};
    this._webviews.add(entry);

    webviewPanel.onDidDispose(() => {
      this._webviews.delete(entry);
    });
  }
}
