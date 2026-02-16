import { useAuthStore } from '@/src/stores/auth-store';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const signIn = useAuthStore((s) => s.signIn);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        setError('');
        if (!email.trim()) return setError('Please enter your email');
        if (!password) return setError('Please enter your password');

        setLoading(true);
        try {
            await signIn(email.trim(), password);
            router.replace('/(app)');
        } catch (err: any) {
            setError(err.message || 'Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-50"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingTop: insets.top + 48,
                    paddingBottom: insets.bottom + 20,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-7">
                    {/* Header */}
                    <View className="mb-12">
                        <Text className="mb-2 text-4xl font-medium tracking-tight text-slate-900">
                            Welcome{'\n'}back
                        </Text>
                        <Text className="text-lg text-slate-400">
                            Sign in to continue your focus journey
                        </Text>
                    </View>

                    {/* Error */}
                    {error ? (
                        <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
                            <Text className="text-sm font-medium text-red-600">{error}</Text>
                        </View>
                    ) : null}

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-medium text-slate-600">
                            Email
                        </Text>
                        <TextInput
                            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                            placeholder="you@example.com"
                            placeholderTextColor="#94a3b8"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                        />
                    </View>

                    {/* Password */}
                    <View className="mb-2">
                        <Text className="mb-2 text-sm font-medium text-slate-600">
                            Password
                        </Text>
                        <TextInput
                            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                            placeholder="Enter your password"
                            placeholderTextColor="#94a3b8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                        />
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/forgot-password')}
                        className="mb-8 self-end"
                        activeOpacity={0.7}
                    >
                        <Text className="text-sm font-semibold text-sky-500">
                            Forgot password?
                        </Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        onPress={handleSignIn}
                        disabled={loading}
                        className="items-center rounded-xl bg-sky-500 py-4"
                        activeOpacity={0.8}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-base font-bold text-white">Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View className="mt-8 flex-row items-center justify-center">
                        <Text className="text-base text-slate-400">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/sign-up')}
                            activeOpacity={0.7}
                        >
                            <Text className="text-base font-bold text-sky-500">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
