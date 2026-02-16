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
            <Stack.Screen name="age" />
            <Stack.Screen name="focus-time" />
        </Stack>
    );
}
