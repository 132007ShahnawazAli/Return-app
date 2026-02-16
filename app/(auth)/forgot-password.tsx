import { resetPassword } from '@/src/services/auth';
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

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setError('');
        setSuccess(false);
        if (!email.trim()) return setError('Please enter your email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return setError('Please enter a valid email address');
        }

        setLoading(true);
        try {
            await resetPassword(email.trim());
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
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
                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mb-8 self-start rounded-full bg-slate-100 px-4 py-2"
                        activeOpacity={0.7}
                    >
                        <Text className="text-sm font-semibold text-slate-500">← Back</Text>
                    </TouchableOpacity>

                    {/* Header */}
                    <View className="mb-10">
                        <Text className="mb-2 text-4xl font-bold tracking-tight text-slate-900">
                            Reset{'\n'}password
                        </Text>
                        <Text className="text-lg text-slate-400">
                            Enter your email and we'll help you reset your password
                        </Text>
                    </View>

                    {/* Success */}
                    {success ? (
                        <View className="mb-6 rounded-xl bg-emerald-50 px-4 py-4">
                            <Text className="mb-1 text-base font-semibold text-emerald-700">
                                Check your email
                            </Text>
                            <Text className="text-sm text-emerald-600">
                                We've sent a password reset link to {email}
                            </Text>
                        </View>
                    ) : null}

                    {/* Error */}
                    {error ? (
                        <View className="mb-4 rounded-xl bg-red-50 px-4 py-3">
                            <Text className="text-sm font-medium text-red-600">{error}</Text>
                        </View>
                    ) : null}

                    {!success && (
                        <>
                            <View className="mb-8">
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

                            <TouchableOpacity
                                onPress={handleResetPassword}
                                disabled={loading}
                                className="items-center rounded-xl bg-sky-500 py-4"
                                activeOpacity={0.8}
                                style={{ opacity: loading ? 0.7 : 1 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text className="text-base font-bold text-white">
                                        Send Reset Link
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {success && (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="items-center rounded-xl bg-sky-500 py-4"
                            activeOpacity={0.8}
                        >
                            <Text className="text-base font-bold text-white">
                                Back to Sign In
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
