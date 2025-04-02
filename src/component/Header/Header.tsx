import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { fontFamily } from '../..//utils/functions';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import ProgressBar from '../ProgressBar/ProgressBar';

interface HeaderProps {
  onPress?: () => void;
  headerTitle?: string;
  showProgressBar?: boolean;
  showBackButton?: boolean;
  rightIcon?: ImageSourcePropType;
  onPressRightIcon?: () => void;
  rightIconWrapperStyle?: StyleProp<ViewStyle>;
  numberOfLines?: number;
}

const Header: React.FC<HeaderProps> = ({
  onPress,
  headerTitle,
  showProgressBar = true,
  onPressRightIcon = () => {},
  rightIcon,
  showBackButton = true,
  rightIconWrapperStyle = {},
  numberOfLines,
}) => {
  const navigation = useNavigation();

  const onPressBackIcon = () => {
    if (onPress) {
      onPress();
    } else {
      if (navigation.canGoBack()) navigation.goBack();
    }
  };
  return (
    <View style={{}}>
      <View
        style={[
          styles.container,
          {
            paddingBottom: showProgressBar
              ? verticalMarginScale(7)
              : verticalMarginScale(16),
          },
        ]}>
        {/* Back Arrow */}
        {showBackButton ? (
          <TouchableOpacity
            onPress={onPressBackIcon}
            style={styles.iconWrapper}>
            <Image source={IMAGES.leftArrow} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyWrapper} />
        )}

        {/* Header Title */}
        <View style={styles.titleWrapper}>
          <Text style={styles.headerTitle} numberOfLines={numberOfLines}>
            {headerTitle}
          </Text>
        </View>

        {/* Right Icon */}
        {rightIcon ? (
          <TouchableOpacity
            onPress={onPressRightIcon}
            style={[styles.iconWrapper, rightIconWrapperStyle]}>
            <Image source={rightIcon} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyWrapper} />
        )}
      </View>
      {showProgressBar ? <ProgressBar /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: horizontalMarginScale(20),
    paddingTop: verticalMarginScale(16),
    paddingBottom: verticalMarginScale(16),
  },
  iconWrapper: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radiusScale(40),
    backgroundColor: COLORS.tabBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2, // Shadow on Android
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  icon: {
    width: verticalScale(16),
    height: verticalScale(16),
    resizeMode:'contain'
  },
  emptyWrapper: {
    width: verticalScale(40),
    height: verticalScale(40),
  },
  titleWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontScale(24),
    color: COLORS.black,
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
});

export default Header;
