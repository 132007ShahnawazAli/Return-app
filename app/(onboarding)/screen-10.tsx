import { Tick } from '@/src/components/icons/Tick';
import { colors } from '@/src/constants/colors';
import { useAppStore } from '@/src/stores/app-store';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CIRCLE_RADIUS = 110;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function LoadingPlanStep() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const setOnboarded = useAppStore((s) => s.setOnboarded);
    const [progressText, setProgressText] = useState(0);
    const [stepData, setStepData] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Smooth circle progress
    const progress = useSharedValue(0);

    const steps = [
        'Understanding your habits',
        'Building your focus schedule',
        'Setting your daily targets',
        'Personalizing your experience',
    ];

    useEffect(() => {
        const duration = 8000;
        progress.value = withTiming(1, { duration });

        let start = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const p = Math.min((elapsed / duration) * 100, 100);
            setProgressText(Math.round(p));

            if (p < 25) setStepData(0);
            else if (p < 50) setStepData(1);
            else if (p < 75) setStepData(2);
            else setStepData(3);

            if (p >= 100) {
                clearInterval(interval);
                setIsComplete(true);
                // Brief pause to show completed state before navigating
                setTimeout(() => finishOnboarding(), 1200);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const finishOnboarding = async () => {
        await setOnboarded(true);
        router.replace('/(app)');
    };

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: CIRCLE_CIRCUMFERENCE * (1 - progress.value),
        };
    });

    return (
        <View
            className="flex-1 bg-sky-300"
            style={{ paddingTop: insets.top }}
        >
            <View className="flex-1 justify-between px-6 pt-12 pb-16">

                {/* ── Top Text ── */}
                <View className="items-center">
                    <Text className="text-center tracking-tight text-3xl font-medium text-white leading-snug">
                        {isComplete
                            ? "You're all set!"
                            : "Building your\npersonalized plan..."
                        }
                    </Text>
                    {!isComplete && (
                        <Text className="text-center text-base text-sky-100 mt-2 font-medium">
                            This only takes a moment
                        </Text>
                    )}
                    {isComplete && (
                        <Text className="text-center text-base text-sky-100 mt-2 font-medium">
                            Let's reclaim your time
                        </Text>
                    )}
                </View>

                {/* ── Circular Progress ── */}
                <View className="items-center justify-center relative w-[250px] h-[250px] self-center">
                    <Svg
                        width={250}
                        height={250}
                        viewBox="0 0 250 250"
                        className="absolute"
                        style={{ transform: [{ rotate: '-90deg' }] }}
                    >
                        {/* Track */}
                        <Circle
                            cx="125"
                            cy="125"
                            r={CIRCLE_RADIUS}
                            stroke="white"
                            opacity={0.25}
                            strokeWidth="10"
                            fill="transparent"
                        />
                        {/* Animated fill */}
                        <AnimatedCircle
                            cx="125"
                            cy="125"
                            r={CIRCLE_RADIUS}
                            stroke="white"
                            opacity={1}
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={CIRCLE_CIRCUMFERENCE}
                            animatedProps={animatedProps}
                            strokeLinecap="round"
                        />
                    </Svg>

                    {/* Center content */}
                    <View className="absolute items-center justify-center z-10 w-full h-full">
                        {isComplete ? (
                            <View className="h-16 w-16 items-center justify-center rounded-full bg-white">
                                <Tick size={32} color={colors.sky[400]} />
                            </View>
                        ) : (
                            <Text className="text-5xl font-semibold text-white tracking-tight">
                                {progressText}%
                            </Text>
                        )}
                    </View>
                </View>

                {/* ── Checklist ── */}
                <View className="self-center gap-5">
                    {steps.map((text, idx) => {
                        const isDone = isComplete || stepData > idx;
                        const isCurrent = stepData === idx && !isComplete;
                        return (
                            <ChecklistItem
                                key={text}
                                text={text}
                                isDone={isDone}
                                isCurrent={isCurrent}
                            />
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

function ChecklistItem({ text, isDone, isCurrent }: { text: string; isDone: boolean; isCurrent: boolean }) {
    const animatedStyle = useAnimatedStyle(() => {
        const opacity = isDone ? 1 : isCurrent ? 0.85 : 0.35;
        const translateX = isCurrent ? 4 : 0;
        return {
            opacity: withTiming(opacity, { duration: 400 }),
            transform: [{ translateX: withTiming(translateX, { duration: 400 }) }],
        };
    }, [isDone, isCurrent]);

    return (
        <Animated.View className="flex-row items-center gap-3" style={animatedStyle}>
            {/* Circle indicator */}
            <View
                className={`h-7 w-7 items-center justify-center rounded-full ${isDone ? 'bg-white' : 'border-2 border-white/30'
                    }`}
            >
                {isDone && (
                    <Tick size={15} color={colors.sky[400]} />
                )}
            </View>

            {/* Label */}
            <Text
                className={`text-[16px] font-semibold tracking-tight ${isDone ? 'text-white' : isCurrent ? 'text-white/80' : 'text-white/30'}`}
            >
                {text}
            </Text>
        </Animated.View>
    );
}
