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
            <Stack.Screen name="screen-6" />
            <Stack.Screen name="screen-7" />
            <Stack.Screen name="screen-8" />
            <Stack.Screen name="age" />
            <Stack.Screen name="focus-time" />
        </Stack>
    );
}
