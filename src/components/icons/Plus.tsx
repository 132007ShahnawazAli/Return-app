import React from 'react';
import { Path } from 'react-native-svg';
import { DEFAULT_COLOR, DEFAULT_SIZE, IconProps, IconShell } from './Icon';

export function Plus({ size = DEFAULT_SIZE, color = DEFAULT_COLOR }: IconProps) {
    return (
        <IconShell size={size}>
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3C12.5523 3 13 3.44772 13 4V11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H13V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H11V4C11 3.44772 11.4477 3 12 3Z"
                fill={color}
            />
        </IconShell>
    );
}
