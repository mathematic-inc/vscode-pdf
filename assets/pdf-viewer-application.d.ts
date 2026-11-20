// The PDF.js viewer script sets `window.PDFViewerApplication`. This file holds the parts that
// main.mjs uses. The provider in src/pdf-viewer-provider.ts writes the configuration.

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
