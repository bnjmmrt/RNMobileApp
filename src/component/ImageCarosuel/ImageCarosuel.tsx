import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import IMAGES from '../../assets/images';

interface ImageItem {
    id: string;
    uri: any;
}

const ImageCarousel: React.FC = () => {
    const originalImages = [
        { id: '1', uri: IMAGES.frame1 },
        { id: '2', uri: IMAGES.frame2 },
        { id: '3', uri: IMAGES.frame3 },
        { id: '4', uri: IMAGES.frame4 },
    ];

    // Duplicate images for infinite scrolling
    const images = [
        originalImages[originalImages.length - 1], // Add last image at the beginning
        ...originalImages,
        originalImages[0], // Add first image at the end
    ];

    const [currentIndex, setIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList<ImageItem>>(null);

    const dotAnimation = useRef(new Animated.Value(0)).current;

    const scrollToIndex = (index: number, animated: boolean = true): void => {
        flatListRef.current?.scrollToOffset({
            offset: index * Wp(80),
            animated,
        });
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / Wp(80));
        setIndex(newIndex - 1); // Adjust index due to duplicated images

        // Animate the dots based on scroll position
        Animated.timing(dotAnimation, {
            toValue: newIndex - 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / Wp(80));

        // Loop to the beginning or end
        if (index === 0) {
            scrollToIndex(originalImages.length, false); // Jump to last real image
        } else if (index === images.length - 1) {
            scrollToIndex(1, false); // Jump to first real image
        }
    };

    useEffect(() => {
        // Initialize position to the first real image
        setTimeout(() => {
            scrollToIndex(1, false);
        }, 0);
    }, []);

    return (
        <View style={{ flexDirection: 'column' }}>
            <View style={styles.container}>
                {/* FlatList for Scrollable Images */}
                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    ref={flatListRef}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={({ item }) => (
                        <Image source={item.uri} style={styles.image} />
                    )}
                />
            </View>
            {/* Animated Dots Carousel */}
            <View style={styles.carouselContainer}>
                {originalImages.map((_, index) => {
                    const dotStyle = {
                        transform: [
                            {
                                scale: dotAnimation.interpolate({
                                    inputRange: [index - 1, index, index + 1],
                                    outputRange: [0.8, 1.2, 0.8],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    };
                    return (
                        <Animated.View
                            key={index}
                            style={[styles.dot, styles.inactiveDot, dotStyle, currentIndex === index && styles.activeDot]}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Wp(80),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.black,
        marginHorizontal: 30,
        borderRadius: 20,
    },
    image: {
        width: Wp(80),
        height: Hp(35),
        resizeMode: 'contain',
    },
    carouselContainer: {
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: Hp(1)
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
        width: 8,
        height: 8,
        opacity: 0.9,
    },
    inactiveDot: {
        backgroundColor: COLORS.borderGray,
        width: 6,
        height: 6,
        opacity: 0.5,
    },
});

export default ImageCarousel;
