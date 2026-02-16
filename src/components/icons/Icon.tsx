import { colors } from '@/src/constants/colors';
import Svg, { SvgProps } from 'react-native-svg';

export interface IconProps {
    size?: number;
    color?: string;
}

const DEFAULT_SIZE = 24;
const DEFAULT_COLOR = colors.slate[700];

/**
 * Base Icon wrapper — each icon file renders its own <Path> elements
 * inside this shared <Svg> shell.
 */
export function IconShell({
    size = DEFAULT_SIZE,
    children,
    ...rest
}: IconProps & { children: React.ReactNode } & Omit<SvgProps, 'width' | 'height'>) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            {...rest}
        >
            {children}
        </Svg>
    );
}

export { DEFAULT_COLOR, DEFAULT_SIZE };

