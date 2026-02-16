import React from 'react';
import { Path } from 'react-native-svg';
import { DEFAULT_COLOR, DEFAULT_SIZE, IconProps, IconShell } from './Icon';

export function ArrowLeft({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: IconProps) {
    return (
        <IconShell size={size}>
            <Path
                d="M5.5 12H19"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M11 18C11 18 5 13.58 5 12C5 10.42 11 6 11 6"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </IconShell>
    );
}
