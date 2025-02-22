import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { CustomText } from '../../../component/CustomText';
import IMAGES from '@images/index';
import {
  radiusScale,
  verticalMarginScale,
  verticalScale,
  fontScale,
  horizontalMarginScale,
} from 'src/utils/dimensions';
import { COLORS } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';

interface CollapseWrapProps {
  title: string;
  children: React.ReactNode;
  isCollapsible?: boolean;
}

const CollapseWrap: React.FC<CollapseWrapProps> = ({
  title,
  children,
  isCollapsible = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const rotateAnimation = useRef(new Animated.Value(1)).current;

  const toggleDetails = () => {
    Animated.timing(rotateAnimation, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsOpen(!isOpen);
  };

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['90deg', '270deg'],
  });

  const renderHeader = () => {
    if (!isCollapsible) {
      return <CustomText style={styles.title}>{title}</CustomText>;
    }

    return (
      <View
        style={[
          styles.header,
          !isOpen && {
            borderBottomWidth: 0,
            paddingBottom: 0,
          },
        ]}>
        <CustomText style={styles.title}>{title}</CustomText>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleDetails}>
          <Animated.Image
            source={IMAGES.arrowRight}
            style={{
              transform: [{ rotate: spin }],
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {isOpen && (
        <View style={{ marginTop: verticalScale(24) }}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: verticalScale(1),
    borderBottomColor: COLORS.borderGray,
    paddingBottom: verticalMarginScale(12),
  },
  title: {
    fontSize: fontScale(18),
    fontWeight: '700',
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
  toggleButton: {
    height: verticalScale(24),
    width: verticalScale(24),
    borderRadius: radiusScale(32),
    backgroundColor: COLORS.tabBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CollapseWrap;
