import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ImageSourcePropType,
  ViewStyle,
} from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../assets/images';
import { COLORS } from '../utils/constants';
import { fontFamily } from '../utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { CustomText } from './CustomText';

// Define the props for SearchInput
interface SearchInputProps extends TextInputProps {
  onSearchTextChange?: (text: string) => void;
  placeholder?: string;
  rightIconText?: string;
  rightIcon?: ImageSourcePropType;
  onPressRightIcon?: () => void;
  mainContainerStyle?: ViewStyle;
}

const SearchInput = forwardRef(
  (
    {
      onSearchTextChange,
      placeholder,
      rightIcon,
      onPressRightIcon,
      rightIconText,
      mainContainerStyle,
    }: SearchInputProps,
    ref,
  ) => {
    const [searchText, setSearchText] = useState('');

    // Expose handleNextPress to the parent
    useImperativeHandle(ref, () => ({
      handleNextPress,
      searchText
    }));

    // Handle the "Next" button press
    const handleNextPress = () => {
      // Placeholder for any actions
    };

    const handleTextChange = (text: string) => {
      setSearchText(text);
      if (onSearchTextChange) {
        onSearchTextChange(text); // Notify parent component
      }
    };

    return (
      <View style={[styles.container, mainContainerStyle]}>
        <View style={[styles.inputWrapper]}>
          <Image source={IMAGES.search} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={placeholder ? placeholder : 'Search for an event...'}
            value={searchText}
            onChangeText={handleTextChange}
          />
          {searchText && (
            <TouchableOpacity
              onPress={() => handleTextChange('')}
              style={{
                height: '100%',
                justifyContent: 'center',
                paddingLeft: horizontalMarginScale(8),
                paddingRight: horizontalMarginScale(4),
              }}>
              <Image source={IMAGES.clear} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
          {rightIcon ? (
            <TouchableOpacity
              style={[
                styles.rightIconWrapper,
                rightIconText && {
                  paddingHorizontal: horizontalMarginScale(12),
                },
              ]}
              onPress={onPressRightIcon}>
              {rightIconText ? (
                <CustomText style={styles.rightIconText}>
                  {rightIconText}
                </CustomText>
              ) : null}
              <Image source={rightIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(48),
    borderWidth: 1,
    flex: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(16),
    gap: horizontalMarginScale(4),
  },
  icon: {
    // marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  rightIconWrapper: {
    backgroundColor: COLORS.neutral_surface,
    padding: verticalMarginScale(8),
    borderRadius: radiusScale(99),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(4),
  },
  rightIconText: {
    color: COLORS.black,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
});

export default SearchInput;
