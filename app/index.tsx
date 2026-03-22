// app/index.tsx — Smart entry gate
// Redirects based on app readiness, onboarding, and auth state.

import { useAuth } from '@/src/hooks/useAuth';
import { useAppStore } from '@/src/stores/app-store';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function EntryGate() {
  // App readiness (DB initialised + settings loaded)
  const isReady = useAppStore((s) => s.isReady);
  const isOnboarded = useAppStore((s) => s.isOnboarded);

  // Authentication state (from AuthContext)
  const { loading: authLoading } = useAuth();

  // ── Still loading — show spinner (splash screen is visible) ───────
  if (!isReady || authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  // ── Not onboarded → send to onboarding flow ──────────────────────
  if (!isOnboarded) {
    return <Redirect href="/(onboarding)" />;
  }

  // ── Onboarded → send to main app ─────────────────────────────────
  return <Redirect href="/(app)" />;
}
