import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { Google } from '@/src/components/icons/Google';
import { Lock } from '@/src/components/icons/Lock';
import { Mail } from '@/src/components/icons/Mail';
import { PhoneCall } from '@/src/components/icons/PhoneCall';
import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInDown,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

/* ── Simple shield illustration that matches app's flat aesthetic ── */
function ShieldIllustration() {
    return (
        <Svg width={140} height={140} viewBox="0 0 140 140" fill="none">
            {/* Shield body */}
            <Path
                d="M70 12L20 35V65C20 97 42 124 70 132C98 124 120 97 120 65V35L70 12Z"
                fill={colors.sky[200]}
            />
            <Path
                d="M70 20L28 40V65C28 93 47 117 70 124C93 117 112 93 112 65V40L70 20Z"
                fill={colors.sky[300]}
            />
            {/* Checkmark inside shield */}
            <Path
                d="M55 68L65 78L87 56"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Decorative dots */}
            <Circle cx="26" cy="85" r="4" fill={colors.sky[200]} />
            <Circle cx="114" cy="85" r="4" fill={colors.sky[200]} />
            <Ellipse cx="70" cy="8" rx="3" ry="2" fill={colors.sky[200]} />
            {/* Small decorative elements */}
            <Rect x="16" y="50" width="6" height="6" rx="3" fill={colors.sky[100]} />
            <Rect x="118" y="50" width="6" height="6" rx="3" fill={colors.sky[100]} />
        </Svg>
    );
}

export default function AuthStep() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleGoogleLogin = () => {
        Alert.alert('Coming Soon', 'Google sign-in will be available in a future update.');
    };

    const handleEmailLogin = () => {
        router.push('/(onboarding)/email');
    };

    const handlePhoneLogin = () => {
        Alert.alert('Coming Soon', 'Phone sign-in will be available in a future update.');
    };

    const handleSkip = () => {
        router.push('/(onboarding)/screen-10');
    };

    return (
        <View className="flex-1 bg-sky-100" style={{ paddingTop: insets.top }}>

            {/* ── Header (matches OnboardingShell) ── */}
            <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.6}
                    className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                >
                    <ArrowLeft size={20} />
                </TouchableOpacity>

                {/* Empty center for symmetry */}
                <View />

                <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
                    <Text className="text-lg font-semibold text-sky-500">Skip</Text>
                </TouchableOpacity>
            </View>

            {/* ── Content ── */}
            <View className="flex-1 px-6 justify-between">

                {/* Top: Illustration + Headline */}
                <View className="items-center pt-6">
                    <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                        <ShieldIllustration />
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.duration(500).delay(200)}
                        className="items-center mt-6"
                    >
                        <Text className="text-center tracking-tight text-4xl font-medium text-slate-800 leading-snug">
                            Your journey{' '}{'\n'}starts here
                        </Text>
                        <Text className="text-center text-base text-slate-500 mt-3 leading-relaxed">
                            Create an account to track your progress{'\n'}and start reclaiming your time.
                        </Text>
                    </Animated.View>
                </View>

                {/* Bottom: Auth Buttons */}
                <View style={{ paddingBottom: insets.bottom + 16 }}>

                    {/* ── Google (Primary) ── */}
                    <Animated.View entering={FadeInDown.duration(400).delay(350)}>
                        <Pressable
                            onPress={handleGoogleLogin}
                            className="flex-row items-center justify-center gap-3 bg-white rounded-2xl px-6 py-5 mb-3 active:opacity-80"
                        >
                            <Google size={22} />
                            <Text className="text-slate-700 text-lg font-medium">
                                Sign up with Google
                            </Text>
                        </Pressable>
                    </Animated.View>

                    {/* ── Phone ── */}
                    <Animated.View entering={FadeInDown.duration(400).delay(450)}>
                        <Pressable
                            onPress={handlePhoneLogin}
                            className="flex-row items-center justify-center gap-3 bg-white rounded-2xl px-6 py-5 mb-3 active:opacity-80"
                        >
                            <PhoneCall size={22} color={colors.slate[600]} />
                            <Text className="text-slate-700 text-lg font-medium">
                                Continue with Phone
                            </Text>
                        </Pressable>
                    </Animated.View>

                    {/* ── Email ── */}
                    <Animated.View entering={FadeInDown.duration(400).delay(550)}>
                        <Pressable
                            onPress={handleEmailLogin}
                            className="flex-row items-center justify-center gap-3 bg-white rounded-2xl px-6 py-5 mb-3 active:opacity-80"
                        >
                            <Mail size={22} color={colors.slate[600]} />
                            <Text className="text-slate-700 text-lg font-medium">
                                Continue with Email
                            </Text>
                        </Pressable>
                    </Animated.View>

                    {/* ── Privacy note ── */}
                    <Animated.View
                        entering={FadeInDown.duration(400).delay(650)}
                        className="flex-row items-center justify-center gap-1.5 mt-4"
                    >
                        <Lock size={14} color={colors.slate[400]} />
                        <Text className="text-slate-400 text-sm font-medium">
                            Your data stays private and secure.
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}
