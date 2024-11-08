import { BaseReader } from './reader';
import { GPoint } from './types';
export interface GCodeParseProgress {
    points: GPoint[];
    read: number;
    baseCenter: {
        x: number;
        y: number;
    };
    max: {
        x: number;
        y: number;
        z: number;
    };
    min: {
        x: number;
        y: number;
        z: number;
    };
    filamentLength: number;
}
export interface GCodeOptions {
    quality?: number;
    onProgress?: (progress: GCodeParseProgress) => any;
    onFinished?: (finished: GCodeParseProgress) => any;
}
export declare class GCode {
    private lastPoint;
    readonly points: GPoint[];
    baseCenter?: {
        x: number;
        y: number;
    };
    limits: {
        max: {
            x: number;
            y: number;
            z: number;
        };
        min: {
            x: number;
            y: number;
            z: number;
        };
    };
    private readonly opts;
    filament: number;
    private read;
    private count;
    private _abort;
    private readonly omitCycle;
    private readonly qualityRes;
    constructor(opts?: GCodeOptions);
    abort: () => void;
    private getProgress;
    parse: (reader: BaseReader) => Promise<void>;
    private updateBaseCenter;
    private updateLimits;
    private parseCodeLines;
}
