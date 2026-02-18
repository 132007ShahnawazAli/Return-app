import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: '20 times', value: '20' },
    { label: '40 times', value: '40' },
    { label: '60 times', value: '60' },
    { label: 'Way too many (100+)', value: '100_plus' },
];

export default function Screen4Step() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingShell
            step={3}
            totalSteps={10}
            question="How many times do you unlock your phone daily?"
            canContinue={!!selected}
            onContinue={() => router.push('/(onboarding)/screen-5')}
        >
            <SelectList
                options={OPTIONS}
                selected={selected}
                onSelect={setSelected}
            />
        </OnboardingShell>
    );
}
