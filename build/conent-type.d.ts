import { IConcept, ITechnology } from 'kodyfire-core';
import { Concept as BaseConcept } from 'basic-kodyfire';
export declare class ContentType extends BaseConcept {
    extension: string;
    constructor(concept: Partial<IConcept>, technology: ITechnology);
    initEngine(): void;
    generate(_data: any): Promise<void>;
    readFolder(folder: string): Promise<any[]>;
    getFilename(data: any): any;
    getTemplatesPath(): string;
    getExtension(templateName: string): string | undefined;
    prepareData(_data: any): any;
    resolveTemplateName(templateName: string, name: string): string;
}
