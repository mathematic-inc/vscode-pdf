// Only the parts of the PDF.js viewer that main.mjs uses. src/pdf-viewer-provider.ts writes
// ViewerConfig.

interface ViewerConfig {
  readonly url: string;
  readonly defaultZoomValue?: string;
  readonly sidebarViewOnLoad?: number;
  readonly sandboxBundleSrc: string;
  readonly cMapUrl: string;
  readonly iccUrl: string;
  readonly standardFontDataUrl: string;
  readonly wasmUrl: string;
  readonly imageResourcesPath: string;
}

interface Window {
  readonly PDFViewerApplication: {
    readonly initializedPromise: Promise<void>;
    readonly open: (config: Readonly<ViewerConfig>) => Promise<void>;
    readonly pdfViewer: {
      readonly pagesPromise: Promise<void>;
      readonly pagesCount: number;
      currentPageNumber: number;
    };
    readonly pdfLinkService: { readonly setHash: (hash: string) => void };
  };
}
