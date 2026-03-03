import React from 'react';
import { View } from 'react-native';

interface Props {
    total: number;
    current: number;
}

export function ProgressBar({ total, current }: Props) {
    // Calculate percentage (0 to 100)
    // We want the first step (current=0) to show some progress, and the last step (current=total-1) to be 100%
    const progressPercentage = Math.max(5, Math.min(100, ((current + 1) / total) * 100));

    return (
        <View className="h-1.5 w-[160px] bg-slate-300 rounded-full overflow-hidden">
            <View
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
            />
        </View>
    );
}
