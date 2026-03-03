import { colors } from '@/src/constants/colors';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
    color?: string;
    size?: number;
}

export function CheckCircleFull({ color = colors.sky[500], size = 24 }: Props) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                fill={color}
            />
            <Path
                d="M7.75 11.9999L10.58 14.8299L16.25 9.16992"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}
