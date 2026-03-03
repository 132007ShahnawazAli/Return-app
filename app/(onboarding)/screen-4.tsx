import { CheckCircleFull } from '@/src/components/icons/CheckCircleFull';
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

export default function Screen4Step() {
    const router = useRouter();
    const progress = useSharedValue(0);
    const [message, setMessage] = React.useState("Calculating your focus potential...");

    const completeAnalysis = () => {
        router.replace('/(onboarding)/screen-5');
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`,
        };
    });

    useEffect(() => {
        // Progress animation (3 seconds total)
        progress.value = withTiming(1, { duration: 3000, easing: Easing.linear }, (finished) => {
            if (finished) {
                runOnJS(completeAnalysis)();
            }
        });

        // Text switch at 1.5 seconds
        const timer = setTimeout(() => {
            setMessage("Creating a personalized report...");
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <OnboardingShell
            step={3}
            totalSteps={8}
            question=""
            canContinue={false}
            onContinue={() => { }} // Not used
            hideFooter={true}
            showBack={true}
            hideSkip={true}
        >
            <View className="items-center justify-center w-full">
                <View className="w-full h-4 bg-slate-200 rounded-full overflow-hidden mb-6">
                    <Animated.View
                        style={[
                            styles.progressBar,
                            animatedStyle
                        ]}
                    />
                </View>

                <View className="flex-row items-center justify-center gap-2">
                    <CheckCircleFull color={colors.sky[500]} size={20} />
                    <Text className="text-lg font-medium text-slate-600 text-center">
                        {message}
                    </Text>
                </View>
            </View>
        </OnboardingShell>
    );
}

const styles = StyleSheet.create({
    progressBar: {
        height: '100%',
        backgroundColor: colors.sky[400],
    }
});
