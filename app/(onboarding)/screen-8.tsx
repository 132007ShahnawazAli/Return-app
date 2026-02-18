import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
    { label: 'Option 4', value: 'opt4' },
];

export default function Screen8Step() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingShell
            step={7}
            totalSteps={10}
            question="One last check..."
            canContinue={!!selected}
            onContinue={() => router.push('/(onboarding)/age')}
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
