import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ArrowRight } from '@/src/components/icons/ArrowRight';
import { ProgressBar } from '@/src/components/onboarding/ProgressBar';
import { colors } from '@/src/constants/colors';
import { useAppStore } from '@/src/stores/app-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen8Step() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const setOnboarded = useAppStore((s) => s.setOnboarded);

    const [isPerm1Enabled, setIsPerm1Enabled] = useState(false);
    const [isPerm2Enabled, setIsPerm2Enabled] = useState(false);
    const [isPerm3Enabled, setIsPerm3Enabled] = useState(false);

    const handleContinue = async () => {
        await setOnboarded(true);
        router.replace('/(app)');
    };

    return (
        <View className="flex-1 bg-sky-50" style={{ paddingTop: insets.top }}>
            {/* ── Header overrides ── */}
            <View className="flex-row items-center px-5 pb-4 h-16">
                <View className="flex-1 items-start justify-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.6}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white/60"
                    >
                        <ArrowLeft size={20} />
                    </TouchableOpacity>
                </View>

                <View className="flex-1 items-center justify-center px-2">
                    <ProgressBar total={8} current={7} />
                </View>

                <View className="flex-1 items-end justify-center">
                    <View className="h-10 w-10" />
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Title Area ── */}
                <View className="pt-6 pb-10">
                    <Text className="text-3xl font-bold text-slate-800 tracking-tight mb-3">
                        Enable Time Guard
                    </Text>
                    <Text className="text-[16px] text-slate-700">
                        Just a few quick steps to start guarding your time:
                    </Text>
                </View>

                {/* ── Toggles ── */}
                <View className="gap-y-4 mt-4">
                    {/* Item 1 */}
                    <View>
                        <View className="bg-white rounded-2xl p-5 flex-row items-center justify-between mb-2 shadow-sm">
                            <Text className="flex-1 text-[17px] font-semibold text-slate-800 pr-4 leading-snug">
                                Enable permission to check current status
                            </Text>
                            <Switch
                                trackColor={{ false: colors.slate[200], true: colors.sky[400] }}
                                thumbColor={colors.slate[50]}
                                ios_backgroundColor={colors.slate[200]}
                                onValueChange={setIsPerm1Enabled}
                                value={isPerm1Enabled}
                            />
                        </View>
                        <Text className="text-[13px] font-medium text-slate-500 px-2">
                            Let Return access your app-usage data.
                        </Text>
                    </View>

                    {/* Item 2 */}
                    <View>
                        <View className="bg-white rounded-2xl p-5 flex-row items-center justify-between mb-2 shadow-sm">
                            <Text className="flex-1 text-[17px] font-semibold text-slate-800 pr-4 leading-snug">
                                Allow floating window to appear
                            </Text>
                            <Switch
                                trackColor={{ false: colors.slate[200], true: colors.sky[400] }}
                                thumbColor={colors.slate[50]}
                                ios_backgroundColor={colors.slate[200]}
                                onValueChange={setIsPerm2Enabled}
                                value={isPerm2Enabled}
                            />
                        </View>
                        <Text className="text-[13px] font-medium text-slate-500 px-2">
                            Shows an overlay to gently remind you.
                        </Text>
                    </View>

                    {/* Item 3 */}
                    <View>
                        <View className="bg-white rounded-2xl p-5 flex-row items-center justify-between mb-2 shadow-sm">
                            <Text className="flex-1 text-[17px] font-semibold text-slate-800 pr-4 leading-snug">
                                Ignore battery optimization
                            </Text>
                            <Switch
                                trackColor={{ false: colors.slate[200], true: colors.sky[400] }}
                                thumbColor={colors.slate[50]}
                                ios_backgroundColor={colors.slate[200]}
                                onValueChange={setIsPerm3Enabled}
                                value={isPerm3Enabled}
                            />
                        </View>
                        <Text className="text-[13px] font-medium text-slate-500 px-2">
                            To make sure Return can run in the background
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* ── Sticky Footer ── */}
            <View className="absolute bottom-0 w-full bg-sky-50 px-6 pt-2" style={{ paddingBottom: insets.bottom + 12 }}>
                <TouchableOpacity
                    onPress={handleContinue}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-center gap-2 rounded-2xl py-4 box-border border-b-[5px] bg-sky-400 border-sky-500 shadow-sm"
                >
                    <Text className="text-xl font-medium text-slate-50">
                        Let's Go
                    </Text>
                    <ArrowRight size={20} color={colors.slate[50]} />
                </TouchableOpacity>

                <Text className="text-xs text-slate-500 font-medium text-center mt-4 px-2 leading-relaxed opacity-80">
                    To protect your privacy, data is stored only on your device. Changing permissions or reinstalling Return may lead to incomplete data display.
                </Text>
            </View>
        </View>
    );
}
