import { colors } from '@/src/constants/colors';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Calendar } from '../icons/Calendar';
import { ChevronRight } from '../icons/ChevronRight';
import { Hourglass } from '../icons/Hourglass';
import { Lock } from '../icons/Lock';
import { Play } from '../icons/Play';

interface AddSelectionSheetProps {
    onSelectBlockNow: () => void;
    onSelectCreateSchedule: () => void;
    onSelectSetTimeLimit: () => void;
    onSelectSetOpenLimit: () => void;
}

export function AddSelectionSheet({
    onSelectBlockNow,
    onSelectCreateSchedule,
    onSelectSetTimeLimit,
    onSelectSetOpenLimit,
}: AddSelectionSheetProps) {
    return (
        <View className="flex-1 pt-1">

            {/* ── Sheet Title ── */}
            <Text className="text-2xl font-bold text-slate-800 mb-5"
                style={{ letterSpacing: -0.4 }}
            >
                Add Block
            </Text>

            {/* ── FOCUS SESSION ── */}
            <Text className="text-sm font-semibold text-slate-400 mb-2.5 px-0.5">
                Focus session
            </Text>

            <View className="gap-2.5 mb-5">
                <OptionItem
                    icon={<Play size={20} color={colors.pink[500]} />}
                    iconBg="bg-pink-200"
                    title="Block Now"
                    subtitle="I'm ready for a focus timer"
                    onPress={onSelectBlockNow}
                />
                <OptionItem
                    icon={<Calendar size={20} color={colors.sky[500]} />}
                    iconBg="bg-sky-200"
                    title="Create Schedule"
                    subtitle="e.g. Work Hours 9am to 5pm"
                    onPress={onSelectCreateSchedule}
                />
            </View>

            {/* ── APP LIMITS ── */}
            <Text className="text-sm font-semibold text-slate-400 mb-2.5 px-0.5">
                App limits
            </Text>

            <View className="gap-2.5">
                <OptionItem
                    icon={<Hourglass size={20} color={colors.lime[600]} />}
                    iconBg="bg-lime-200"
                    title="Set Time Limit"
                    subtitle="e.g. 30 min per day"
                    onPress={onSelectSetTimeLimit}
                />
                <OptionItem
                    icon={<Lock size={20} color={colors.yellow[600]} />}
                    iconBg="bg-yellow-200"
                    title="Set Open Limit"
                    subtitle="e.g. 5 opens per day"
                    onPress={onSelectSetOpenLimit}
                />
            </View>

        </View>
    );
}

// ─── OptionItem ────────────────────────────────────────────────────────────────

interface OptionItemProps {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}

function OptionItem({ icon, iconBg, title, subtitle, onPress }: OptionItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center rounded-3xl bg-white px-3 py-3 active:opacity-80"
        >
            {/* Icon bubble */}
            <View className={`h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
                {icon}
            </View>

            {/* Labels */}
            <View className="flex-1 ml-3.5">
                <Text className="text-base font-semibold text-slate-800">
                    {title}
                </Text>
                <Text className="text-[13px] font-normal text-slate-400 mt-0.5">
                    {subtitle}
                </Text>
            </View>

            {/* Disclosure chevron */}
            <ChevronRight size={18} color={colors.slate[500]} />
        </Pressable>
    );
}
