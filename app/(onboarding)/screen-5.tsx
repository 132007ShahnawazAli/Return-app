import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ArrowRight } from '@/src/components/icons/ArrowRight';
import { CheckCircleFull } from '@/src/components/icons/CheckCircleFull';
import { ProgressBar } from '@/src/components/onboarding/ProgressBar';
import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen5Step() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleContinue = () => {
        router.push('/(onboarding)/screen-6');
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
                    <ProgressBar total={8} current={4} />
                </View>

                <View className="flex-1 items-end justify-center">
                    <View className="h-10 w-10" />
                </View>
            </View>

            {/* ── Top Typography ── */}
            <View className="items-center px-6 pt-2 pb-8">
                <View className="flex-row items-center gap-1 mb-4">
                    <Text className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                        Your personal plan is ready
                    </Text>
                </View>
                <Text className="text-5xl font-black text-slate-800 text-center leading-[48px] tracking-tight">
                    Reduce <Text className="text-sky-500">your </Text> screen time
                </Text>
            </View>

            {/* ── Bottom White Card ── */}
            <View className="flex-1 bg-white rounded-t-[40px] shadow-sm overflow-hidden">
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 32, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text className="text-2xl font-bold text-slate-800 mb-6">
                        Projected progress
                    </Text>

                    {/* Custom progress visual */}
                    <View className="mb-10">
                        <Text className="text-xs font-medium text-slate-400 mt-3">Today</Text>
                    </View>

                    {/* Checklist */}
                    <View className="gap-y-4">
                        <View className="flex-row items-start gap-x-3">
                            <View className="pt-0.5"><CheckCircleFull color={colors.sky[500]} size={20} /></View>
                            <Text className="flex-1 text-base font-semibold text-slate-700 leading-tight">
                                You'll maintain your weight effortlessly
                            </Text>
                        </View>

                        <View className="flex-row items-start gap-x-3">
                            <View className="pt-0.5"><CheckCircleFull color={colors.sky[500]} size={20} /></View>
                            <Text className="flex-1 text-base font-semibold text-slate-700 leading-tight">
                                Results are focused only for the long-term
                            </Text>
                        </View>

                        <View className="flex-row items-start gap-x-3">
                            <View className="pt-0.5"><CheckCircleFull color={colors.sky[500]} size={20} /></View>
                            <Text className="flex-1 text-base font-semibold text-slate-700 leading-tight">
                                Habits will help you sustain your goals
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* ── Sticky Footer ── */}
                <View className="absolute bottom-0 w-full bg-white px-6 pt-2" style={{ paddingBottom: insets.bottom + 12 }}>
                    <TouchableOpacity
                        onPress={handleContinue}
                        activeOpacity={0.8}
                        className="flex-row items-center justify-center gap-2 rounded-2xl py-4 box-border border-b-[5px] bg-sky-400 border-sky-500"
                    >
                        <Text className="text-xl font-medium text-slate-50">
                            Continue
                        </Text>
                        <ArrowRight size={20} color={colors.slate[50]} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
