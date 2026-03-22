import { AgePicker } from '@/src/components/onboarding/AgePicker';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function AgeStep() {
    const router = useRouter();
    const [age, setAge] = useState(19);

    return (
        <OnboardingShell
            step={5}
            totalSteps={7}
            question="How old are you?"
            canContinue={true}
            onContinue={() => router.push('/(onboarding)/focus-time')}
            showBack={true}
            scrollEnabled={false}
        >
            {/* The AgePicker handles the entire central view natively via Reanimated FlatList */}
            <AgePicker
                min={10}
                max={99}
                value={age}
                onChange={setAge}
            />
        </OnboardingShell>
    );
}
