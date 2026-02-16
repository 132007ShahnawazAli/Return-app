import React from 'react';
import { Path } from 'react-native-svg';
import { DEFAULT_COLOR, DEFAULT_SIZE, IconProps, IconShell } from './Icon';

export function Minus({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: IconProps) {
    return (
        <IconShell size={size}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19 11.9111C19 12.4635 18.516 12.9111 17.9189 12.9111H4.08108C3.48401 12.9111 3 12.4635 3 11.9111C3 11.3588 3.48401 10.9111 4.08108 10.9111H17.9189C18.516 10.9111 19 11.3588 19 11.9111Z"
                fill={color}
            />
        </IconShell>
    );
}
