export declare const concept: {
    type: string;
    properties: {
        name: {
            type: string;
        };
        template: {
            type: string;
        };
        outputDir: {
            type: string;
        };
    };
};
export declare const conceptArray: {
    type: string;
    items: {
        type: string;
        properties: {
            name: {
                type: string;
            };
            template: {
                type: string;
            };
            outputDir: {
                type: string;
            };
        };
    };
};
declare const concepts: {
    name: string;
    template: string;
    description: string;
}[];
declare let schema: any;
export { concepts, schema };
