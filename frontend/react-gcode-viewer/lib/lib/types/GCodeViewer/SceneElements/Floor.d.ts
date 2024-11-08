import React from 'react';
import { GroupProps } from '@react-three/fiber';
export interface FloorProps extends GroupProps {
    visible?: boolean;
    width?: number;
    length?: number;
    noShadow?: boolean;
}
declare const Floor: React.FC<FloorProps>;
export default Floor;
