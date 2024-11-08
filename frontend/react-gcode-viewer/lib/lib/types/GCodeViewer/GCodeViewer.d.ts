import React, { HTMLProps } from 'react';
import { GCodeViewerContentProps } from './GCodeModel';
import { UrlReaderOptions } from './gcode/reader';
export interface GCodeViewerProps extends Omit<HTMLProps<HTMLDivElement>, 'onError' | 'onProgress'>, Omit<GCodeViewerContentProps, 'reader'> {
    url: UrlReaderOptions['url'];
    reqOptions?: RequestInit;
    canvasId?: string;
}
declare const GCodeViewer: React.FC<GCodeViewerProps>;
export default GCodeViewer;
