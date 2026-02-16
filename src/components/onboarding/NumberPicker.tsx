import { Minus } from "@/src/components/icons/Minus";
import { Plus } from "@/src/components/icons/Plus";
import { colors } from '@/src/constants/colors';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
    value: number;
    min: number;
    max: number;
    unit?: string;
    onChange: (value: number) => void;
}

export function NumberPicker({ value, min, max, unit, onChange }: Props) {
    const decrease = () => {
        if (value > min) onChange(value - 1);
    };

    const increase = () => {
        if (value < max) onChange(value + 1);
    };

    return (
        <View className="flex-col items-center py-8">
            {/* −  Value  + */}
            <View className="flex-row items-center w-full justify-between">
                <TouchableOpacity
                    onPress={decrease}
                    disabled={value <= min}
                    activeOpacity={0.6}
                    className={`h-14 w-14 items-center justify-center bg-slate-100 rounded-full shadow-md shadow-slate-400`}
                >
                    <Minus size={20} color={colors.slate[600]} />
                </TouchableOpacity>

                <View className="items-center justify-center">
                    <Text className="text-9xl font-semibold -tracking-[9px] text-slate-700">
                        {value}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={increase}
                    disabled={value >= max}
                    activeOpacity={0.6}
                    className={`h-14 w-14 items-center justify-center bg-slate-100 rounded-full shadow-md shadow-slate-400`}
                >
                    <Plus size={20} color={colors.slate[600]} />
                </TouchableOpacity>
            </View>

            {/* Unit label */}
            {unit && (
                <Text className="mt-4 text-base text-slate-400">
                    {value} {unit}
                </Text>
            )}
        </View>
    );
}
