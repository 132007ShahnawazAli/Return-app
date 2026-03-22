import { colors } from '@/src/constants/colors';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { ArrowLeft } from '../icons/ArrowLeft';
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

interface AddBlockSheetProps {
    onAdd: () => void;
    onBack?: () => void;
}

export function AddBlockSheet({ onAdd, onBack }: AddBlockSheetProps) {
    const [blockName, setBlockName] = useState('');
    const [fromTime, setFromTime] = useState({ hour: '09', minute: '00', period: 'AM' });
    const [toTime, setToTime] = useState({ hour: '05', minute: '00', period: 'PM' });
    const [days, setDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const [duration, setDuration] = useState(60);

    const toggleDay = useCallback((day: string) => {
        setDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }, []);

    const formatTime = (t: { hour: string; minute: string; period: string }) =>
        `${t.hour}:${t.minute} ${t.period}`;

    return (
        <View className="flex-1 pt-1">
            {/* ── Header ── */}
            <View className="flex-row items-center mb-5">
                {onBack && (
                    <Pressable
                        onPress={onBack}
                        className="h-10 w-10 items-center justify-center rounded-full bg-white mr-3"
                    >
                        <ArrowLeft size={18} color={colors.slate[600]} />
                    </Pressable>
                )}
                <Text className="text-2xl font-bold text-slate-800"
                    style={{ letterSpacing: -0.4 }}
                >
                    Create schedule
                </Text>
            </View>

            {/* ── Scrollable Body ── */}
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {/* ── Block Name Card ── */}
                <View className="bg-white rounded-3xl px-4 py-3.5 mb-3">
                    <TextInput
                        value={blockName}
                        onChangeText={setBlockName}
                        placeholder="Block name  e.g. Gym Time"
                        placeholderTextColor={colors.slate[300]}
                        className="text-base font-medium text-slate-800"
                        style={{ padding: 0 }}
                    />
                </View>

                {/* ── Time Card (From / To) ── */}
                <View className="bg-white rounded-3xl mb-3 overflow-hidden">
                    {/* From row */}
                    <View className="flex-row items-center justify-between px-4 py-3.5">
                        <View className="flex-row items-center">
                            <View className="h-2 w-2 rounded-full bg-sky-400 mr-3" />
                            <Text className="text-base font-medium text-slate-800">From</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-base font-semibold text-slate-500">
                                {formatTime(fromTime)}
                            </Text>
                            <View className="ml-1.5">
                                <ChevronRight size={16} color={colors.slate[300]} />
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View className="mx-4 h-[1px] bg-slate-100" />

                    {/* To row */}
                    <View className="flex-row items-center justify-between px-4 py-3.5">
                        <View className="flex-row items-center">
                            <View className="h-2 w-2 rounded-full bg-slate-300 mr-3" />
                            <Text className="text-base font-medium text-slate-800">To</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-base font-semibold text-slate-500">
                                {formatTime(toTime)}
                            </Text>
                            <View className="ml-1.5">
                                <ChevronRight size={16} color={colors.slate[300]} />
                            </View>
                        </View>
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
                                    className={`px-4 py-2 rounded-full ${active ? 'bg-sky-300' : 'bg-slate-100'}`}
                                >
                                    <Text
                                        className="text-sm font-bold"
                                        style={{ color: active ? colors.sky[700] : colors.slate[400] }}
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
                            const active = days.includes(day);
                            return (
                                <Pressable
                                    key={day}
                                    onPress={() => toggleDay(day)}
                                    className={`h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-sky-300' : 'bg-slate-100'}`}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{ color: active ? colors.sky[700] : colors.slate[300] }}
                                    >
                                        {DAY_LETTERS[i]}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* ── Apps Blocked + Breaks ── */}
                <View className="bg-white rounded-3xl mb-3 overflow-hidden">
                    {/* Apps Blocked row */}
                    <Pressable className="flex-row items-center justify-between px-4 py-3.5 active:opacity-80">
                        <Text className="text-base font-medium text-slate-800">
                            Apps blocked
                        </Text>
                        <View className="flex-row items-center">
                            <View className="h-2.5 w-2.5 rounded-full bg-pink-400 mr-2" />
                            <Text className="text-base font-semibold text-slate-500">
                                Block List
                            </Text>
                            <View className="ml-1">
                                <ChevronRight size={16} color={colors.slate[300]} />
                            </View>
                        </View>
                    </Pressable>

                    {/* Divider */}
                    <View className="mx-4 h-[1px] bg-slate-100" />

                    {/* Breaks Allowed row */}
                    <Pressable className="flex-row items-center justify-between px-4 py-3.5 active:opacity-80">
                        <Text className="text-base font-medium text-slate-800">
                            Breaks allowed
                        </Text>
                        <View className="flex-row items-center">
                            <View className="h-2.5 w-2.5 rounded-full border-2 border-sky-300 mr-2" />
                            <Text className="text-base font-semibold text-slate-500">
                                Yes
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
                        onPress={onAdd}
                        className="items-center rounded-2xl py-4 bg-sky-400 border-b-[5px] border-sky-500 active:opacity-90"
                    >
                        <Text className="text-lg font-bold text-white">
                            Save
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
