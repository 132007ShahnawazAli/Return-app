import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

export default function Screen6Step() {
    const router = useRouter();
    const progress = useSharedValue(0);

    const completeAnalysis = () => {
        router.replace('/(onboarding)/screen-7');
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
        };
    });

    useEffect(() => {
        progress.value = withTiming(1, { duration: 3000, easing: Easing.linear }, (finished) => {
            if (finished) {
                runOnJS(completeAnalysis)();
            }
        });
    }, []);

    return (
        <OnboardingShell
            step={5}
            totalSteps={10}
            question="Analyzing your digital habits..."
            canContinue={false}
            onContinue={() => { }} // Not used
            hideFooter={true}
            showBack={false}
        >
            <View className="items-center justify-center py-10">
                <View className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-6">
                    <Animated.View
                        style={[
                            styles.progressBar,
                            animatedStyle
                        ]}
                    />
                </View>

                <Text className="text-lg font-medium text-slate-600 text-center">
                    Calculating your focus potential...
                </Text>


            </View>
        </OnboardingShell>
    );
}

function DelayedText({ text, delay }: { text: string, delay: number }) {
    const opacity = useSharedValue(0);

    useEffect(() => {
        // First set to 0 to ensure animation restarts if needed
        opacity.value = 0;

        const timeout = setTimeout(() => {
            opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) });
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: (1 - opacity.value) * 10 }]
    }));

    return (
        <Animated.View style={[style, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
            <View className="h-2 w-2 rounded-full bg-sky-400" />
            <Text className="text-md text-slate-500 font-medium">{text}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    progressBar: {
        height: '100%',
        backgroundColor: colors.sky[400],
    }
});
