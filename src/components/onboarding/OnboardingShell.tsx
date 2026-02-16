import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ArrowRight } from '@/src/components/icons/ArrowRight';
import { colors } from '@/src/constants/colors';
import { useAuthStore } from '@/src/stores/auth-store';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressBar } from './ProgressBar';

interface Props {
    step: number;
    totalSteps: number;
    question: string;
    canContinue: boolean;
    onContinue: () => void;
    showBack?: boolean;
    onBack?: () => void;
    children: React.ReactNode;
}

export function OnboardingShell({
    step,
    totalSteps,
    question,
    canContinue,
    onContinue,
    showBack = true,
    onBack,
    children,
}: Props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const setOnboarded = useAuthStore((s) => s.setOnboarded);

    const handleBack = () => {
        onBack ? onBack() : router.back();
    };

    const handleSkip = async () => {
        await setOnboarded(true);
        router.replace('/(auth)/sign-in');
    };

    return (
        <View className="flex-1 bg-sky-100" style={{ paddingTop: insets.top }}>

            {/* ── Header ── */}
            <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
                {showBack ? (
                    <TouchableOpacity
                        onPress={handleBack}
                        activeOpacity={0.6}
                        className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                    >
                        <ArrowLeft size={20} />
                    </TouchableOpacity>
                ) : (
                    <View className="h-10 w-10" />
                )}

                <ProgressBar total={totalSteps} current={step} />

                <TouchableOpacity onPress={handleSkip} activeOpacity={0.7}>
                    <Text className="text-lg font-semibold text-sky-500">Skip</Text>
                </TouchableOpacity>
            </View>

            {/* ── Content ── */}
            <View className="flex-1 pt-8">
                <View className="px-6">
                    <Text className="text-center tracking-tight text-4xl font-medium text-slate-800">
                        {question}
                    </Text>
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingVertical: 24,
                        paddingHorizontal: 24,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {children}
                </ScrollView>
            </View>

            {/* ── Footer ── */}
            <View className="px-6" style={{ paddingBottom: insets.bottom + 12 }}>
                <TouchableOpacity
                    onPress={onContinue}
                    disabled={!canContinue}
                    activeOpacity={0.8}
                    className={`flex-row items-center justify-center gap-2 rounded-2xl py-4 box-border border-b-[5px] ${canContinue ? 'bg-sky-400 border-sky-500' : 'bg-slate-200 border-slate-300'
                        }`}
                >
                    <Text
                        className={`text-xl font-medium ${canContinue ? 'text-slate-50' : 'text-slate-400'
                            }`}
                    >
                        Continue
                    </Text>
                    <ArrowRight size={20} color={colors.slate[50]} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
