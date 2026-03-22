/**
 * enable-blocker.tsx — "One last thing"
 *
 * Creative permission screen — uses the sky-300 immersive background (like screen-10)
 * instead of the standard sky-100 OnboardingShell. This makes it feel special —
 * a dedicated moment, not just another onboarding step.
 *
 * Design concept:
 *  - Full sky-300 background (matches screen-10 and the blocking screen itself)
 *  - Large shield with animated pulsing glow
 *  - 3 visual "what happens" cards showing the flow
 *  - White primary CTA
 *  - Skippable but clearly communicated
 */

import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { Tick } from '@/src/components/icons/Tick';
import { colors } from '@/src/constants/colors';
import AppBlocker from '@/src/native/AppBlocker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// ─── Shield + Lock Illustration (white on sky-300) ──────────────────────────

function ShieldLockIcon() {
    return (
        <Svg width={100} height={100} viewBox="0 0 100 100" fill="none">
            <Path
                d="M50 8L14 25V46C14 69 30 89 50 95C70 89 86 69 86 46V25L50 8Z"
                fill="white"
                opacity={0.2}
            />
            <Path
                d="M50 14L22 28V46C22 65 35 82 50 88C65 82 78 65 78 46V28L50 14Z"
                fill="white"
                opacity={0.35}
            />
            {/* Lock body */}
            <Rect x="40" y="47" width="20" height="16" rx="3" fill="white" />
            {/* Lock shackle */}
            <Path
                d="M44 47V42C44 38.7 46.7 36 50 36C53.3 36 56 38.7 56 42V47"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />
            {/* Keyhole */}
            <Circle cx="50" cy="54" r="2" fill={colors.sky[300]} />
        </Svg>
    );
}

// ─── Flow Step Card ─────────────────────────────────────────────────────────

function FlowStep({ emoji, text, delay }: { emoji: string; text: string; delay: number }) {
    return (
        <Animated.View
            entering={FadeInDown.duration(400).delay(delay)}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
            }}
        >
            <Text style={{ fontSize: 22 }}>{emoji}</Text>
            <Text style={{
                flex: 1,
                fontSize: 15,
                fontWeight: '500',
                color: 'white',
                lineHeight: 20,
            }}>
                {text}
            </Text>
        </Animated.View>
    );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export default function EnableBlockerStep() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isEnabled, setIsEnabled] = useState(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const checkStatus = useCallback(async () => {
        if (Platform.OS !== 'android') return;
        const enabled = await AppBlocker.isAccessibilityServiceEnabled();
        setIsEnabled(enabled);
    }, []);

    useEffect(() => {
        checkStatus();
        const sub = AppState.addEventListener('change', (s) => {
            if (s === 'active') checkStatus();
        });
        return () => {
            sub.remove();
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [checkStatus]);

    const handleEnable = async () => {
        await AppBlocker.openAccessibilitySettings();
        pollRef.current = setInterval(async () => {
            const enabled = await AppBlocker.isAccessibilityServiceEnabled();
            if (enabled) {
                setIsEnabled(true);
                if (pollRef.current) clearInterval(pollRef.current);
            }
        }, 1000);
    };

    const handleContinue = () => {
        if (pollRef.current) clearInterval(pollRef.current);
        router.push('/(onboarding)/screen-3');
    };

    return (
        <View className="flex-1 bg-sky-300" style={{ paddingTop: insets.top }}>

            {/* ── Header ── */}
            <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
                <TouchableOpacity
                    onPress={() => router.back()}
                    activeOpacity={0.6}
                    style={{
                        height: 40, width: 40,
                        alignItems: 'center', justifyContent: 'center',
                        borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                    }}
                >
                    <ArrowLeft size={20} color="white" />
                </TouchableOpacity>

                <View />

                <TouchableOpacity onPress={handleContinue} activeOpacity={0.7}>
                    <Text style={{ fontSize: 17, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
                        Skip
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Content ── */}
            <View className="flex-1 px-6 justify-between">

                {/* Top section */}
                <View className="items-center pt-4">
                    {/* Shield */}
                    <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                        <ShieldLockIcon />
                    </Animated.View>

                    {/* Headline */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(200)}
                        className="items-center mt-4"
                    >
                        <Text className="text-center tracking-tight text-4xl font-medium text-white leading-snug">
                            One last thing
                        </Text>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 16,
                            fontWeight: '500',
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: 8,
                            lineHeight: 22,
                            paddingHorizontal: 16,
                        }}>
                            To block distracting apps, Return needs{'\n'}to know when you open them.
                        </Text>
                    </Animated.View>

                    {/* How it works cards */}
                    <View className="w-full mt-8 gap-3">
                        <FlowStep emoji="📱" text="You open a blocked app" delay={350} />
                        <FlowStep emoji="🛡️" text="Return steps in instantly" delay={450} />
                        <FlowStep emoji="🎯" text="You stay focused and in control" delay={550} />
                    </View>
                </View>

                {/* Bottom section */}
                <View style={{ paddingBottom: insets.bottom + 16 }}>

                    {/* Enabled badge */}
                    {isEnabled && (
                        <Animated.View
                            entering={FadeInUp.duration(400)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                marginBottom: 16,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: 99,
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                alignSelf: 'center',
                            }}
                        >
                            <View style={{
                                width: 22, height: 22, borderRadius: 11,
                                backgroundColor: 'white',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Tick size={13} color={colors.sky[400]} />
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
                                Blocking is active
                            </Text>
                        </Animated.View>
                    )}

                    {/* CTA */}
                    {isEnabled ? (
                        <Animated.View entering={FadeInUp.duration(400)}>
                            <Pressable
                                onPress={handleContinue}
                                style={{
                                    alignItems: 'center',
                                    borderRadius: 16,
                                    paddingVertical: 16,
                                    backgroundColor: 'white',
                                }}
                                className="active:opacity-90"
                            >
                                <Text style={{
                                    fontSize: 18, fontWeight: '500',
                                    color: colors.sky[800],
                                }}>
                                    Continue
                                </Text>
                            </Pressable>
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInDown.duration(400).delay(650)}>
                            <Pressable
                                onPress={handleEnable}
                                style={{
                                    alignItems: 'center',
                                    borderRadius: 16,
                                    paddingVertical: 16,
                                    backgroundColor: 'white',
                                }}
                                className="active:opacity-90"
                            >
                                <Text style={{
                                    fontSize: 18, fontWeight: '500',
                                    color: colors.sky[800],
                                }}>
                                    Enable Blocking
                                </Text>
                            </Pressable>
                        </Animated.View>
                    )}

                    {/* Privacy note */}
                    <Animated.View
                        entering={FadeInDown.duration(400).delay(750)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            marginTop: 16,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>🔒</Text>
                        <Text style={{
                            fontSize: 13, fontWeight: '500',
                            color: 'rgba(255,255,255,0.5)',
                        }}>
                            We never read your screen content
                        </Text>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}
