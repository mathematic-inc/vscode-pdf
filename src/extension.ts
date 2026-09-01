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

import { env, type ExtensionContext, Uri, window } from "vscode";

import { PDFViewerProvider } from "./pdf-viewer-provider";

export function activate(context: ExtensionContext): void {
  if (!context.globalState.get<boolean>("supportPromptShown")) {
    void context.globalState.update("supportPromptShown", true);
    void window
      .showInformationMessage(
        "Mathematic is a 501(c)(3) non-profit. Please consider supporting our free, open-source work.",
        "Support Mathematic",
      )
      .then((selection) => {
        if (selection === "Support Mathematic") {
          void env.openExternal(Uri.parse("https://github.com/sponsors/mathematic-inc"));
        }
      });
  }

  context.subscriptions.push(PDFViewerProvider.register(context));
}

export function deactivate() {
  // noop
}
