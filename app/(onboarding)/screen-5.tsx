import { Cart } from '@/src/components/icons/Cart';
import { GamingController } from '@/src/components/icons/GamingController';
import { Megaphone } from '@/src/components/icons/Megaphone';
import { Message } from '@/src/components/icons/Message';
import { MobileScrolling } from '@/src/components/icons/MobileScrolling';
import { Settings } from '@/src/components/icons/Settings';
import { Work } from '@/src/components/icons/Work';
import { OnboardingShell } from '@/src/components/onboarding/OnboardingShell';
import { colors } from '@/src/constants/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const CATEGORIES = [
    { id: 'social', label: 'Social media Scrolling', Icon: MobileScrolling },
    { id: 'gaming', label: 'Gaming', Icon: GamingController },
    { id: 'news', label: 'News and Doomscrolling', Icon: Megaphone },
    { id: 'shopping', label: 'Shopping and browsing', Icon: Cart },
    { id: 'messaging', label: 'Messaging', Icon: Message },
    { id: 'work', label: 'Working apps', Icon: Work },
    { id: 'general', label: 'General overuse', Icon: Settings },
];

export default function ScreenTimeDisappearStep() {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <OnboardingShell
            step={4}
            totalSteps={7}
            question="Where does your time disappear?"
            canContinue={selectedIds.length > 0}
            onContinue={() => router.push('/(onboarding)/age')}
        >
            <View className="flex-1 justify-center items-center py-4">
                <View className="flex-row flex-wrap justify-center gap-x-3 gap-y-4">
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedIds.includes(cat.id);
                        return (
                            <Pressable
                                key={cat.id}
                                onPress={() => toggleSelection(cat.id)}
                                className={`flex-row items-center px-4 py-3 rounded-full ${isSelected ? 'bg-sky-300' : 'bg-slate-50'
                                    }`}
                            >
                                <View className="mr-2 justify-center items-center">
                                    <cat.Icon
                                        size={18}
                                        color={isSelected ? colors.sky[800] : colors.slate[600]}
                                    />
                                </View>
                                <Text
                                    className={`font-semibold text-lg ${isSelected ? 'text-sky-800' : 'text-slate-700'
                                        }`}
                                >
                                    {cat.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Text className="text-center text-slate-500 mt-10">
                    Please pick the most relatable categories.
                </Text>
            </View>
        </OnboardingShell>
    );
}
