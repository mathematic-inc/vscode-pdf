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

import {CustomDocument, EventEmitter, Uri, workspace} from 'vscode';
import {Disposable} from './disposable';

function areUriEqual(l: Uri, r: Uri) {
  return `${l}` === `${r}`;
}

/**
 * Define the document (the data model) used for paw draw files.
 */
export class PDFDocument extends Disposable implements CustomDocument {
  private readonly _uri: Uri;

  constructor(uri: Uri) {
    super();
    this._uri = uri;

    const watcher =
        this._register(workspace.createFileSystemWatcher(uri.fsPath));

    const onChangeHandler = (e: Uri) => {
      if (areUriEqual(e, uri)) {
        this._onDidChange.fire(e);
      }
    };

    this._register(watcher.onDidChange(onChangeHandler));
    this._register(watcher.onDidCreate(onChangeHandler));
  }

  public get uri() {
    return this._uri;
  }

  private readonly _onDidDelete = this._register(new EventEmitter<Uri>());
  /**
   * Fired when the document is deleted.
   */
  public readonly onDidDelete = this._onDidDelete.event;

  private readonly _onDidChange = this._register(new EventEmitter<Uri>());
  /**
   * Fired to notify webviews that the document has changed.
   */
  public readonly onDidChange = this._onDidChange.event;

  /**
   * Called by VS Code when there are no more references to the document.
   *
   * This happens when all editors for it have been closed.
   */
  dispose(): void {
    this._onDidDelete.fire(this.uri);
    super.dispose();
  }
}
