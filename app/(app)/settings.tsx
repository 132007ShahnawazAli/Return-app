import { ChevronRight } from '@/src/components/icons/ChevronRight';
import { colors } from '@/src/constants/colors';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SETTINGS_SECTIONS = [
    {
        title: 'General',
        items: [
            { label: 'Notifications', value: 'On' },
            { label: 'Sounds', value: 'On' },
            { label: 'Appearance', value: 'Light' },
        ],
    },
    {
        title: 'Data',
        items: [
            { label: 'Export data', value: '' },
            { label: 'Clear history', value: '' },
        ],
    },
    {
        title: 'About',
        items: [
            { label: 'Rate the app', value: '' },
            { label: 'Privacy policy', value: '' },
            { label: 'Version', value: '1.0.0' },
        ],
    },
];

export default function SettingsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-sky-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 16,
                    paddingBottom: insets.bottom + 100,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <Text className="text-2xl font-bold text-slate-800 mb-6"
                    style={{ letterSpacing: -0.4 }}
                >
                    Settings
                </Text>

                {/* ── Profile Card ── */}
                <View className="bg-white rounded-3xl p-5 mb-5 flex-row items-center">
                    <View className="h-14 w-14 overflow-hidden rounded-full bg-slate-200 mr-4">
                        <Image
                            source={{ uri: 'https://avatar.iran.liara.run/public' }}
                            className="h-full w-full"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-slate-800">
                            User Name
                        </Text>
                        <Text className="text-sm font-medium text-slate-400">
                            Manage your profile
                        </Text>
                    </View>
                    <ChevronRight size={20} color={colors.slate[300]} />
                </View>

                {/* ── Settings Sections ── */}
                {SETTINGS_SECTIONS.map((section) => (
                    <View key={section.title} className="mb-5">
                        <Text className="text-sm font-semibold text-slate-400 mb-2.5 px-1">
                            {section.title}
                        </Text>
                        <View className="bg-white rounded-3xl overflow-hidden">
                            {section.items.map((item, i) => (
                                <View key={item.label}>
                                    {i > 0 && <View className="mx-4 h-[1px] bg-slate-100" />}
                                    <Pressable className="flex-row items-center justify-between px-4 py-3.5 active:opacity-80">
                                        <Text className="text-base font-medium text-slate-800">
                                            {item.label}
                                        </Text>
                                        <View className="flex-row items-center">
                                            {item.value ? (
                                                <Text className="text-base font-semibold text-slate-400 mr-1">
                                                    {item.value}
                                                </Text>
                                            ) : null}
                                            <ChevronRight size={16} color={colors.slate[300]} />
                                        </View>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
