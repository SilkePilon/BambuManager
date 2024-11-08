import React from 'react';
import { PerspectiveCameraProps } from '@react-three/fiber';
export interface CameraInitialPosition {
    latitude: number;
    longitude: number;
    distance: number;
}
export interface CameraProps extends Partial<PerspectiveCameraProps> {
    initialPosition: CameraInitialPosition;
    center: [number, number, number];
}
declare const Camera: React.FC<CameraProps>;
export default Camera;
