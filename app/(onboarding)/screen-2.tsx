/**
 * screen-2.tsx — "Choose distracting apps"
 *
 * Onboarding Step 2.
 * Users select the apps that distract them most. The selection is stored
 * for use in the distraction-blocking features of the app.
 *
 * Data flow:
 *  1. useInstalledApps hook fetches device apps via InstalledAppsModule (Kotlin)
 *     — each app includes its native icon as a base64 PNG string
 *  2. On Expo Go / iOS, it falls back to a curated popular-apps list
 *  3. User selection is stored in local state; persisted to DB on Continue
 *
 * UX requirements:
 *  - At least 1 app must be selected to continue
 *  - No maximum selection limit (users pick as many as they want)
 *  - Search filters the list in real-time
 */

import { AppPickerList } from '@/src/components/onboarding/AppPickerList';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { useInstalledApps } from '@/src/hooks/useInstalledApps';
import AppBlocker from '@/src/native/AppBlocker';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Screen2Step() {
    const router = useRouter();

    const {
        filteredApps,
        isLoading,
        isFallback,
        searchQuery,
        setSearchQuery,
        toggleApp,
        isSelected,
        selectedApps,
    } = useInstalledApps({ filterSystemApps: true });

    const canContinue = selectedApps.length > 0;

    const handleContinue = async () => {
        // Persist selected apps to native blocker module
        const packageNames = selectedApps.map((a) => a.packageName);
        await AppBlocker.setBlockedApps(packageNames);

        // Navigate to accessibility permission screen
        router.push('/(onboarding)/enable-blocker');
    };

    return (
        <OnboardingShell
            step={1}
            totalSteps={7}
            question="Choose your most distracting apps"
            canContinue={canContinue}
            onContinue={handleContinue}
            showBack={true}
            scrollEnabled={false}
        >
            <AppPickerList
                apps={filteredApps}
                isLoading={isLoading}
                isFallback={isFallback}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isSelected={isSelected}
                onToggle={toggleApp}
                selectedApps={selectedApps}
            />
        </OnboardingShell>
    );
}
