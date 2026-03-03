import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
    color?: string;
    size?: number;
}

export function TrendUp({ color = '#fff', size = 20 }: Props) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 4L4 20H20L12 4Z"
                fill={color}
            />
        </Svg>
    );
}
