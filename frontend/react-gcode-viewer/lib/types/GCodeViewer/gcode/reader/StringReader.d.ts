import { BaseReader } from './base';
export interface StringReaderOptions {
    file: string | File;
    chunkSize?: number;
    waitMs?: number;
}
export default class StringReader implements BaseReader {
    private cursor;
    private text;
    private readonly opts;
    constructor(opts: StringReaderOptions);
    read(): Promise<string | null>;
}
