import { type CustomDocument, Uri } from "vscode";
import { Disposable } from "./disposable";
/**
 * Define the document (the data model) used for paw draw files.
 */
export declare class PDFDocument extends Disposable implements CustomDocument {
    private readonly _uri;
    constructor(uri: Uri);
    get uri(): Uri;
    private readonly _onDidDelete;
    /**
     * Fired when the document is deleted.
     */
    readonly onDidDelete: import("vscode").Event<Uri>;
    private readonly _onDidChange;
    /**
     * Fired to notify webviews that the document has changed.
     */
    readonly onDidChange: import("vscode").Event<Uri>;
    /**
     * Called by VS Code when there are no more references to the document.
     *
     * This happens when all editors for it have been closed.
     */
    dispose(): void;
}
//# sourceMappingURL=pdf_document.d.ts.map