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

import { type ExtensionContext, window, commands, workspace, StatusBarAlignment } from "vscode";
import { PDFViewerProvider } from "./pdf_viewer_provider";

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(PDFViewerProvider.register(context));

  // Add Status Bar Item for Dark Mode
  const darkModeStatusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 100);
  darkModeStatusBarItem.command = "pdf.toggleDarkMode";
  darkModeStatusBarItem.tooltip = "Toggle PDF Dark Mode";
  context.subscriptions.push(darkModeStatusBarItem);

  const updateStatusBar = () => {
    const enabled = workspace.getConfiguration("pdf").get<boolean>("enableDarkMode", false);
    darkModeStatusBarItem.text = enabled ? "$(moon) PDF Dark" : "$(sun) PDF Light";
    darkModeStatusBarItem.show();
  };

  context.subscriptions.push(workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration("pdf.enableDarkMode")) {
          updateStatusBar();
      }
  }));

  updateStatusBar();

  // Register Toggle Command
  context.subscriptions.push(commands.registerCommand("pdf.toggleDarkMode", async () => {
      const config = workspace.getConfiguration("pdf");
      const current = config.get<boolean>("enableDarkMode", false);
      await config.update("enableDarkMode", !current, true); // true = updates in Global settings
  }));
}

export function deactivate() {}
