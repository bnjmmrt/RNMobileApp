import IMAGES from "@images/index";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Image } from "react-native-animatable";
import Icon from "react-native-vector-icons/FontAwesome"; // Install using 'npm install react-native-vector-icons'
import { COLORS } from "src/utils/constants";
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale } from "src/utils/dimensions";

export type InputRefMethods = {
  isIconShown?:boolean;
  errorMessage?:string;
  label:string;
  prefix:string;
  image:string;
};
const SocialMediaInput=forwardRef((props:InputRefMethods, ref) => {
  const [inputText, setInputText] = useState('');
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
      setErrorMessage
    }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{props?.label}</Text>
      <View style={styles.inputContainer}>
        <Image source={props?.image} style={styles.icon} />
        <Text style={styles.prefix}>{props?.prefix}</Text>
        <TextInput ref={ref}
          style={styles.input}
          placeholder="username"
          placeholderTextColor="#A0A0A0"
          value={inputText}
          onChangeText={setInputText}
        />
        {props?.isIconShown &&  <Image source={IMAGES.checkCircleFilled} style={styles.icon} />}
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor:COLORS.borderGray,
    borderRadius: radiusScale(8),
    paddingHorizontal:horizontalMarginScale(10),
    backgroundColor:COLORS.white,
    height:verticalScale(48)
  },
  icon: {
    marginRight: 8,
  },
  prefix: {
    fontSize:fontScale(14),
    color: COLORS.black,
    fontWeight:'500'
  },
  input: {
    flex: 1,
    fontSize:fontScale(14),
    color: COLORS.black,
    marginLeft: 5,
  },
});

export default SocialMediaInput;
