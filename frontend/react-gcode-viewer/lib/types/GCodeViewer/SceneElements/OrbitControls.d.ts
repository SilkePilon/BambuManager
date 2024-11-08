import { PrimitiveProps } from '@react-three/fiber';
import * as React from 'react';
export interface OrbitControlsProps extends Omit<PrimitiveProps, 'object'> {
}
declare const OrbitControls: React.FC<OrbitControlsProps>;
export default OrbitControls;
