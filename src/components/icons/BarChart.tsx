import React from 'react';
import { Path } from 'react-native-svg';
import { DEFAULT_COLOR, DEFAULT_SIZE, IconProps, IconShell } from './Icon';

export function BarChart({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: IconProps) {
    return (
        <IconShell size={size}>
            <Path d="M2.75 8.99805C2.75 8.03155 3.5335 7.24805 4.5 7.24805H5.5C6.4665 7.24805 7.25 8.03155 7.25 8.99805V18.998C7.25 19.9645 6.4665 20.748 5.5 20.748H4.5C3.5335 20.748 2.75 19.9645 2.75 18.998V8.99805Z" fill={color} />
            <Path d="M9.75 5C9.75 4.0335 10.5335 3.25 11.5 3.25H12.5C13.4665 3.25 14.25 4.0335 14.25 5V18.9995C14.25 19.966 13.4665 20.7495 12.5 20.7495H11.5C10.5335 20.7495 9.75 19.966 9.75 18.9995V5Z" fill={color} />
            <Path d="M16.75 11.998C16.75 11.0315 17.5335 10.248 18.5 10.248H19.5C20.4665 10.248 21.25 11.0315 21.25 11.998V18.998C21.25 19.9645 20.4665 20.748 19.5 20.748H18.5C17.5335 20.748 16.75 19.9645 16.75 18.998V11.998Z" fill={color} />
        </IconShell>
    );
}