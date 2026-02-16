import { colors } from '@/src/constants/colors';
import React, { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

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
    const [startTime, setStartTime] = useState(() => {
        const [time, period] = idea.subtitle.split(' ');
        const [hour, minute] = time.split(':');
        return {
            hour: hour.padStart(2, '0'),
            minute: minute.padStart(2, '0'),
            period
        };
    });
    const [selectedDays, setSelectedDays] = useState<string[]>(idea.defaultDays);

    const toggleDay = useCallback((day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }, []);

    // Helper to get dark version of idea color for text
    const getDarkColor = (color: string) => {
        // Simple mapping based on known idea colors
        if (color === colors.sky[300]) return colors.sky[700];
        if (color === colors.amber[300]) return colors.amber[700];
        if (color === colors.emerald[300]) return colors.emerald[700];
        return colors.slate[700];
    };

    const darkColor = getDarkColor(idea.color);

    return (
        <View className="flex-1 pt-1">
            {/* ── Header ── */}
            <View className="flex-row items-center mb-7">
                <View
                    className="w-20 h-20 items-center justify-center rounded-3xl"
                    style={{ backgroundColor: idea.lightColor }}
                >
                    <idea.Illustration width={54} height={54} />
                </View>
                <View className="ml-5">
                    <Text className="text-sm font-semibold mb-1" style={{ color: idea.btnColor }}>
                        {idea.time.charAt(0).toUpperCase() + idea.time.slice(1)} routine
                    </Text>
                    <Text className="text-3xl font-semibold text-slate-800">
                        {idea.title}
                    </Text>
                </View>
            </View>

            {/* ── Settings Row ── */}
            <View className="flex-col gap-6">
                {/* ── Start Time ── */}
                <View>
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text className="text-sm font-semibold text-slate-500">
                            Start time
                        </Text>
                        <View className="flex-row bg-slate-100 rounded-full p-1">
                            {['AM', 'PM'].map(p => {
                                const active = startTime.period === p;
                                return (
                                    <Pressable
                                        key={p}
                                        onPress={() => setStartTime(s => ({ ...s, period: p }))}
                                        className={`px-4 py-1.5 rounded-full ${active ? '' : ''}`}
                                        style={active ? { backgroundColor: idea.color } : {}}
                                    >
                                        <Text
                                            className="text-xs font-semibold"
                                            style={{ color: active ? darkColor : colors.slate[400] }}
                                        >
                                            {p}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <View className="flex-row items-center justify-around bg-slate-100 rounded-[32px]" style={{ paddingVertical: 16 }}>
                        {/* Hour */}
                        <View className="items-center">
                            <Pressable className="p-2" onPress={() => setStartTime(s => ({ ...s, hour: String(Math.min(12, Number(s.hour) + 1)).padStart(2, '0') }))}>
                                <Text className="text-sm text-slate-400">▲</Text>
                            </Pressable>
                            <Text className="text-4xl font-semibold text-slate-800">{startTime.hour}</Text>
                            <Pressable className="p-2" onPress={() => setStartTime(s => ({ ...s, hour: String(Math.max(1, Number(s.hour) - 1)).padStart(2, '0') }))}>
                                <Text className="text-sm text-slate-400">▼</Text>
                            </Pressable>
                        </View>

                        <Text className="text-4xl font-semibold text-slate-600">:</Text>

                        {/* Minute */}
                        <View className="items-center">
                            <Pressable className="p-2" onPress={() => setStartTime(s => ({ ...s, minute: String(Math.min(55, Number(s.minute) + 5)).padStart(2, '0') }))}>
                                <Text className="text-sm text-slate-400">▲</Text>
                            </Pressable>
                            <Text className="text-4xl font-semibold text-slate-800">{startTime.minute}</Text>
                            <Pressable className="p-2" onPress={() => setStartTime(s => ({ ...s, minute: String(Math.max(0, Number(s.minute) - 5)).padStart(2, '0') }))}>
                                <Text className="text-sm text-slate-400">▼</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* ── Repeat Cycle ── */}
                <View>
                    <Text className="text-sm font-semibold text-slate-500 mb-4 px-1">
                        Repeat cycle
                    </Text>
                    <View className="flex-row justify-between">
                        {WEEKDAYS.map((day) => {
                            const active = selectedDays.includes(day);
                            return (
                                <Pressable
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className="h-11 w-11 items-center justify-center rounded-full"
                                    style={{
                                        backgroundColor: active ? idea.color : colors.slate[50],
                                    }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{ color: active ? darkColor : colors.slate[300] }}
                                    >
                                        {day.charAt(0)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* ── CTA ── */}
            <View className="mt-auto pt-6">
                <Pressable
                    onPress={onClose}
                    className="items-center rounded-2xl py-4 border-b-[5px] active:opacity-90"
                    style={{
                        backgroundColor: idea.btnColor,
                        borderBottomColor: idea.btnBorder,
                    }}
                >
                    <Text className="text-xl font-semibold text-slate-50">
                        Set routine
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
