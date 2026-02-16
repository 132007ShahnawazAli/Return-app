import React from 'react';
import Svg, { SvgProps } from 'react-native-svg';

export interface IllustrationProps extends Omit<SvgProps, 'width' | 'height'> {
    width?: number | string;
    height?: number | string;
}

export function IllustrationShell({
    width,
    height,
    viewBox,
    children,
    ...rest
}: IllustrationProps & { children: React.ReactNode }) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox={viewBox}
            fill="none"
            {...rest}
        >
            {children}
        </Svg>
    );
}
