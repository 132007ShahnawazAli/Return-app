import { colors } from '@/src/constants/colors';
import { WEEKDAYS } from '@/src/constants/weekdays';
import React, { useCallback, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';



interface AddBlockSheetProps {
    onAdd: () => void;
}

export function AddBlockSheet({ onAdd }: AddBlockSheetProps) {
    const [blockName, setBlockName] = useState('');
    const [time, setTime] = useState({ hour: '09', minute: '00', period: 'AM' });
    const [days, setDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);

    const toggleDay = useCallback((day: string) => {
        setDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    }, []);

    return (
        <View className="flex-1 pt-1">
            {/* ── Title ── */}
            <Text className="text-3xl font-semibold text-slate-800 mb-6">
                Add block
            </Text>

            {/* ── Block Name ── */}
            <View className="mb-6">
                <Text className="text-sm font-semibold text-slate-500 mb-2 px-1">
                    Block name
                </Text>
                <TextInput
                    value={blockName}
                    onChangeText={setBlockName}
                    placeholder="e.g. Daily focus"
                    placeholderTextColor={colors.slate[400]}
                    className="rounded-2xl bg-slate-100 px-4 text-base text-slate-800"
                    style={{ paddingVertical: 14 }}
                />
            </View>

            {/* ── Start Time ── */}
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4 px-1">
                    <Text className="text-sm font-semibold text-slate-500">
                        Start time
                    </Text>
                    <View className="flex-row bg-slate-100 rounded-full p-1">
                        {['AM', 'PM'].map(p => {
                            const active = time.period === p;
                            return (
                                <Pressable
                                    key={p}
                                    onPress={() => setTime(s => ({ ...s, period: p }))}
                                    className={`px-4 py-1.5 rounded-full ${active ? 'bg-sky-300' : ''}`}
                                >
                                    <Text
                                        className="text-xs font-semibold"
                                        style={{ color: active ? colors.sky[700] : colors.slate[400] }}
                                    >
                                        {p}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                <View className="flex-row items-center justify-around bg-slate-100 rounded-3xl" style={{ paddingVertical: 16 }}>
                    {/* Hour */}
                    <View className="items-center">
                        <Pressable className="p-2" onPress={() => setTime(s => ({ ...s, hour: String(Math.min(12, Number(s.hour) + 1)).padStart(2, '0') }))}>
                            <Text className="text-sm text-slate-400">▲</Text>
                        </Pressable>
                        <Text className="text-4xl font-semibold text-slate-800">{time.hour}</Text>
                        <Pressable className="p-2" onPress={() => setTime(s => ({ ...s, hour: String(Math.max(1, Number(s.hour) - 1)).padStart(2, '0') }))}>
                            <Text className="text-sm text-slate-400">▼</Text>
                        </Pressable>
                    </View>

                    <Text className="text-4xl font-semibold text-slate-600">:</Text>

                    {/* Minute */}
                    <View className="items-center">
                        <Pressable className="p-2" onPress={() => setTime(s => ({ ...s, minute: String(Math.min(55, Number(s.minute) + 5)).padStart(2, '0') }))}>
                            <Text className="text-sm text-slate-400">▲</Text>
                        </Pressable>
                        <Text className="text-4xl font-semibold text-slate-800">{time.minute}</Text>
                        <Pressable className="p-2" onPress={() => setTime(s => ({ ...s, minute: String(Math.max(0, Number(s.minute) - 5)).padStart(2, '0') }))}>
                            <Text className="text-sm text-slate-400">▼</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* ── Repeat Cycle ── */}
            <View className="mb-6">
                <Text className="text-sm font-semibold text-slate-500 mb-4 px-1">
                    Repeat cycle
                </Text>
                <View className="flex-row justify-between">
                    {WEEKDAYS.map((day) => {
                        const active = days.includes(day);
                        return (
                            <Pressable
                                key={day}
                                onPress={() => toggleDay(day)}
                                className={`h-11 w-11 items-center justify-center rounded-full ${active ? 'bg-sky-300' : 'bg-slate-50'}`}
                            >
                                <Text
                                    className="text-xs font-bold"
                                    style={{ color: active ? colors.sky[700] : colors.slate[300] }}
                                >
                                    {day.charAt(0)}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            {/* ── CTA ── */}
            <View className="mt-auto pt-4">
                <Pressable
                    onPress={onAdd}
                    className="items-center rounded-2xl py-4 bg-sky-400 border-b-[5px] border-sky-500 active:opacity-90"
                >
                    <Text className="text-xl font-semibold text-slate-50">
                        Add to routine
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
