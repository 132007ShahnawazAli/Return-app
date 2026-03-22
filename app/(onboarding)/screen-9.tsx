import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function Screen9Step() {
    const router = useRouter();

    return (
        <OnboardingShell
            step={10}
            totalSteps={10}
            question=""
            canContinue={true}
            onContinue={() => router.push('/(onboarding)/auth')}
            showBack={true}
        >
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-center text-lg font-medium text-slate-500 mb-6">
                    If nothing changes, you are gonna spend...
                </Text>

                <Text className="text-center text-4xl font-bold text-slate-800 leading-[1.2] tracking-tighter mb-8">
                    <Text className="text-sky-500">1643 hours</Text> looking at your phone this year.
                </Text>

                <Text className="text-center text-lg font-medium text-slate-500 mb-8">
                    That's <Text className="text-sky-500">68</Text> full <Text className="text-sky-500">days.</Text>
                </Text>

                <Text className="text-center text-4xl font-bold text-slate-800 leading-[1.2] tracking-tight">
                    Over your lifetime, that is roughly <Text className="text-sky-500">12 years.</Text>
                </Text>
            </View>
        </OnboardingShell>
    );
}
