import { Tick } from '@/src/components/icons/Tick';
import { colors } from '@/src/constants/colors';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Mock Data ─────────────────────────────────────────────────────────────────

const WEEK_DATA = [
    { day: 'Mon', hours: 3.2, blocked: 2.1 },
    { day: 'Tue', hours: 4.5, blocked: 3.0 },
    { day: 'Wed', hours: 2.8, blocked: 1.9 },
    { day: 'Thu', hours: 5.1, blocked: 3.8 },
    { day: 'Fri', hours: 3.9, blocked: 2.7 },
    { day: 'Sat', hours: 6.2, blocked: 1.2 },
    { day: 'Sun', hours: 4.0, blocked: 2.0 },
];

const MAX_BAR_HEIGHT = 120;
const MAX_HOURS = 7;

const STREAK_DAYS = [
    { day: 'M', done: true },
    { day: 'T', done: true },
    { day: 'W', done: true },
    { day: 'T', done: true },
    { day: 'F', done: true },
    { day: 'S', done: false },
    { day: 'S', done: false },
];

const TOP_APPS = [
    { name: 'Instagram', time: '1h 23m', color: colors.pink[400] },
    { name: 'YouTube', time: '58m', color: colors.red[400] },
    { name: 'TikTok', time: '45m', color: colors.slate[700] },
    { name: 'Twitter', time: '32m', color: colors.sky[400] },
    { name: 'WhatsApp', time: '28m', color: colors.emerald[400] },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ActivityScreen() {
    const insets = useSafeAreaInsets();
    const [period, setPeriod] = useState<'Week' | 'Month'>('Week');

    const todayIndex = new Date().getDay();
    // Convert: JS Sunday=0 → our Monday=0
    const todayIdx = todayIndex === 0 ? 6 : todayIndex - 1;

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
                    Activity
                </Text>

                {/* ── Period Toggle ── */}
                <View className="flex-row bg-white rounded-full p-1 mb-5 self-start">
                    {(['Week', 'Month'] as const).map(p => {
                        const active = period === p;
                        return (
                            <Pressable
                                key={p}
                                onPress={() => setPeriod(p)}
                                className={`px-5 py-2 rounded-full ${active ? 'bg-sky-300' : ''}`}
                            >
                                <Text
                                    className="text-sm font-semibold"
                                    style={{ color: active ? colors.sky[700] : colors.slate[400] }}
                                >
                                    {p}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* ── Screen Time Bar Chart ── */}
                <View className="bg-white rounded-3xl p-5 mb-4">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-lg font-bold text-slate-800">
                            Screen time
                        </Text>
                        <Text className="text-2xl font-bold text-slate-800"
                            style={{ letterSpacing: -1 }}
                        >
                            4h 14m
                        </Text>
                    </View>
                    <Text className="text-xs font-medium text-slate-400 mb-5">
                        Daily average this week
                    </Text>

                    {/* Bars */}
                    <View className="flex-row items-end justify-between" style={{ height: MAX_BAR_HEIGHT + 24 }}>
                        {WEEK_DATA.map((d, i) => {
                            const totalH = (d.hours / MAX_HOURS) * MAX_BAR_HEIGHT;
                            const blockedH = (d.blocked / MAX_HOURS) * MAX_BAR_HEIGHT;
                            const isToday = i === todayIdx;

                            return (
                                <View key={d.day} className="items-center flex-1">
                                    {/* Stacked bar */}
                                    <View
                                        className="w-7 rounded-full overflow-hidden"
                                        style={{ height: totalH }}
                                    >
                                        {/* Screen time (full bar) */}
                                        <View
                                            className="w-full rounded-full"
                                            style={{
                                                height: totalH,
                                                backgroundColor: isToday ? colors.pink[300] : colors.pink[200],
                                            }}
                                        />
                                        {/* Blocked overlay from bottom */}
                                        <View
                                            className="w-full absolute bottom-0 rounded-b-full"
                                            style={{
                                                height: blockedH,
                                                backgroundColor: isToday ? colors.sky[400] : colors.sky[200],
                                            }}
                                        />
                                    </View>
                                    {/* Day label */}
                                    <Text
                                        className="text-xs font-semibold mt-2"
                                        style={{ color: isToday ? colors.slate[800] : colors.slate[400] }}
                                    >
                                        {d.day}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    {/* Legend */}
                    <View className="flex-row items-center mt-4 gap-5">
                        <View className="flex-row items-center">
                            <View className="h-3 w-3 rounded-full bg-pink-300 mr-2" />
                            <Text className="text-xs font-medium text-slate-400">Screen time</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="h-3 w-3 rounded-full bg-sky-300 mr-2" />
                            <Text className="text-xs font-medium text-slate-400">Blocked</Text>
                        </View>
                    </View>
                </View>

                {/* ── Streak Card ── */}
                <View className="bg-white rounded-3xl p-5 mb-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-lg font-bold text-slate-800">
                                Streak
                            </Text>
                            <Text className="text-xs font-medium text-slate-400">
                                Stay consistent, keep going!
                            </Text>
                        </View>
                        <View className="bg-amber-100 rounded-xl px-3 py-1">
                            <Text className="text-xl font-bold text-amber-600">
                                🔥 5
                            </Text>
                        </View>
                    </View>

                    {/* Streak dots */}
                    <View className="flex-row justify-between">
                        {STREAK_DAYS.map((d, i) => (
                            <View key={i} className="items-center">
                                <View
                                    className={`h-10 w-10 items-center justify-center rounded-full mb-1.5 ${d.done ? 'bg-emerald-300' : 'bg-slate-100'
                                        }`}
                                >
                                    {d.done ? (
                                        <Tick size={20} color={colors.emerald[700]} />
                                    ) : (
                                        <View className="h-2 w-2 rounded-full bg-slate-200" />
                                    )}
                                </View>
                                <Text
                                    className="text-xs font-semibold"
                                    style={{ color: d.done ? colors.emerald[600] : colors.slate[300] }}
                                >
                                    {d.day}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── Stats Row ── */}
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-white rounded-3xl p-4">
                        <Text className="text-2xl font-bold text-slate-800"
                            style={{ letterSpacing: -0.5 }}
                        >
                            23
                        </Text>
                        <Text className="text-xs font-medium text-slate-400 mt-0.5">
                            Blocks completed
                        </Text>
                    </View>
                    <View className="flex-1 bg-white rounded-3xl p-4">
                        <Text className="text-2xl font-bold text-slate-800"
                            style={{ letterSpacing: -0.5 }}
                        >
                            4.2h
                        </Text>
                        <Text className="text-xs font-medium text-slate-400 mt-0.5">
                            Total focus time
                        </Text>
                    </View>
                    <View className="flex-1 bg-white rounded-3xl p-4">
                        <Text className="text-2xl font-bold text-slate-800"
                            style={{ letterSpacing: -0.5 }}
                        >
                            87%
                        </Text>
                        <Text className="text-xs font-medium text-slate-400 mt-0.5">
                            Completion
                        </Text>
                    </View>
                </View>

                {/* ── Most Used Apps ── */}
                <View className="bg-white rounded-3xl p-5">
                    <Text className="text-lg font-bold text-slate-800 mb-4">
                        Most used apps
                    </Text>
                    <View className="gap-3">
                        {TOP_APPS.map((app, i) => (
                            <View key={app.name} className="flex-row items-center">
                                {/* Rank */}
                                <Text className="text-sm font-bold text-slate-300 w-6">
                                    {i + 1}
                                </Text>
                                {/* App dot */}
                                <View
                                    className="h-9 w-9 rounded-xl items-center justify-center mr-3"
                                    style={{ backgroundColor: app.color + '20' }}
                                >
                                    <View
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: app.color }}
                                    />
                                </View>
                                {/* Name */}
                                <Text className="flex-1 text-base font-medium text-slate-700">
                                    {app.name}
                                </Text>
                                {/* Time */}
                                <Text className="text-sm font-semibold text-slate-400">
                                    {app.time}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
