import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ArrowRight } from '@/src/components/icons/ArrowRight';
import { colors } from '@/src/constants/colors';
import { useAppStore } from '@/src/stores/app-store';
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
    hideFooter?: boolean;
    hideSkip?: boolean;
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
    hideFooter = false,
    hideSkip = false,
    children,
}: Props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const setOnboarded = useAppStore((s) => s.setOnboarded);

    const handleBack = () => {
        onBack ? onBack() : router.back();
    };

    const handleSkip = async () => {
        await setOnboarded(true);
        router.replace('/(app)');
    };

    return (
        <View className="flex-1 bg-sky-100" style={{ paddingTop: insets.top }}>

            {/* ── Header ── */}
            <View className="flex-row items-center px-5 pb-4 h-16">
                <View className="flex-1 items-start justify-center">
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
                </View>

                <View className="flex-1 items-center justify-center px-2">
                    <ProgressBar total={totalSteps} current={step} />
                </View>

                <View className="flex-1 items-end">
                    {!hideSkip ? (
                        <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} className="px-2 py-1">
                            <Text className="text-lg font-semibold text-sky-500">Skip</Text>
                        </TouchableOpacity>
                    ) : (
                        <View className="h-10 w-10" />
                    )}
                </View>
            </View>

            {/* ── Content ── */}
            <View className="flex-1">
                {!!question && (
                    <View className="px-8 pt-8">
                        <Text className="text-left tracking-tight text-4xl font-medium text-slate-800">
                            {question}
                        </Text>
                    </View>
                )}

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
            {!hideFooter && (
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
            )}
        </View>
    );
}
