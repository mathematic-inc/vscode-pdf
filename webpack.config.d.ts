export let target: string;
export let mode: string;
export let entry: string;
export namespace output {
    let path: string;
    let filename: string;
    let libraryTarget: string;
}
export let devtool: string;
export namespace externals {
    let vscode: string;
}
export namespace resolve {
    let extensions: string[];
}
export namespace module {
    let rules: ({
        test: RegExp;
        type: string;
        exclude?: never;
        use?: never;
    } | {
        test: RegExp;
        exclude: RegExp;
        use: {
            loader: string;
        }[];
        type?: never;
    })[];
}
//# sourceMappingURL=webpack.config.d.ts.map