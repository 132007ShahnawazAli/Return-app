import React from 'react';
import { View } from 'react-native';

interface Props {
    total: number;
    current: number;
}

export function ProgressBar({ total, current }: Props) {
    return (
        <View className="flex-row items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <View
                    key={i}
                    className={`h-1 w-10 rounded-full ${i <= current ? 'bg-sky-500' : 'bg-slate-300'
                        }`}
                />
            ))}
        </View>
    );
}
