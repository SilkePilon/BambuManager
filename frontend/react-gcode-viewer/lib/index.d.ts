import React, { CSSProperties, HTMLProps } from 'react';

interface BaseReader {
    read: () => Promise<string | null>;
}

interface UrlReaderOptions {
    chunkSize?: number;
    url: string;
    reqOptions?: RequestInit;
}

declare type LineType = 'extrude' | 'travel';
interface GPoint {
    x: number;
    y: number;
    z: number;
    e: number;
    type: LineType;
}

interface GCodeParseProgress {
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

interface CameraInitialPosition {
    latitude: number;
    longitude: number;
    distance: number;
}

interface FloorProps {
    gridWidth?: number;
    gridLength?: number;
}
interface GCodeViewerContentProps {
    reader: BaseReader;
    cameraInitialPosition?: CameraInitialPosition;
    layerColor?: CSSProperties['color'];
    topLayerColor?: CSSProperties['color'];
    floorProps?: FloorProps;
    visible?: number;
    showAxes?: boolean;
    orbitControls?: boolean;
    quality?: number;
    onProgress?: (progress: GCodeParseProgress) => any;
    onFinishLoading?: (finish: GCodeParseProgress) => any;
    onError?: (err: Error) => any;
}

interface GCodeViewerProps extends Omit<HTMLProps<HTMLDivElement>, 'onError' | 'onProgress'>, Omit<GCodeViewerContentProps, 'reader'> {
    url: UrlReaderOptions['url'];
    reqOptions?: RequestInit;
    canvasId?: string;
}
declare const GCodeViewer: React.FC<GCodeViewerProps>;

export { CameraInitialPosition, FloorProps, GCodeParseProgress, GCodeViewer, GCodeViewerProps, GPoint };
