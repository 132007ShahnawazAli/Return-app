// Home Screen

import BookSetSvg from '@/assets/illustrations/bookSet.svg';
import DinnerFoodSvg from '@/assets/illustrations/dinnerFood.svg';
import DumbellsSvg from '@/assets/illustrations/dumbells.svg';
import FocusPebbleSvg from '@/assets/illustrations/focusPebble.svg';
import ScreenTimeSvg from '@/assets/illustrations/screenTime.svg';
import { BottomSheet } from '@/src/components/BottomSheet';
import { ArrowLeft } from '@/src/components/icons/ArrowLeft';
import { ChevronRight } from '@/src/components/icons/ChevronRight';
import { Meditate } from '@/src/components/icons/Meditate';
import { Plus } from '@/src/components/icons/Plus';
import { Study } from '@/src/components/icons/Study';
import { Work } from '@/src/components/icons/Work';
import { AddBlockSheet } from '@/src/components/sheets/AddBlockSheet';
import { RoutineDetailSheet } from '@/src/components/sheets/RoutineDetailSheet';
import { colors } from '@/src/constants/colors';
import { useAuthStore } from '@/src/stores/auth-store';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

type IdeaKey = 'workout' | 'dinner' | 'study';

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

const IDEA_DATA: Record<IdeaKey, IdeaConfig> = {
    workout: {
        title: 'Workout Session',
        subtitle: '7:00 AM',
        time: 'morning',
        color: colors.sky[300],
        lightColor: colors.sky[100],
        btnColor: colors.sky[400],
        btnBorder: colors.sky[500],
        defaultDays: ['Mon', 'Wed', 'Fri'],
        defaultDuration: 45,
        Illustration: DumbellsSvg,
    },
    dinner: {
        title: 'Dinner Break',
        subtitle: '7:30 PM',
        time: 'evening',
        color: colors.amber[300],
        lightColor: colors.amber[100],
        btnColor: colors.amber[400],
        btnBorder: colors.amber[500],
        defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        defaultDuration: 30,
        Illustration: DinnerFoodSvg,
    },
    study: {
        title: 'Study Time',
        subtitle: '5:00 PM',
        time: 'afternoon',
        color: colors.emerald[300],
        lightColor: colors.emerald[100],
        btnColor: colors.emerald[400],
        btnBorder: colors.emerald[500],
        defaultDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        defaultDuration: 60,
        Illustration: BookSetSvg,
    },
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon …
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    return DAY_LABELS.map((label, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + mondayOffset + i);
        const dayNum = date.getDate();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        return { label, dayNum, isToday, isPast };
    });
}

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const signOut = useAuthStore((s) => s.signOut);
    const weekDays = useMemo(() => getWeekDays(), []);
    const [activeIdea, setActiveIdea] = useState<IdeaKey | null>(null);
    const idea = activeIdea ? IDEA_DATA[activeIdea] : null;

    const [showAddSheet, setShowAddSheet] = useState(false);

    const openIdea = useCallback((key: IdeaKey) => {
        setActiveIdea(key);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.replace('/(auth)/sign-in');
    };

    return (
        <View className="flex-1 bg-slate-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingHorizontal: 16,
                    paddingBottom: insets.bottom + 40
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Nav */}
                <View className="mb-5 flex-row items-center justify-between">
                    <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-white">
                        <ArrowLeft size={20} color={colors.slate[700]} />
                    </Pressable>
                    <Text className="text-lg font-bold text-slate-800">Logo</Text>
                    <View className="h-11 w-11 overflow-hidden rounded-full bg-slate-200">
                        <Image
                            source={{ uri: 'https://picsum.photos/seed/picsum/100/100' }}
                            className="h-full w-full"
                        />
                    </View>
                </View>


                {/* Week Strip */}
                <View className="mb-5 rounded-2xl py-4">
                    <View className="flex-row justify-between w-full">
                        {weekDays.map((day) => (
                            <View key={day.label} className="items-center flex-1">
                                <Text
                                    className={`text-md mb-2 ${day.isToday
                                        ? 'font-bold text-slate-800'
                                        : 'font-medium text-slate-400'
                                        }`}
                                >
                                    {day.label}
                                </Text>
                                <View
                                    className={`h-11 w-11 items-center justify-center rounded-full ${day.isToday
                                        ? 'bg-sky-300'
                                        : 'bg-white'
                                        }`}
                                >
                                    <Text
                                        className={`text-base font-semibold ${day.isToday
                                            ? 'text-sky-800'
                                            : 'text-slate-500'
                                            }`}
                                    >
                                        {day.dayNum}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Stat Cards */}
                <View className="mb-6 flex-row gap-3">
                    <View className="flex-1 rounded-[30px] bg-pink-300 p-5 overflow-hidden" style={{ minHeight: 180, flexBasis: 0 }}>
                        <Text className="text-3xl font-bold tracking-tighter text-pink-900">2h 43m</Text>
                        <Text className="text-sm font-medium text-pink-950 opacity-60">Screen Time</Text>
                        <View style={{ position: 'absolute', bottom: 7, right: 4 }}>
                            <ScreenTimeSvg width={100} height={88} />
                        </View>
                    </View>
                    <View className="flex-1 rounded-[30px] bg-sky-300 p-5 overflow-hidden" style={{ minHeight: 180, flexBasis: 0 }}>
                        <Text className="text-3xl font-bold tracking-tighter text-sky-900">87%</Text>
                        <Text className=" text-sm font-medium text-sky-950 opacity-60">Focus Score</Text>
                        <View style={{ position: 'absolute', bottom: 7, right: 14 }}>
                            <FocusPebbleSvg width={95} height={96} />
                        </View>
                    </View>
                </View>

                {/* Upcoming */}
                <Text className="mb-3 text-xl font-bold text-slate-800">Upcoming</Text>
                <View className="gap-3">
                    {/* Work Hours */}
                    <View className="flex-row justify-between items-center rounded-3xl bg-white px-3 py-3 gap-4">
                        <View className="flex p-4 items-center justify-center rounded-2xl bg-sky-200">
                            <Work size={24} color={colors.sky[500]} />
                        </View>
                        <View className="flex-col flex-1 justify-between">
                            <Text className="text-lg font-medium text-slate-700 ">Work Hours</Text>
                            <View className="flex-row items-center gap-2">
                                <View className="rounded-md bg-sky-200 px-2 py-0.5">
                                    <Text className="text-xs font-semibold text-sky-500">9:15 AM - 5 PM</Text>
                                </View>
                                <View className="rounded-md bg-sky-200 px-2 py-0.5">
                                    <Text className="text-xs font-semibold text-sky-500">Weekdays</Text>
                                </View>
                            </View>
                        </View>
                        <View className="pr-2">
                            <ChevronRight size={24} color={colors.slate[500]} />
                        </View>
                    </View>

                    {/* Study Session */}
                    <View className="flex-row justify-between items-center rounded-3xl bg-white px-3 py-3 gap-4">
                        <View className="flex p-4 items-center justify-center rounded-2xl bg-lime-200">
                            <Study size={24} color={colors.lime[500]} />
                        </View>
                        <View className="flex-col flex-1 justify-between">
                            <Text className="text-lg font-medium text-slate-700">Study Session</Text>
                            <View className="flex-row items-center gap-2">
                                <View className="rounded-md bg-lime-200 px-2 py-0.5">
                                    <Text className="text-xs font-semibold text-lime-500">6 PM - 10 PM</Text>
                                </View>
                                <View className="rounded-md bg-lime-200 px-2 py-0.5">
                                    <Text className="text-xs font-semibold text-lime-500">Daily</Text>
                                </View>
                            </View>
                        </View>
                        <View className="pr-2">
                            <ChevronRight size={24} color={colors.slate[500]} />
                        </View>
                    </View>

                    {/* Weekend Zen */}
                    <View className="flex-row justify-between items-center rounded-3xl bg-white px-3 py-3 gap-4">
                        <View className="flex p-4 items-center justify-center rounded-2xl bg-amber-200">
                            <Meditate size={24} color={colors.amber[500]} />
                        </View>
                        <View className="flex-col flex-1 justify-between">
                            <Text className="text-lg font-medium text-slate-700">Weekend Zen</Text>
                            <View className="flex-row items-center gap-2">
                                <View className="rounded-md bg-amber-200 px-2 py-0.5">
                                    <Text className="text-xs font-semibold text-amber-500">9:15 AM - 5 PM</Text>
                                </View>
                                <View className="rounded-md bg-amber-200 px-2 py-0.5">
                                    <Text className="text-xs font-semibold text-amber-500">Sat - Sun</Text>
                                </View>
                            </View>
                        </View>
                        <View className="pr-2">
                            <ChevronRight size={24} color={colors.slate[500]} />
                        </View>
                    </View>
                </View>

                {/* More Ideas */}
                <Text className="mt-4 mb-3 text-xl font-bold text-slate-800">More Ideas</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginLeft: -16, marginRight: -16 }}
                    contentContainerStyle={{ gap: 12, paddingLeft: 16, paddingRight: 16 }}
                >
                    {/* Workout Session */}
                    <Pressable onPress={() => openIdea('workout')} className="rounded-[30px] bg-sky-300 overflow-hidden" style={{ width: 160, height: 180 }}>
                        <View className="flex-row justify-between items-start p-4">
                            <Text className="text-lg leading-tight font-medium text-slate-800" style={{ maxWidth: 100 }}>Workout{"\n"}Session</Text>
                            <View className="h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                                <Plus size={18} color={colors.slate[700]} />
                            </View>
                        </View>
                        <View style={{ position: 'absolute', bottom: 3, left: 24 }}>
                            <DumbellsSvg />
                        </View>
                    </Pressable>

                    {/* Dinner Break */}
                    <Pressable onPress={() => openIdea('dinner')} className="rounded-[30px] bg-amber-300 overflow-hidden" style={{ width: 160, height: 180 }}>
                        <View className="flex-row justify-between items-start p-4">
                            <Text className="text-lg leading-tight font-medium text-slate-800" style={{ maxWidth: 100 }}>Dinner{"\n"}Break</Text>
                            <View className="h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                <Plus size={18} color={colors.slate[700]} />
                            </View>
                        </View>
                        <View style={{ position: 'absolute', bottom: 10, left: 20 }}>
                            <DinnerFoodSvg width={130} height={80} />
                        </View>
                    </Pressable>

                    {/* Study Time */}
                    <Pressable onPress={() => openIdea('study')} className="rounded-[30px] bg-emerald-300 overflow-hidden" style={{ width: 160, height: 180 }}>
                        <View className="flex-row justify-between items-start p-4">
                            <Text className="text-lg leading-tight font-medium text-slate-800" style={{ maxWidth: 100 }}>Study{"\n"}Time</Text>
                            <View className="h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                                <Plus size={18} color={colors.slate[700]} />
                            </View>
                        </View>
                        <View style={{ position: 'absolute', bottom: 9, left: 20 }}>
                            <BookSetSvg width={135} height={90} />
                        </View>
                    </Pressable>
                </ScrollView>

            </ScrollView>

            {/* Bottom Right FAB */}
            {activeIdea === null && !showAddSheet && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: insets.bottom + 24,
                        right: 24,
                    }}
                >
                    <Pressable
                        onPress={() => setShowAddSheet(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.sky[400],
                            paddingHorizontal: 20,
                            paddingVertical: 14,
                            borderRadius: 16,
                            borderBottomWidth: 4,
                            borderBottomColor: colors.sky[500],
                        }}
                    >
                        <Plus size={18} color="white" />
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 15,
                                fontWeight: '500',
                                marginLeft: 8,
                            }}
                        >
                            Add block
                        </Text>
                    </Pressable>
                </View>
            )}

            {/* Bottom Sheet */}
            <BottomSheet visible={activeIdea !== null} onClose={() => setActiveIdea(null)}>
                {idea && (
                    <RoutineDetailSheet idea={idea} onClose={() => setActiveIdea(null)} />
                )}
            </BottomSheet>

            {/* Add Block Sheet */}
            <BottomSheet visible={showAddSheet} onClose={() => setShowAddSheet(false)}>
                <AddBlockSheet onAdd={() => setShowAddSheet(false)} />
            </BottomSheet>
        </View>
    );
}
