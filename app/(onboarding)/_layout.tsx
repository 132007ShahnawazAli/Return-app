import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: '#f0f9ff' },
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="screen-2" />
            <Stack.Screen name="screen-3" />
            <Stack.Screen name="screen-4" />
            <Stack.Screen name="screen-5" />

            <Stack.Screen name="age" />
            <Stack.Screen name="focus-time" />
            <Stack.Screen name="screen-9" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="email" />
            <Stack.Screen name="screen-10" />
        </Stack>
    );
}
