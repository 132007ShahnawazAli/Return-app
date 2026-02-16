import React from 'react';
import { Path } from 'react-native-svg';
import { DEFAULT_COLOR, DEFAULT_SIZE, IconProps, IconShell } from './Icon';

export function ChevronRight({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: IconProps) {
    return (
        <IconShell size={size}>
            <Path
                d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </IconShell>
    );
}
