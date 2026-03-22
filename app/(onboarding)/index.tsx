import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: 'Under 1 hour', value: 'under_1' },
    { label: '1–3 hours', value: '1_3' },
    { label: '3–4 hours', value: '3_4' },
    { label: '4–5 hours', value: '4_5' },
    { label: '5–7 hours', value: '5_7' },
    { label: 'More than 7 hours', value: '7_plus' },
];

export default function ScreenTimeStep() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingShell
            step={0}
            totalSteps={7}
            question="What is your daily average screen time?"
            canContinue={!!selected}
            onContinue={() => router.push('/(onboarding)/screen-2')}
            showBack={false}
        >
            <SelectList
                options={OPTIONS}
                selected={selected}
                onSelect={setSelected}
            />
        </OnboardingShell>
    );
}
