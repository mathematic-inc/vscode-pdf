export class PDFBug {
    static "__#125@#buttons": any[];
    static "__#125@#activePanel": null;
    static tools: ({
        id: string;
        name: string;
        panel: null;
        manager: null;
        init(): void;
        cleanup(): void;
        enabled: boolean;
        active: boolean;
        fontAdded(fontObj: any, url: any): void;
    } | {
        id: string;
        name: string;
        panel: null;
        manager: null;
        init(): void;
        cleanup(): void;
        enabled: boolean;
        active: boolean;
        create(pageIndex: any): Stepper;
        selectStepper(pageIndex: any, selectPanel: any): void;
        saveBreakPoints(pageIndex: any, bps: any): void;
    } | {
        id: string;
        name: string;
        panel: null;
        manager: null;
        init(): void;
        enabled: boolean;
        active: boolean;
        add(pageNumber: any, stat: any): void;
        cleanup(): void;
    })[];
    static enable(ids: any): void;
    static init(container: any, ids: any): void;
    static loadCSS(): void;
    static cleanup(): void;
    static selectPanel(index: any): void;
}
declare class Stepper {
    constructor(panel: any, pageIndex: any, initialBreakPoints: any);
    panel: any;
    breakPoint: number;
    nextBreakPoint: any;
    pageIndex: any;
    breakPoints: any;
    currentIdx: number;
    operatorListIdx: number;
    indentLevel: number;
    init(operatorList: any): void;
    table: any;
    updateOperatorList(operatorList: any): void;
    getNextBreakPoint(): any;
    breakIt(idx: any, callback: any): void;
    goTo(idx: any): void;
    #private;
}
export {};
//# sourceMappingURL=debugger.d.mts.map