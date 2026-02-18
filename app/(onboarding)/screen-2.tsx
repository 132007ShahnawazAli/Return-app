import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { SelectList } from '@/src/components/onboarding/SelectList';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const OPTIONS = [
    { label: 'Tik Tok', value: 'tiktok' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Youtube', value: 'youtube' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Reddit', value: 'reddit' },

];

export default function Screen2Step() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <OnboardingShell
            step={1}
            totalSteps={10}
            question="Select app which distract you" //here will be a select option then a block will be set from here, after onboarding process user will be ready to go
            canContinue={!!selected}
            onContinue={() => router.push('/(onboarding)/screen-3')}
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
