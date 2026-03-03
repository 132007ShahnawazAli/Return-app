import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: 'Morning', subtitle: '6 AM – 12 PM', value: 'morning' },
    { label: 'Afternoon', subtitle: '12 PM – 6 PM', value: 'afternoon' },
    { label: 'Evening', subtitle: '6 PM – 12 AM', value: 'evening' },
    { label: 'Custom', subtitle: 'Set Duration', value: 'custom' },
];

export default function Screen3Step() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleContinue = () => {
        router.push('/(onboarding)/screen-4');
    };

    return (
        <OnboardingShell
            step={2}
            totalSteps={8}
            question="What time of day do you scroll the most?"
            canContinue={!!selected}
            onContinue={handleContinue}
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
