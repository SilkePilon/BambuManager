import React from 'react';
import { LineDashedMaterialProps } from '@react-three/fiber';
import { GPoint } from './gcode/types';
export interface GCodeLineProps extends LineDashedMaterialProps {
    points: GPoint[];
    showTravel?: boolean;
}
declare const GCodeLines: React.FC<GCodeLineProps>;
export default GCodeLines;
