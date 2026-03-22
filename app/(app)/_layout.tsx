import { BarChart } from '@/src/components/icons/BarChart';
import { Home } from '@/src/components/icons/Home';
import { Settings } from '@/src/components/icons/Settings';
import { colors } from '@/src/constants/colors';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONFIG = [
    { name: 'index', title: 'Home', Icon: Home },
    { name: 'activity', title: 'Activity', Icon: BarChart },
    { name: 'settings', title: 'Settings', Icon: Settings },
] as const;

const SPRING_CONFIG = { damping: 18, stiffness: 200, mass: 0.6 };

function TabItem({ isFocused, Icon, title, onPress, routeKey }: {
    isFocused: boolean;
    Icon: (typeof TAB_CONFIG)[number]['Icon'];
    title: string;
    onPress: () => void;
    routeKey: string;
}) {
    const scale = useSharedValue(isFocused ? 1 : 0.92);
    const labelOpacity = useSharedValue(isFocused ? 1 : 0);
    const labelTranslateY = useSharedValue(isFocused ? 0 : 6);

    useEffect(() => {
        scale.value = withSpring(isFocused ? 1 : 0.92, SPRING_CONFIG);
        labelOpacity.value = withSpring(isFocused ? 1 : 0, SPRING_CONFIG);
        labelTranslateY.value = withSpring(isFocused ? 0 : 6, SPRING_CONFIG);
    }, [isFocused]);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const labelStyle = useAnimatedStyle(() => ({
        opacity: labelOpacity.value,
        transform: [{ translateY: labelTranslateY.value }],
    }));

    return (
        <Pressable
            key={routeKey}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            className="items-center justify-center"
            style={{ flex: 1, paddingVertical: 8 }}
        >
            <Animated.View style={iconStyle}>
                <Icon
                    size={24}
                    color={isFocused ? colors.sky[500] : colors.slate[400]}
                />
            </Animated.View>
            <Animated.Text
                className="font-semibold"
                style={[
                    {
                        fontSize: 11,
                        color: colors.sky[600],
                        marginTop: 3,
                    },
                    labelStyle,
                ]}
            >
                {title}
            </Animated.Text>
        </Pressable>
    );
}

function CustomTabBar({ state, navigation }: any) {
    const insets = useSafeAreaInsets();
    const bottomPadding = Math.max(insets.bottom, 8);

    return (
        <View
            style={{
                backgroundColor: colors.base.white,
                paddingBottom: bottomPadding,
                paddingTop: 8,
                paddingHorizontal: 16,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                ...Platform.select({
                    ios: {
                        shadowColor: colors.slate[300],
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                    },
                    android: {
                        elevation: 8,
                    },
                }),
            }}
        >
            <View className="flex-row items-center justify-around">
                {state.routes.map((route: any, index: number) => {
                    const tabConfig = TAB_CONFIG.find(t => t.name === route.name);
                    if (!tabConfig) return null;

                    const { Icon, title } = tabConfig;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TabItem
                            key={route.key}
                            routeKey={route.key}
                            isFocused={isFocused}
                            Icon={Icon}
                            title={title}
                            onPress={onPress}
                        />
                    );
                })}
            </View>
        </View>
    );
}

export default function AppLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="activity" />
            <Tabs.Screen name="settings" />
        </Tabs>
    );
}
