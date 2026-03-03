import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ArrowRight } from '@/src/components/icons/ArrowRight';
import { CheckCircleFull } from '@/src/components/icons/CheckCircleFull';
import { ProgressBar } from '@/src/components/onboarding/ProgressBar';
import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen6Step() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleContinue = () => {
        router.push('/(onboarding)/screen-7');
    };

    // 10x10 = 100 dots total, 62 filled (to match badge text).
    const TOTAL_DOTS = 100;
    const FILLED_DOTS = 62;

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
                    <ProgressBar total={8} current={5} />
                </View>

                <View className="flex-1 items-end justify-center">
                    <View className="h-10 w-10" />
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Top Typography ── */}
                <View className="items-center px-6 pt-4 pb-12">
                    <Text className="text-[40px] font-black text-slate-800 text-center leading-[48px] tracking-tight">
                        Return supports{'\n'}<Text className="text-sky-500">steady</Text> progress
                    </Text>
                </View>

                {/* ── Dot Grid Card ── */}
                <View>
                    <Text className=" font-medium text-slate-700">Days wasted</Text>
                </View>
                <View className="bg-white rounded-[24px] mx-6 p-6 shadow-sm mb-12 flex-row flex-wrap justify-center gap-x-[11px] gap-y-2">
                    {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
                        <View
                            key={i}
                            className={`w-3.5 h-3.5 rounded-full ${i < FILLED_DOTS ? 'bg-slate-800' : 'bg-slate-200'
                                }`}
                        />
                    ))}
                </View>

                {/* ── Checklist ── */}
                <View className="px-6 pb-8 gap-y-6">
                    <View className="flex-row items-center gap-x-4">
                        <CheckCircleFull color={colors.sky[500]} size={24} />
                        <Text className="flex-1 text-[17px] font-medium text-slate-700 leading-snug">
                            You are scrolling away <Text className="text-sky-500 font-bold">9 years</Text> of your life staring at Reels
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-x-4">
                        <CheckCircleFull color={colors.sky[500]} size={24} />
                        <Text className="flex-1 text-[17px] font-medium text-slate-700 leading-snug">
                            Already wasted <Text className="text-sky-500 font-bold">47 days</Text> this year scrolling
                        </Text>
                    </View>

                    <View className="flex-row items-center gap-x-4">
                        <CheckCircleFull color={colors.sky[500]} size={24} />
                        <Text className="flex-1 text-[17px] font-medium text-slate-700 leading-snug">
                            Already wasted <Text className="text-sky-500 font-bold">47 days</Text> this year scrolling
                        </Text>
                    </View>


                </View>

            </ScrollView>

            {/* ── Sticky Footer ── */}
            <View className="absolute bottom-0 w-full bg-sky-50 px-6 pt-2" style={{ paddingBottom: insets.bottom + 12 }}>
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
    );
}
