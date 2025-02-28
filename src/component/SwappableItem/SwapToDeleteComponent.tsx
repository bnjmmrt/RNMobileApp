import IMAGES from '@images/index';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-animatable';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { BUTTON_LABLE, COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';

interface SwappableItemProps {
  item: any;
  renderItem: (item: any) => React.ReactNode;
  onDelete?: (id: any) => void;
}

const SwapToDeleteComponent: React.FC<SwappableItemProps> = ({
  item,
  renderItem,
  onDelete,
}) => {
  const translateX = useSharedValue(0);
  const [toggled, setToggled] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      runOnJS(onDelete)(item.id);
    }
    translateX.value = withTiming(0, { duration: 200 });
    runOnJS(setToggled)(false);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .simultaneousWithExternalGesture()
    .onUpdate(event => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -50) {
        translateX.value = withTiming(-80, { duration: 50 });
        runOnJS(setToggled)(true);
      } else {
        translateX.value = withSpring(0);
        runOnJS(setToggled)(false);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]}>
          {renderItem(item)}
        </Animated.View>
      </GestureDetector>

      {toggled && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Image source={IMAGES.deleteGray} />
            <Text style={styles.actionText}>{BUTTON_LABLE.DELETE}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    right: 0,
  },
  deleteButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(15),
    borderRadius: radiusScale(16),
    borderWidth: 1,
    gap: 2,
    borderColor: COLORS.borderGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.black,
    fontWeight: '500',
    fontSize: fontScale(11),
  },
});

export default SwapToDeleteComponent;
