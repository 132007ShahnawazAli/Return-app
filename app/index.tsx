// app/index.tsx — Smart entry gate
// Redirects based on onboarding state
import { useAppStore } from '@/src/stores/app-store';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function EntryGate() {
  const isReady = useAppStore((s) => s.isReady);
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  // Still loading — show nothing (splash screen is visible)
  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // Not onboarded → send to onboarding
  if (!isOnboarded) {
    return <Redirect href="/(onboarding)" />;
  }

  // Onboarded → send to app
  return <Redirect href="/(app)" />;
}
