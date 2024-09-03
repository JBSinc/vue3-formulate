declare const _default: import("#app").Plugin<{
    formulate: {
        options: {};
        defaults: {
            components: {
                FormulateSlot: {
                    inheritAttrs: boolean;
                    functional: boolean;
                    render(e: any, { props: t, data: r, parent: o, children: i }: {
                        props: any;
                        data: any;
                        parent: any;
                        children: any;
                    }): any;
                };
                FormulateForm: any;
                FormulateFile: any;
                FormulateHelp: any;
                FormulateLabel: any;
                FormulateInput: any;
                FormulateErrors: any;
                FormulateSchema: {
                    functional: boolean;
                    render: (e: any, { props: t, listeners: r }: {
                        props: any;
                        listeners: any;
                    }) => any;
                };
                FormulateAddMore: any;
                FormulateGrouping: any;
                FormulateInputBox: any;
                FormulateInputText: any;
                FormulateInputFile: any;
                FormulateErrorList: any;
                FormulateRepeatable: any;
                FormulateInputGroup: any;
                FormulateInputButton: any;
                FormulateInputSelect: any;
                FormulateInputSlider: any;
                FormulateButtonContent: any;
                FormulateInputTextArea: any;
                FormulateRepeatableRemove: any;
                FormulateRepeatableProvider: any;
            };
            slotComponents: {
                addMore: string;
                buttonContent: string;
                errorList: string;
                errors: string;
                file: string;
                help: string;
                label: string;
                prefix: boolean;
                remove: string;
                repeatable: string;
                suffix: boolean;
                uploadAreaMask: string;
            };
            slotProps: {};
            library: any;
            rules: {
                accepted: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                after: ({ value: e }: {
                    value: any;
                }, t?: boolean) => Promise<boolean>;
                alpha: ({ value: e }: {
                    value: any;
                }, t?: string) => Promise<any>;
                alphanumeric: ({ value: e }: {
                    value: any;
                }, t?: string) => Promise<any>;
                before: ({ value: e }: {
                    value: any;
                }, t?: boolean) => Promise<boolean>;
                between: ({ value: e }: {
                    value: any;
                }, t: number | undefined, r: number | undefined, o: any) => Promise<boolean>;
                confirm: ({ value: e, getGroupValues: t, name: r }: {
                    value: any;
                    getGroupValues: any;
                    name: any;
                }, o: any) => Promise<boolean>;
                date: ({ value: e }: {
                    value: any;
                }, t?: boolean) => Promise<boolean>;
                email: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                endsWith: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                in: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                matches: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                mime: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                min: ({ value: e }: {
                    value: any;
                }, t: number | undefined, r: any) => Promise<boolean>;
                max: ({ value: e }: {
                    value: any;
                }, t: number | undefined, r: any) => Promise<boolean>;
                not: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                number: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                required: ({ value: e }: {
                    value: any;
                }, t?: string) => Promise<boolean>;
                startsWith: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                url: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                bail: () => Promise<boolean>;
                optional: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
            };
            mimes: {
                csv: string;
                gif: string;
                jpg: string;
                jpeg: string;
                png: string;
                pdf: string;
                svg: string;
            };
            locale: boolean;
            uploader: (e: any, t: any, r: any, o: any) => Promise<any>;
            uploadUrl: boolean;
            fileUrlKey: string;
            uploadJustCompleteDuration: number;
            errorHandler: (t: any) => any;
            plugins: ((e: any) => void)[];
            locales: {};
            failedValidation: () => boolean;
            idPrefix: string;
            baseClasses: (t: any) => any;
            coreClasses: (e: any) => {};
            classes: {};
            useInputDecorators: boolean;
            validationNameStrategy: boolean;
        };
        registry: Map<any, any>;
        idRegistry: {};
        install(t: any, r: any): void;
        nextId(t: any): string;
        extend(t: any): any;
        merge(t: any, r: any, o?: boolean): {};
        classify(t: any): any;
        classes(t: any): {};
        typeProps(t: any): any[];
        slotProps(t: any, r: any, o: any): any;
        component(t: any): any;
        slotComponent(t: any, r: any): any;
        rules(t?: {}): any;
        i18n(t: any): any;
        getLocale(t: any): any;
        selectedLocale: any;
        setLocale(t: any): void;
        validationMessage(t: any, r: any, o: any): any;
        register(t: any): void;
        deregister(t: any): void;
        handle(t: any, r: any, o?: boolean): any;
        reset(t: any, r?: {}): void;
        submit(t: any): void;
        resetValidation(t: any): void;
        setValues(t: any, r: any): void;
        getUploader(): any;
        getUploadUrl(): any;
        getFileUrlKey(): any;
        createUpload(t: any, r: any): {
            input: any;
            fileList: any;
            files: any[];
            options: any;
            results: boolean;
            context: any;
            uploadPromise: any;
            rehydrateFileList(t: any): void;
            addFileList(t: any): void;
            hasUploader(): boolean;
            uploaderIsAxios(): boolean;
            getUploader(...t: any[]): any;
            upload(): any;
            __performUpload(): Promise<any>;
            removeFile(t: any): void;
            mergeFileList(t: any): void;
            loadPreviews(): void;
            dataTransferCheck(): void;
            supportsDataTransfers: boolean | undefined;
            getFiles(): any[];
            mapUUID(t: any): any;
            toString(): string;
        };
        failedValidation(t: any): any;
    };
}> & import("#app").ObjectPlugin<{
    formulate: {
        options: {};
        defaults: {
            components: {
                FormulateSlot: {
                    inheritAttrs: boolean;
                    functional: boolean;
                    render(e: any, { props: t, data: r, parent: o, children: i }: {
                        props: any;
                        data: any;
                        parent: any;
                        children: any;
                    }): any;
                };
                FormulateForm: any;
                FormulateFile: any;
                FormulateHelp: any;
                FormulateLabel: any;
                FormulateInput: any;
                FormulateErrors: any;
                FormulateSchema: {
                    functional: boolean;
                    render: (e: any, { props: t, listeners: r }: {
                        props: any;
                        listeners: any;
                    }) => any;
                };
                FormulateAddMore: any;
                FormulateGrouping: any;
                FormulateInputBox: any;
                FormulateInputText: any;
                FormulateInputFile: any;
                FormulateErrorList: any;
                FormulateRepeatable: any;
                FormulateInputGroup: any;
                FormulateInputButton: any;
                FormulateInputSelect: any;
                FormulateInputSlider: any;
                FormulateButtonContent: any;
                FormulateInputTextArea: any;
                FormulateRepeatableRemove: any;
                FormulateRepeatableProvider: any;
            };
            slotComponents: {
                addMore: string;
                buttonContent: string;
                errorList: string;
                errors: string;
                file: string;
                help: string;
                label: string;
                prefix: boolean;
                remove: string;
                repeatable: string;
                suffix: boolean;
                uploadAreaMask: string;
            };
            slotProps: {};
            library: any;
            rules: {
                accepted: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                after: ({ value: e }: {
                    value: any;
                }, t?: boolean) => Promise<boolean>;
                alpha: ({ value: e }: {
                    value: any;
                }, t?: string) => Promise<any>;
                alphanumeric: ({ value: e }: {
                    value: any;
                }, t?: string) => Promise<any>;
                before: ({ value: e }: {
                    value: any;
                }, t?: boolean) => Promise<boolean>;
                between: ({ value: e }: {
                    value: any;
                }, t: number | undefined, r: number | undefined, o: any) => Promise<boolean>;
                confirm: ({ value: e, getGroupValues: t, name: r }: {
                    value: any;
                    getGroupValues: any;
                    name: any;
                }, o: any) => Promise<boolean>;
                date: ({ value: e }: {
                    value: any;
                }, t?: boolean) => Promise<boolean>;
                email: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                endsWith: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                in: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                matches: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                mime: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                min: ({ value: e }: {
                    value: any;
                }, t: number | undefined, r: any) => Promise<boolean>;
                max: ({ value: e }: {
                    value: any;
                }, t: number | undefined, r: any) => Promise<boolean>;
                not: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                number: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                required: ({ value: e }: {
                    value: any;
                }, t?: string) => Promise<boolean>;
                startsWith: ({ value: e }: {
                    value: any;
                }, ...t: any[]) => Promise<boolean>;
                url: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
                bail: () => Promise<boolean>;
                optional: ({ value: e }: {
                    value: any;
                }) => Promise<boolean>;
            };
            mimes: {
                csv: string;
                gif: string;
                jpg: string;
                jpeg: string;
                png: string;
                pdf: string;
                svg: string;
            };
            locale: boolean;
            uploader: (e: any, t: any, r: any, o: any) => Promise<any>;
            uploadUrl: boolean;
            fileUrlKey: string;
            uploadJustCompleteDuration: number;
            errorHandler: (t: any) => any;
            plugins: ((e: any) => void)[];
            locales: {};
            failedValidation: () => boolean;
            idPrefix: string;
            baseClasses: (t: any) => any;
            coreClasses: (e: any) => {};
            classes: {};
            useInputDecorators: boolean;
            validationNameStrategy: boolean;
        };
        registry: Map<any, any>;
        idRegistry: {};
        install(t: any, r: any): void;
        nextId(t: any): string;
        extend(t: any): any;
        merge(t: any, r: any, o?: boolean): {};
        classify(t: any): any;
        classes(t: any): {};
        typeProps(t: any): any[];
        slotProps(t: any, r: any, o: any): any;
        component(t: any): any;
        slotComponent(t: any, r: any): any;
        rules(t?: {}): any;
        i18n(t: any): any;
        getLocale(t: any): any;
        selectedLocale: any;
        setLocale(t: any): void;
        validationMessage(t: any, r: any, o: any): any;
        register(t: any): void;
        deregister(t: any): void;
        handle(t: any, r: any, o?: boolean): any;
        reset(t: any, r?: {}): void;
        submit(t: any): void;
        resetValidation(t: any): void;
        setValues(t: any, r: any): void;
        getUploader(): any;
        getUploadUrl(): any;
        getFileUrlKey(): any;
        createUpload(t: any, r: any): {
            input: any;
            fileList: any;
            files: any[];
            options: any;
            results: boolean;
            context: any;
            uploadPromise: any;
            rehydrateFileList(t: any): void;
            addFileList(t: any): void;
            hasUploader(): boolean;
            uploaderIsAxios(): boolean;
            getUploader(...t: any[]): any;
            upload(): any;
            __performUpload(): Promise<any>;
            removeFile(t: any): void;
            mergeFileList(t: any): void;
            loadPreviews(): void;
            dataTransferCheck(): void;
            supportsDataTransfers: boolean | undefined;
            getFiles(): any[];
            mapUUID(t: any): any;
            toString(): string;
        };
        failedValidation(t: any): any;
    };
}>;
export default _default;
