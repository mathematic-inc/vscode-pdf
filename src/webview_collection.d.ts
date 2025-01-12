import { Uri, type WebviewPanel } from "vscode";
/** Tracks all webviews. */
export declare class WebviewCollection {
    private readonly _webviews;
    /** Get all known webviews for a given uri. */
    get(uri: Uri): Iterable<WebviewPanel>;
    /** Add a new webview to the collection. */
    add(uri: Uri, webviewPanel: WebviewPanel): void;
}
//# sourceMappingURL=webview_collection.d.ts.map