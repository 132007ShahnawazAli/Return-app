import React, { useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.62;
const DISMISS_THRESHOLD = 100;

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const TIMING_CONFIG = { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
    const translateY = useSharedValue(SHEET_HEIGHT);
    const backdropOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, TIMING_CONFIG);
            backdropOpacity.value = withTiming(1, { duration: 250 });
        } else {
            translateY.value = withTiming(SHEET_HEIGHT, TIMING_CONFIG);
            backdropOpacity.value = withTiming(0, { duration: 200 });
        }
    }, [visible]);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY > 0) {
                translateY.value = e.translationY;
            }
        })
        .onEnd((e) => {
            if (e.translationY > DISMISS_THRESHOLD) {
                translateY.value = withTiming(SHEET_HEIGHT, TIMING_CONFIG);
                backdropOpacity.value = withTiming(0, { duration: 200 });
                runOnJS(onClose)();
            } else {
                translateY.value = withTiming(0, TIMING_CONFIG);
            }
        });

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    if (!visible) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 50 }]} pointerEvents="box-none">
            <Animated.View style={[styles.backdrop, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            <GestureDetector gesture={panGesture}>
                <Animated.View
                    className="bg-white rounded-t-[32px] px-6 pb-10"
                    style={[styles.sheetLayout, sheetStyle]}
                >
                    <View className="items-center pt-3.5 pb-2">
                        <View className="w-11 h-[5px] rounded-full bg-slate-200" />
                    </View>
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.3)',
    },
    sheetLayout: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SHEET_HEIGHT,
    },
});

