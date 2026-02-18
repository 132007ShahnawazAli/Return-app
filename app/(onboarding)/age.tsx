import { NumberPicker } from '@/src/components/onboarding/NumberPicker';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function AgeStep() {
    const router = useRouter();
    const [age, setAge] = useState(17);

    return (
        <OnboardingShell
            step={8}
            totalSteps={10}
            question="How old are you?"
            canContinue={true}
            onContinue={() => router.push('/(onboarding)/focus-time')}
            showBack={false}
        >
            <NumberPicker
                value={age}
                min={10}
                max={80}
                unit="years old"
                onChange={setAge}
            />
        </OnboardingShell>
    );
}
