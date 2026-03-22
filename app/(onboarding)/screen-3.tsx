import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: 'Exercise', value: 'exercise' },
    { label: 'Read books', value: 'read' },
    { label: 'Work on a hobby', value: 'creative' },
    { label: 'Spend time with family', value: 'social' },
    { label: 'Go outside', value: 'outdoors' },
    { label: 'Meditate', value: 'meditate' },
];

export default function Screen3Step() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingShell
            step={2}
            totalSteps={7}
            question="What is your goal?"
            canContinue={!!selected}
            onContinue={() => router.push('/(onboarding)/screen-4')}
            showBack={true}
        >
            <SelectList
                options={OPTIONS}
                selected={selected}
                onSelect={setSelected}
            />
        </OnboardingShell>
    );
}
