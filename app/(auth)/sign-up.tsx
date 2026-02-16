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

export default function SignUpScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const signUp = useAuthStore((s) => s.signUp);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setError('');
        if (!name.trim()) return setError('Please enter your name');
        if (!email.trim()) return setError('Please enter your email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return setError('Please enter a valid email address');
        }
        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await signUp(name.trim(), email.trim(), password);
            router.replace('/(app)');
        } catch (err: any) {
            setError(err.message || 'Sign up failed');
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
                    <View className="mb-10">
                        <Text className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
                            Create{'\n'}account
                        </Text>
                        <Text className="text-lg text-slate-400">
                            Start controlling your screen time today
                        </Text>
                    </View>

                    {/* Error */}
                    {error ? (
                        <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
                            <Text className="text-sm font-medium text-red-600">{error}</Text>
                        </View>
                    ) : null}

                    {/* Name */}
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-medium text-slate-600">
                            Full Name
                        </Text>
                        <TextInput
                            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                            placeholder="Jane Doe"
                            placeholderTextColor="#94a3b8"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                        />
                    </View>

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
                    <View className="mb-4">
                        <Text className="mb-2 text-sm font-medium text-slate-600">
                            Password
                        </Text>
                        <TextInput
                            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                            placeholder="Min. 6 characters"
                            placeholderTextColor="#94a3b8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="new-password"
                        />
                    </View>

                    {/* Confirm Password */}
                    <View className="mb-8">
                        <Text className="mb-2 text-sm font-medium text-slate-600">
                            Confirm Password
                        </Text>
                        <TextInput
                            className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900"
                            placeholder="Re-enter your password"
                            placeholderTextColor="#94a3b8"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoComplete="new-password"
                        />
                    </View>

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
                        disabled={loading}
                        className="items-center rounded-xl bg-sky-500 py-4"
                        activeOpacity={0.8}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-base font-bold text-white">
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View className="mt-8 flex-row items-center justify-center">
                        <Text className="text-base text-slate-400">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                            <Text className="text-base font-bold text-sky-500">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
