import IMAGES from '@images/index';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import { COLORS, LABLE } from 'src/utils/constants';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { fontScale, verticalMarginScale } from 'src/utils/dimensions';

const { width } = Dimensions.get('window');

const listData = [
  {
    id: 0,
    uri: IMAGES.frame1,
    title: LABLE.ACCESS_THE_MOST_VALUABLE_CALENDAR,
    subTitle: LABLE.DISCOVER_EXPERIENCES_IN_ART,
  },
  {
    id: 1,
    uri: IMAGES.frame2,
    title: LABLE.UNLOCK_ACCESS_TO_EXCLUSIVE_EVENTS,
    subTitle: LABLE.CONNECT_WITH_WORLD,
  },
  {
    id: 2,
    uri: IMAGES.frame3,
    title: LABLE.CHAT_WITH_HOST,
    subTitle: LABLE.CONNECT_DIRECTLY_WITH_PEOPLE,
  },
  {
    id: 3,
    uri: IMAGES.frame4,
    title: LABLE.STREAMLINE_YOUR_LIFESTYLE,
    subTitle: LABLE.MANAGE_YOUR_EVENTS,
  },
];

const CustomCarousel = ({ isChatScreen }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [current, setCurrent] = useState(
    isChatScreen ? listData[2] : listData[0],
  );

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const nextIndex = (activeIndex + 1) % listData.length;
//       setActiveIndex(nextIndex);
//       scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [activeIndex]);

  const handleScroll = (event: any) => {
  
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
    setCurrent(listData[index]);
  };

  const handlePress = () => {
    const nextIndex = (activeIndex + 1) % listData.length;
    scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    setActiveIndex(nextIndex);
    setCurrent(listData[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{}}
        style={{ marginBottom: 20 }}>
        {listData.map((item, index) => (
          <Pressable key={index} style={styles.slide}>
            <Image source={item.uri} style={styles.image} />
          </Pressable>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {listData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
      <TitleSubtitle
        style={styles.titleSubtitle}
        title={current.title}
        subTitle={current.subTitle}
        titleFontSize={fontScale(32)}
        subTitleMargin={verticalMarginScale(8)}
        centerTextAlign={true}
        isDarkTheme={true}
      />
    </View>
  );
};

export default CustomCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5
    // marginHorizontal:10
  },
  image: {
    // width: width * 0.9,
    // height: width * 0.9,
    width:329,
    height:329,
    borderRadius: 20,
    resizeMode: 'cover',
    marginTop:4
  },
  textContainer: {
    position: 'absolute',
    bottom: 80,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
  pagination: {
    flexDirection: 'row',
    bottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 25,
    bottom: 2,
  },
  inactiveDot: {
    backgroundColor: '#555',
    borderRadius: 25,
  },
  titleSubtitle: {
    position: 'relative',
    paddingHorizontal: 20,
    marginTop: verticalMarginScale(24),
  },
});
