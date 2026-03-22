import { colors } from '@/src/constants/colors';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronRight } from '../icons/ChevronRight';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

const DURATION_OPTIONS = [
    { label: '15m', value: 15 },
    { label: '30m', value: 30 },
    { label: '45m', value: 45 },
    { label: '1h', value: 60 },
    { label: '1.5h', value: 90 },
    { label: '2h', value: 120 },
] as const;

interface IdeaConfig {
    title: string;
    subtitle: string;
    time: string;
    color: string;
    lightColor: string;
    btnColor: string;
    btnBorder: string;
    defaultDays: string[];
    defaultDuration: number;
    Illustration: React.FC<any>;
}

interface RoutineDetailSheetProps {
    idea: IdeaConfig;
    onClose: () => void;
}

export function RoutineDetailSheet({ idea, onClose }: RoutineDetailSheetProps) {
    const [startTime] = useState(() => {
        const [time, period] = idea.subtitle.split(' ');
        const [hour, minute] = time.split(':');
        return {
            hour: hour.padStart(2, '0'),
            minute: minute.padStart(2, '0'),
            period
        };
    });

    const [duration, setDuration] = useState(idea.defaultDuration);
    const [selectedDays, setSelectedDays] = useState<string[]>(idea.defaultDays);

    const toggleDay = useCallback((day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }, []);

    const getDarkColor = (color: string) => {
        if (color === colors.sky[300]) return colors.sky[700];
        if (color === colors.amber[300]) return colors.amber[700];
        if (color === colors.emerald[300]) return colors.emerald[700];
        return colors.slate[700];
    };

    const darkColor = getDarkColor(idea.color);

    // Calculate end time from start + duration
    const startTotalMin =
        ((Number(startTime.hour) % 12) + (startTime.period === 'PM' ? 12 : 0)) * 60 +
        Number(startTime.minute);
    const endTotalMin = startTotalMin + duration;
    const endH = Math.floor(endTotalMin / 60) % 24;
    const endM = endTotalMin % 60;
    const endPeriod = endH >= 12 ? 'PM' : 'AM';
    const endHour12 = endH % 12 || 12;

    const fmt = (h: number, m: number, p: string) =>
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`;

    return (
        <View className="flex-1 pt-1">
            {/* ── Header ── */}
            <View className="flex-row items-center mb-5">
                <View
                    className="h-16 w-16 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: idea.lightColor }}
                >
                    <idea.Illustration width={42} height={42} />
                </View>
                <View className="ml-4 flex-1">
                    <Text
                        className="text-xs font-semibold mb-0.5"
                        style={{ color: idea.btnColor }}
                    >
                        {idea.time.charAt(0).toUpperCase() + idea.time.slice(1)} routine
                    </Text>
                    <Text className="text-2xl font-bold text-slate-800"
                        style={{ letterSpacing: -0.3 }}
                    >
                        {idea.title}
                    </Text>
                </View>
            </View>

            {/* ── Scrollable Body ── */}
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* ── Time Card (From / To) ── */}
                <View className="bg-white rounded-3xl mb-3 overflow-hidden">
                    {/* From row */}
                    <View className="flex-row items-center justify-between px-4 py-3.5">
                        <View className="flex-row items-center">
                            <View
                                className="h-2 w-2 rounded-full mr-3"
                                style={{ backgroundColor: idea.btnColor }}
                            />
                            <Text className="text-base font-medium text-slate-800">From</Text>
                        </View>
                        <Text className="text-base font-semibold text-slate-500">
                            {fmt(Number(startTime.hour), Number(startTime.minute), startTime.period)}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View className="mx-4 h-[1px] bg-slate-100" />

                    {/* To row */}
                    <View className="flex-row items-center justify-between px-4 py-3.5">
                        <View className="flex-row items-center">
                            <View className="h-2 w-2 rounded-full bg-slate-300 mr-3" />
                            <Text className="text-base font-medium text-slate-800">To</Text>
                        </View>
                        <Text className="text-base font-semibold text-slate-500">
                            {fmt(endHour12, endM, endPeriod)}
                        </Text>
                    </View>
                </View>

                {/* ── Duration Card (Chip Selector) ── */}
                <View className="bg-white rounded-3xl px-4 py-4 mb-3">
                    <Text className="text-sm font-semibold text-slate-400 mb-3">
                        Duration
                    </Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8 }}
                    >
                        {DURATION_OPTIONS.map((opt) => {
                            const active = duration === opt.value;
                            return (
                                <Pressable
                                    key={opt.value}
                                    onPress={() => setDuration(opt.value)}
                                    className="px-4 py-2 rounded-full"
                                    style={{
                                        backgroundColor: active ? idea.color : colors.slate[100],
                                    }}
                                >
                                    <Text
                                        className="text-sm font-bold"
                                        style={{ color: active ? darkColor : colors.slate[400] }}
                                    >
                                        {opt.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* ── Days Card ── */}
                <View className="bg-white rounded-3xl px-4 py-4 mb-3">
                    <Text className="text-sm font-semibold text-slate-400 mb-3">
                        On these days
                    </Text>
                    <View className="flex-row justify-between">
                        {WEEKDAYS.map((day, i) => {
                            const active = selectedDays.includes(day);
                            return (
                                <Pressable
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className="h-10 w-10 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: active ? idea.color : colors.slate[100],
                                    }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{ color: active ? darkColor : colors.slate[300] }}
                                    >
                                        {DAY_LETTERS[i]}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* ── Apps Blocked Card ── */}
                <View className="bg-white rounded-3xl mb-3 overflow-hidden">
                    <Pressable className="flex-row items-center justify-between px-4 py-3.5 active:opacity-80">
                        <Text className="text-base font-medium text-slate-800">
                            Apps blocked
                        </Text>
                        <View className="flex-row items-center">
                            <View
                                className="h-2.5 w-2.5 rounded-full mr-2"
                                style={{ backgroundColor: idea.btnColor }}
                            />
                            <Text className="text-base font-semibold text-slate-500">
                                Block List
                            </Text>
                            <View className="ml-1">
                                <ChevronRight size={16} color={colors.slate[300]} />
                            </View>
                        </View>
                    </Pressable>
                </View>
                {/* ── CTA ── */}
                <View className="pt-4">
                    <Pressable
                        onPress={onClose}
                        className="items-center rounded-2xl py-4 border-b-[5px] active:opacity-90"
                        style={{
                            backgroundColor: idea.btnColor,
                            borderBottomColor: idea.btnBorder,
                        }}
                    >
                        <Text className="text-lg font-bold text-white">
                            Set routine
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
