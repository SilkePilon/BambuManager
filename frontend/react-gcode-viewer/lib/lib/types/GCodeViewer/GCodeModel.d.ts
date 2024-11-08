import React, { CSSProperties } from 'react';
import { GCodeParseProgress } from './gcode/GCode';
import { BaseReader } from './gcode/reader';
import { CameraInitialPosition } from './SceneElements/Camera';
export interface FloorProps {
    gridWidth?: number;
    gridLength?: number;
}
export interface GCodeViewerContentProps {
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
declare const GCodeModel: React.FC<GCodeViewerContentProps>;
export default GCodeModel;
