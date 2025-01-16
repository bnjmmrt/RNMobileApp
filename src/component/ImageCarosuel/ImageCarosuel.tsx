import React, { useState, useRef } from 'react';
import { View, FlatList, Image, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import IMAGES from '../../assets/images';

interface ImageItem {
    id: string;
    uri: any;
}


const ImageCarousel: React.FC = ({ }) => {
    const images = [
        { id: '1', uri: IMAGES.frame1 },
        { id: '2', uri: IMAGES.frame2 },
        { id: '3', uri: IMAGES.frame3 },
        { id: '4', uri: IMAGES.frame4 },
    ];


    const [currentIndex, setIndex] = useState<number>(0);
    const flatListRef = useRef<FlatList<ImageItem>>(null);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / Wp(80));
        setIndex(newIndex);
    };

    const scrollToIndex = (index: number): void => {
        flatListRef.current?.scrollToOffset({
            offset: index * Wp(80),
            animated: true,
        });
    };

    return (
        <View style={{ flexDirection: 'column', }}>
            <View style={styles.container}>
                {/* FlatList for Scrollable Images */}
                <FlatList
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    ref={flatListRef}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Image source={item.uri} style={styles.image} />
                    )}
                />
            </View>
            {/* Animated Dots Carousel */}
            <View style={styles.carouselContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Wp(80),
        // paddingVertical: 20,
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
    },
    dotsContainer: {
        alignItems: 'center',
        borderRadius: 15,
        height: 20,
        justifyContent: 'center',
        paddingHorizontal: 15,
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
    },
    inactiveDot: {
        backgroundColor: COLORS.borderGray,
        width: 6,
        height: 6,
        opacity: 0.5
    },
});

export default ImageCarousel;
