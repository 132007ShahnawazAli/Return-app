/**
 * AppPickerList.tsx
 *
 * Simple, clean app picker — individual rounded cards per app.
 * Matches SelectList style: bg-slate-50 rounded-2xl, bg-sky-300 when active.
 * No search bar. Just clean boxes.
 */

import { colors } from '@/src/constants/colors';
import { type InstalledAppWithIcon } from '@/src/hooks/useInstalledApps';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
    type ListRenderItemInfo,
} from 'react-native';

// ─── Avatar fallback palette ──────────────────────────────────────────────────

const PALETTE = [
    { bg: colors.sky[200], text: colors.sky[800] },
    { bg: colors.pink[200], text: colors.pink[800] },
    { bg: colors.emerald[200], text: colors.emerald[800] },
    { bg: colors.amber[200], text: colors.amber[800] },
    { bg: colors.violet[200], text: colors.violet[800] },
    { bg: colors.rose[200], text: colors.rose[800] },
    { bg: colors.lime[200], text: colors.lime[800] },
    { bg: colors.cyan[200], text: colors.cyan[800] },
];

function avatarColors(name: string) {
    return PALETTE[(name.charCodeAt(0) || 0) % PALETTE.length]!;
}

// ─── App Icon ─────────────────────────────────────────────────────────────────

function AppIcon({ app, size = 38 }: { app: InstalledAppWithIcon; size?: number }) {
    const p = avatarColors(app.appName);
    if (app.icon) {
        return (
            <Image
                source={{ uri: `data:image/png;base64,${app.icon}` }}
                style={{ width: size, height: size }}
                resizeMode="cover"
            />
        );
    }
    return (
        <View style={{ width: size, height: size, borderRadius: 10, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: size * 0.42, fontWeight: '700', color: p.text }}>
                {app.appName.charAt(0).toUpperCase()}
            </Text>
        </View>
    );
}

// ─── App Row ──────────────────────────────────────────────────────────────────

const AppRow = memo(function AppRow({ app, isSelected, onPress }: {
    app: InstalledAppWithIcon;
    isSelected: boolean;
    onPress: (pkg: string) => void;
}) {
    const handlePress = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress(app.packageName);
    }, [app.packageName, onPress]);

    return (
        <View style={{ marginBottom: 10 }}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                className={`flex-row items-center rounded-2xl px-5 py-4 shadow-md shadow-slate-400 ${isSelected ? 'bg-sky-300' : 'bg-slate-50'}`}
            >
                <AppIcon app={app} />
                <Text
                    className={`flex-1 ml-3 text-lg font-medium ${isSelected ? 'text-sky-800' : 'text-slate-700'}`}
                    numberOfLines={1}
                >
                    {app.appName}
                </Text>
                <View
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: isSelected ? colors.sky[500] : 'transparent',
                        borderWidth: isSelected ? 0 : 2,
                        borderColor: colors.slate[300],
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8,
                    }}
                >
                    {isSelected && (
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800', lineHeight: 15 }}>✓</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
});

// ─── Main Component ───────────────────────────────────────────────────────────

interface AppPickerListProps {
    apps: InstalledAppWithIcon[];
    isLoading: boolean;
    isFallback: boolean;
    searchQuery: string;
    onSearchChange: (q: string) => void;
    isSelected: (packageName: string) => boolean;
    onToggle: (packageName: string) => void;
    selectedApps: InstalledAppWithIcon[];
}

export function AppPickerList({
    apps,
    isLoading,
    isSelected,
    onToggle,
}: AppPickerListProps) {

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<InstalledAppWithIcon>) => (
            <AppRow
                app={item}
                isSelected={isSelected(item.packageName)}
                onPress={onToggle}
            />
        ),
        [isSelected, onToggle]
    );

    const keyExtractor = useCallback((item: InstalledAppWithIcon) => item.packageName, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, gap: 10 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <View
                        key={i}
                        className="rounded-2xl bg-slate-50 px-5 py-4 shadow-md shadow-slate-400"
                        style={{ flexDirection: 'row', alignItems: 'center', opacity: 0.6 }}
                    >
                        <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: colors.sky[100] }} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <View style={{ height: 14, borderRadius: 7, backgroundColor: colors.sky[100], width: '50%' }} />
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    return (
        <FlatList
            data={apps}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews
            initialNumToRender={12}
            maxToRenderPerBatch={8}
            windowSize={5}
        />
    );
}
