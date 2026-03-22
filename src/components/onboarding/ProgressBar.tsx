import { colors } from '@/src/constants/colors';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface Props {
    total: number;
    current: number;
}

export function ProgressBar({ total, current }: Props) {
    const progress = useSharedValue(0);

    useEffect(() => {
        // Calculate percentage (0 to 1) safely
        const target = total > 0 ? current / total : 0;
        progress.value = withSpring(target, {
            damping: 20,
            stiffness: 90,
            mass: 0.5,
        });
    }, [current, total]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
        };
    });

    return (
        <View className="h-1.5 w-32 rounded-full overflow-hidden" style={{ backgroundColor: colors.slate[200] }}>
            <Animated.View
                className="h-full rounded-full"
                style={[{ backgroundColor: colors.sky[500] }, animatedStyle]}
            />
        </View>
    );
}
