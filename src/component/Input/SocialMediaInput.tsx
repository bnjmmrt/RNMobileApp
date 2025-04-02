import IMAGES from '@images/index';
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Image } from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome'; // Install using 'npm install react-native-vector-icons'
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';

export type InputRefMethods = {
  isIconShown?: boolean;
  errorMessage?: string;
  label: string;
  prefix: string;
  image: string;
  defaultValue: string;
};
const SocialMediaInput = forwardRef((props: InputRefMethods, ref) => {
  const inputRef = useRef<TextInput>(null);
  const { updateKeyboardStatus } = useKeyboard(inputRef);

  const [inputText, setInputText] = useState(props.defaultValue);
  const [errorMessage, setErrorMessage] = useState(props?.errorMessage);

  const validateInputs = () => {
    if (!inputText) {
      setErrorMessage(props?.errorMessage);
      return false;
    }
    setErrorMessage('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validateInputs,
    inputText,
    setErrorMessage,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props?.label}</Text>
      <View style={styles.inputContainer}>
        <Image source={props?.image} style={styles.icon} />
        <Text style={styles.prefix}>{props?.prefix}</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="username"
          placeholderTextColor={COLORS.placeHodler}
          value={inputText}
          onChangeText={setInputText}
          defaultValue={props?.defaultValue}
          onFocus={() => {
            updateKeyboardStatus(true);
          }}
          onBlur={() => {
            updateKeyboardStatus(false);
          }}
        />
        {props?.isIconShown && (
          <Image source={IMAGES.checkCircleFilled} style={styles.icon} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalMarginScale(16),
  },
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    paddingHorizontal: horizontalMarginScale(10),
    backgroundColor: COLORS.white,
    height: verticalScale(48),
  },
  icon: {
    marginRight: horizontalMarginScale(8),
    resizeMode:'contain'
  },
  prefix: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default SocialMediaInput;
