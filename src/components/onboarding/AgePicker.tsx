import { colors } from '@/src/constants/colors';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    interpolateColor,
    runOnJS,
    SharedValue,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

// ITEM_HEIGHT impacts the snap behavior and highlight alignment
const ITEM_HEIGHT = 80; // Sleeker, more compact height like standard pickers
const VISIBLE_ITEMS = 5;
const PADDING_ITEMS = Math.floor(VISIBLE_ITEMS / 2);

interface Props {
    min: number;
    max: number;
    value: number;
    onChange: (val: number) => void;
}

export function AgePicker({ min, max, value, onChange }: Props) {
    // Generate data from min to max.
    const baseData = Array.from({ length: max - min + 1 }).map((_, i) => min + i);

    // To create an infinite feel, we repeat the array many times.
    const REPEAT_COUNT = 30; // 30 is perfectly safe for memory, but allows infinite feel
    const itemsList = Array(REPEAT_COUNT).fill(baseData).flat();

    // Inject empty items for true native snapping accuracy without paddingVertical bugs!
    const data = [
        ...Array(PADDING_ITEMS).fill(-1),
        ...itemsList,
        ...Array(PADDING_ITEMS).fill(-1),
    ];

    // We store the current scroll position to animate the items
    const scrollY = useSharedValue(0);

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const triggerHaptic = () => {
        Haptics.selectionAsync();
    };

    // Provide tactile haptic feedback on every "tick" as it rolls through an item
    useAnimatedReaction(
        () => Math.round(scrollY.value / ITEM_HEIGHT),
        (currentIndex, previousIndex) => {
            if (currentIndex !== previousIndex && previousIndex !== null) {
                runOnJS(triggerHaptic)();
            }
        }
    );

    const onMomentumScrollEnd = useCallback(
        (event: any) => {
            // The item perfectly centered has an internal index shifted by PADDING_ITEMS
            const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT) + PADDING_ITEMS;

            if (data[index] !== undefined && data[index] !== -1) {
                onChange(data[index]);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
        },
        [onChange, data]
    );

    // Initial scroll index in the middle of our massive array to allow scrolling back and forth infinitely
    const middleChunkStart = Math.floor(REPEAT_COUNT / 2) * baseData.length;
    const targetInternalIndex = middleChunkStart + baseData.findIndex((d) => d === value);
    const topIndex = targetInternalIndex; // Since the flatlist is not padded with contentContainerStyle, topIndex maps exactly.

    const flatListRef = useRef<Animated.FlatList<number>>(null);

    return (
        <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, justifyContent: 'center', marginVertical: 32 }}>
            {/* Absolute Highlight Box in the Center */}
            <View
                className="absolute w-full rounded-[24px] bg-sky-300"
                style={{
                    height: ITEM_HEIGHT,
                    top: ITEM_HEIGHT * PADDING_ITEMS,
                }}
            />

            <Animated.FlatList
                ref={flatListRef}
                data={data}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                // REMOVED `decelerationRate="fast"` because it breaks Android ScrollView snap physics!
                // REMOVED `snapToAlignment="start"` to let it inherently center the interval
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onMomentumScrollEnd={onMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                })}
                initialScrollIndex={Math.max(0, topIndex)}
                renderItem={({ item, index }) => {
                    if (item === -1) {
                        return <View style={{ height: ITEM_HEIGHT }} />;
                    }

                    return (
                        <AgePickerItem
                            item={item}
                            index={index}
                            scrollY={scrollY}
                            itemHeight={ITEM_HEIGHT}
                        />
                    );
                }}
            />
        </View>
    );
}

const AnimatedText = Animated.Text;

function AgePickerItem({
    item,
    index,
    scrollY,
    itemHeight,
}: {
    item: number;
    index: number;
    scrollY: SharedValue<number>;
    itemHeight: number;
}) {
    // Item's actual position in the un-padded flat list
    const itemPosition = index * itemHeight;

    const animatedStyle = useAnimatedStyle(() => {
        // Distance of this item from the current center of the viewport
        const centerOfViewport = scrollY.value + (itemHeight * PADDING_ITEMS);
        const distanceFromCenter = Math.abs(centerOfViewport - itemPosition);

        // Actual position relative to viewport center (negative = above, positive = below)
        const offsetFromCenter = itemPosition - centerOfViewport;

        // Map distance to scale
        const scale = interpolate(
            distanceFromCenter,
            [0, itemHeight, itemHeight * 2],
            [1.15, 0.85, 0.65],
            Extrapolation.CLAMP
        );

        // Use a dynamic translation to tightly squeeze ONLY the far-outer elements inwards!
        // We push them towards the center to close the gap organically.
        const translateY = interpolate(
            offsetFromCenter,
            [-itemHeight * 2, -itemHeight, 0, itemHeight, itemHeight * 2],
            [35, 15, 0, -15, -35], // Pull far outer bounds inward toward center nicely
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            distanceFromCenter,
            [0, itemHeight, itemHeight * 2],
            [1, 0.5, 0.25],
            Extrapolation.CLAMP
        );

        // At center (0 distance), text color is bold sky-800. 
        // Noticeably different color when not selected (slate-600 / slate-400).
        const color = interpolateColor(
            distanceFromCenter,
            [0, itemHeight, itemHeight * 2],
            [colors.sky[800], colors.slate[600], colors.slate[400]]
        );

        return {
            transform: [
                { scale },
                { translateY }
            ],
            opacity,
            color,
        };
    });

    return (
        <View style={{ height: itemHeight, justifyContent: 'center', alignItems: 'center' }}>
            <AnimatedText
                className="font-extrabold tracking-tight"
                style={[
                    {
                        // Set text exactly into the center of the bounding box flex natively
                        fontSize: 48,
                        textAlignVertical: 'center',
                        includeFontPadding: false
                    },
                    animatedStyle
                ]}
            >
                {item}
            </AnimatedText>
        </View>
    );
}
