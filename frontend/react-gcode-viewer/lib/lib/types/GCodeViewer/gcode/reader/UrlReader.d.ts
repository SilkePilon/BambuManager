import { BaseReader } from './base';
export interface UrlReaderOptions {
    chunkSize?: number;
    url: string;
    reqOptions?: RequestInit;
}
export default class UrlReader implements BaseReader {
    private readonly opts;
    private text;
    private finished;
    private reader?;
    constructor(opts: UrlReaderOptions);
    read(): Promise<string | null>;
}
