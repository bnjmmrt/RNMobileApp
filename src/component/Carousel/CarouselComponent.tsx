import IMAGES from '@images/index';
import * as React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { verticalMarginScale } from 'src/utils/dimensions';

const { width } = Dimensions.get('window');
interface CustomCarouselProps{
    list:any[],
    onScroll:(index:number)=>void
}
const  CustomCarousel:React.FC<CustomCarouselProps>=({ list,onScroll }) =>{
  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
    console.log('onPressPagination')
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View
   
      style={styles.container}>
      <Carousel
        // autoPlayInterval={2000}
        data={list}
        height={330}
        loop={true}
        width={width}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.99,
          parallaxScrollingOffset: 55,
        }}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <Image source={item.uri} style={styles.image} />
        )}
        onScrollEnd={(index)=>onScroll(index)}
        // onScrollStart={()=>console.log("start")}
        
      />
      <Pagination.Basic
        progress={progress}
        data={list.map(item => (item))}
        size={12}
        dotStyle={{
          borderRadius: 100,
          backgroundColor: '#262626',
           //   height: 16,
        //   width: 16,
        }}
        activeDotStyle={{
          borderRadius: 100,
          overflow: 'hidden',
          backgroundColor: '#f1f1f1',
       
        }}
        containerStyle={[
          {
            top: 10,
            gap: 5,
      
          },
        ]}
        horizontal
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container:{marginBottom:verticalMarginScale(24)},
  image: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default CustomCarousel;
