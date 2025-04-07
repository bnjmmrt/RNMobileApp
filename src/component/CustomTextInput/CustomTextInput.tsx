import React, { useRef, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  Text,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { Images } from '../../utils/Images';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import { fontFamily } from 'src/utils/functions';
import { COLORS } from 'src/utils/constants';

interface CustomTextInputProps extends TextInputProps {
  value: string;
  title: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  showInfo?: boolean;
  placeholderTextColor?: string;
  isError?: boolean;
  secureTextEntry?: boolean;
  eyeVisibleValue?: boolean;
  onPressEye?: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  title,
  onChangeText,
  showInfo,
  onPress,
  placeholderTextColor = COLORS.placeHodler,
  isError,
  secureTextEntry,
  eyeVisibleValue,
  onPressEye,
  ...rest
}) => {
  const inputRef = useRef<TextInput>(null);
  const { updateKeyboardStatus } = useKeyboard(inputRef);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            color: '#1B1C34',
            fontWeight: '500',
          }}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPress}>
          {showInfo ? (
            <Image
              source={Images.infoImg}
              style={{
                height: Hp(2),
                width: Hp(2),
                resizeMode: 'contain',
                marginLeft: 10,
              }}
            />
          ) : null}
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.container,
          {
            borderColor: isError
              ? '#EE6055'
              : isFocused
                ? '#4D4EB4'
                : '#EADECF',
          },
        ]}>
        <TextInput
          ref={inputRef}
          style={[styles.input, { width: secureTextEntry ? Wp(60) : Wp(66) }]}
          value={value}
          secureTextEntry={eyeVisibleValue}
          onChangeText={onChangeText}
          onFocus={() => {
            updateKeyboardStatus(true);
            setIsFocused(true);
          }}
          onBlur={() => {
            updateKeyboardStatus(false);
            setIsFocused(false);
          }}
          placeholderTextColor={placeholderTextColor}
          {...rest}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            onPressIn={onPressEye}
            onPressOut={onPressEye}
            style={{
              height: Hp(5),
              width: Wp(9),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={eyeVisibleValue ? Images.hideEyeImg : Images.viewEyeImg}
              style={{
                height: Hp(2.5),
                width: Hp(2.5),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: Wp(Platform.OS === 'ios' ? 4 : 2.5),
    marginVertical: 8,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    height: Hp(5.3),
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input: {
    fontSize: 15,
    color: '#000',
    height: Hp(5),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default CustomTextInput;
