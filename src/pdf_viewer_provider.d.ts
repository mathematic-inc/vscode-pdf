import { type CustomReadonlyEditorProvider, Disposable, type ExtensionContext, Uri, type WebviewPanel } from "vscode";
import { PDFDocument } from "./pdf_document";
export declare class PDFViewerProvider implements CustomReadonlyEditorProvider {
    static readonly viewType = "pdf.view";
    static register(context: ExtensionContext): Disposable;
    /** Tracks all known webviews */
    private readonly webviews;
    private extensionRoot;
    constructor(context: ExtensionContext);
    openCustomDocument(uri: Uri): Promise<PDFDocument>;
    private UriResolver;
    resolveCustomEditor(document: PDFDocument, webviewPanel: WebviewPanel): Promise<void>;
    private getHtmlForWebview;
}
//# sourceMappingURL=pdf_viewer_provider.d.ts.map