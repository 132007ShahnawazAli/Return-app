import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SelectOption {
    label: string;
    subtitle?: string;
    value: string;
}

interface Props {
    options: SelectOption[];
    selected: string | null;
    onSelect: (value: string) => void;
}

export function SelectList({ options, selected, onSelect }: Props) {
    return (
        <View className="flex-col gap-3 overflow-visible px-1">
            {options.map((option) => {
                const isActive = selected === option.value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => onSelect(option.value)}
                        activeOpacity={0.7}
                        className={`flex-row items-center justify-between rounded-2xl px-6 py-5 shadow-md shadow-slate-400 ${isActive
                            ? ' bg-sky-300'
                            : ' bg-slate-50'
                            }`}
                    >
                        <View className="flex-1 flex-col">
                            <Text
                                className={`text-xl font-medium ${isActive ? 'text-sky-800' : 'text-slate-700'
                                    }`}
                            >
                                {option.label}
                            </Text>
                            {option.subtitle ? (
                                <Text
                                    className={`mt-0.5 font-medium text-sm ${isActive ? 'text-sky-800 opacity-65' : 'text-slate-400'
                                        }`}
                                >
                                    {option.subtitle}
                                </Text>
                            ) : null}
                        </View>

                        {/* {isActive && (
                            <View className="ml-3 h-6 w-6 items-center justify-center rounded-full bg-sky-500">
                                <Text className="text-xs font-bold text-slate-50">✓</Text>
                            </View>
                        )} */}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
