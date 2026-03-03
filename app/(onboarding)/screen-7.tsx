import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ArrowRight } from '@/src/components/icons/ArrowRight';
import { ProgressBar } from '@/src/components/onboarding/ProgressBar';
import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Screen7Step() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleContinue = () => {
        router.push('/(onboarding)/screen-8');
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
                    <ProgressBar total={8} current={6} />
                </View>

                <View className="flex-1 items-end justify-center">
                    <View className="h-10 w-10" />
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 32,
                    paddingBottom: 120
                }}
                showsVerticalScrollIndicator={false}
            >
                <Text className="text-[36px] font-black text-slate-800 text-center leading-[44px] tracking-tight">
                    <Text className="text-sky-500">Return</Text> connects you back to yourself kinda shit text
                </Text>
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
