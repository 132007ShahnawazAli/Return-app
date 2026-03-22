import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useAppStore } from '@/src/stores/app-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: 'Morning', subtitle: '6 AM – 12 PM', value: 'morning' },
    { label: 'Afternoon', subtitle: '12 PM – 6 PM', value: 'afternoon' },
    { label: 'Evening', subtitle: '6 PM – 12 AM', value: 'evening' },
    { label: 'Custom', subtitle: 'Set Duration', value: 'custom' },
];

export default function FocusTimeStep() {
    const router = useRouter();
    const setOnboarded = useAppStore((s) => s.setOnboarded);
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        router.push('/(onboarding)/screen-9');
    };

    return (
        <OnboardingShell
            step={6}
            totalSteps={7}
            question="When do you want focused time?"
            canContinue={!!selected}
            onContinue={handleContinue}
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
