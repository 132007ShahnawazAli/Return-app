// app/index.tsx — Smart entry gate
// Redirects based on onboarding + auth state
import { useAuthStore } from '@/src/stores/auth-store';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function EntryGate() {
  const isReady = useAuthStore((s) => s.isReady);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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

  // Not authenticated → send to sign in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Authenticated → send to app
  return <Redirect href="/(app)" />;
}
