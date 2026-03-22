import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { Lock } from '@/src/components/icons/Lock';
import { Mail } from '@/src/components/icons/Mail';
import { colors } from '@/src/constants/colors';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmailAuthScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { signIn, signUp } = useAuth();

    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setErrorMsg(null);
    };

    const handleAuthenticate = async () => {
        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);

        const result = isLogin
            ? await signIn(email, password)
            : await signUp(email, password);

        setIsLoading(false);

        if (!result.success) {
            setErrorMsg(result.error);
        } else {
            // Once authenticated, the global EntryGate index.tsx will auto-route us to (app)
            // or we can manually push if not onboarded. Since they are in the onboarding flow,
            // let's take them to the next step, which used to be screen-10.
            router.push('/(onboarding)/screen-10');
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.sky[100] }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={{ paddingTop: insets.top, flex: 1 }}>

                {/* ── Header ── */}
                <View className="flex-row items-center justify-between px-5 pb-4 pt-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.6}
                        className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
                    >
                        <ArrowLeft size={20} />
                    </TouchableOpacity>
                    <View />
                    <View className="h-10 w-10" />
                </View>

                {/* ── Scrollable Content ── */}
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center pb-12">

                        {/* ── Header Text ── */}
                        <Animated.View entering={FadeInDown.duration(500)} className="mb-10 items-center">
                            <View className="h-16 w-16 bg-white rounded-3xl items-center justify-center mb-6 shadow-sm shadow-sky-200/50">
                                <Mail size={32} color={colors.sky[400]} />
                            </View>
                            <Text className="text-center tracking-tight text-4xl font-semibold text-slate-800 leading-snug">
                                {isLogin ? 'Welcome back' : 'Create account'}
                            </Text>
                            <Text className="text-center text-base text-slate-500 mt-3 font-medium">
                                {isLogin
                                    ? 'Enter your details to log in to your account.'
                                    : 'Securely sync your focus data across devices.'}
                            </Text>
                        </Animated.View>

                        {/* ── Error Message ── */}
                        {errorMsg ? (
                            <Animated.View entering={FadeInUp.duration(300)} className="mb-6 bg-red-100 rounded-2xl p-4 border border-red-200">
                                <Text className="text-red-600 text-sm font-medium text-center">
                                    {errorMsg}
                                </Text>
                            </Animated.View>
                        ) : null}

                        {/* ── Input Fields ── */}
                        <Animated.View entering={FadeInDown.duration(500).delay(150)} className="gap-4">

                            {/* Email Input */}
                            <View className="bg-white rounded-2xl flex-row items-center px-4 py-1 pb-1 h-[60px] border border-slate-200 focus:border-sky-400">
                                <Mail size={20} color={colors.slate[400]} />
                                <TextInput
                                    className="flex-1 ml-3 text-lg text-slate-800 font-medium"
                                    placeholder="Email address"
                                    placeholderTextColor={colors.slate[400]}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setErrorMsg(null);
                                    }}
                                />
                            </View>

                            {/* Password Input */}
                            <View className="bg-white rounded-2xl flex-row items-center px-4 py-1 pb-1 h-[60px] border border-slate-200 focus:border-sky-400">
                                <Lock size={20} color={colors.slate[400]} />
                                <TextInput
                                    className="flex-1 ml-3 text-lg text-slate-800 font-medium"
                                    placeholder="Password"
                                    placeholderTextColor={colors.slate[400]}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setErrorMsg(null);
                                    }}
                                />
                            </View>

                        </Animated.View>

                        {/* ── Submit Button ── */}
                        <Animated.View entering={FadeInDown.duration(500).delay(300)} className="mt-8">
                            <TouchableOpacity
                                onPress={handleAuthenticate}
                                activeOpacity={0.8}
                                disabled={isLoading}
                                className={`rounded-2xl py-4 h-[60px] items-center justify-center border-b-[4px] ${isLoading || !email || !password
                                        ? 'bg-sky-300 border-sky-400'
                                        : 'bg-sky-500 border-sky-600'
                                    }`}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-xl font-semibold text-white tracking-tight">
                                        {isLogin ? 'Log In' : 'Sign Up'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        {/* ── Toggle Mode ── */}
                        <Animated.View entering={FadeInDown.duration(500).delay(400)} className="mt-8 flex-row items-center justify-center gap-2">
                            <Text className="text-slate-500 font-medium text-base">
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                            </Text>
                            <Pressable onPress={toggleMode}>
                                <Text className="text-sky-500 font-semibold text-base py-2">
                                    {isLogin ? 'Sign Up' : 'Log In'}
                                </Text>
                            </Pressable>
                        </Animated.View>

                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}
