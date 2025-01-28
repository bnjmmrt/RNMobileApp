import React, {useRef, forwardRef} from 'react';
import {View, StyleSheet, Text, ViewStyle, Image, Platform} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import {BUTTON_LABLE, COLORS, LABLE, PROFILE} from '../../utils/constants';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import {Hp} from '../../utils/dimensions';
import Input from '../Input/Input';

interface SocialMediaBottomSheetProps {
  onPress: () => void;
  snapPoints?: any[];
  logo: any;
  title: string;
  subTitle: string;
  connectBtnBackground: string;
}
const SocialMediaBottomSheet = forwardRef(
  (props: SocialMediaBottomSheetProps, ref) => {
    const usernameRef = useRef<any>(null);
    const cancelClick = () => {
      ref.current?.close();
    };

    const connect = () => {
      if (props.title === PROFILE.CONNECT_INSTAGRAM) {
        usernameRef.current && usernameRef.current.validateInputs();

        if (usernameRef.current.validateInputs()) {
          //connect to Insta
        }
      }
    };
    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={
          props.snapPoints
            ? props.snapPoints
            : [Platform.OS === 'android' ? '50%' : '45%']
        }
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          <Image source={props.logo} style={styles.logo} />
          {props.title && <Text style={styles.title}>{props.title}</Text>}
          {props.subTitle && (
            <Text style={[styles.subTitle]}>{props.subTitle}</Text>
          )}

          {props.title === PROFILE.CONNECT_INSTAGRAM && (
            <View>
              <Input
                ref={usernameRef}
                placeholder={'@username'}
                leftImage={props.logo}
                // iconStyle={styles.iconStyle}
                errorMessage={'Username is required'}
                defaultValue={''}
                otherStyle={styles.input}
              />

              <View style={styles.mainContainer}>
                <Text style={styles.title1}>{LABLE.COMPLETE_VERIFICATION}</Text>
                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>1</Text>
                </View>
                <Text style={styles.subTitle1}>
                  {LABLE.SEND_DIRECT_MSG_CODE}
                </Text>
                {/* <Text style={styles.subTitle1}> */}

                <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                  <View style={styles.btnRumorContainer}>
                    <Text style={styles.btnRumorText}>{LABLE.RUMORAPP}</Text>
                  </View>
                  <Text>{' to '}</Text>
                  <Text style={styles.emailStyle}>@therumor</Text>
                </View>

                {/* </Text> */}

                <View style={styles.numberContainer}>
                  <Text style={styles.numberText}>2</Text>
                </View>
                <Text style={styles.subTitle}>{LABLE.WE_WILL_REVIEW_APP}</Text>

                <Button
                  disabled={false}
                  style={styles.btnSmallStyle}
                  title={BUTTON_LABLE.GO_TO_INSTAGRAM}
                  colorTheme="light"
                  onPress={() => {}}
                />
              </View>
            </View>
          )}
          <Button
            disabled={false}
            style={[
              styles.btnStyle,
              {backgroundColor: props.connectBtnBackground},
            ]}
            title={props.title}
            colorTheme="dark"
            textStyle={{
              color:
                props.title === PROFILE.CONNECT_SNAPCHAT
                  ? COLORS.black
                  : COLORS.white,
            }}
            onPress={connect}
          />
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.CANCEL}
            colorTheme="dark"
            onPress={cancelClick}
            clearButtonStyle={styles.clearButton}
            textStyle={{color: COLORS.black}}
          />
        </View>
      </BottomSheetComponent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginTop: 10,
  },
  btnStyle: {
    borderRadius: 100,
  },
  clearButton: {
    borderWidth: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: 13,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
  },
  input: {marginTop: 0},
  mainContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    alignItems: 'center',
    padding: 15,
    marginVertical: 15,
  },
  title1: {
    color: COLORS.black,
    fontSize: 20,
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  subTitle1: {
    color: COLORS.light_gray,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(0.15),
    textAlign: 'center',
  },
  numberContainer: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceSecondary,
    fontSize: 14,
    marginTop: Hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // paddingHorizontal:2
  },
  numberText: {
    color: COLORS.black,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
  btnRumor: {
    color: COLORS.black,
    backgroundColor: COLORS.tabBorderColor,
    fontSize: 11,
    padding: 10,
  },
  emailStyle: {
    color: COLORS.black,
    fontWeight: 'bold',
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.tabBorderColor,
    width: 200,
    marginTop: 20,
  },
  btnSmallStyle: {
    width: 'auto',
    height: 40,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: COLORS.tabBorderColor,
    marginTop: Hp(1),
  },

  btnRumorContainer: {
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  btnRumorText: {
    color: COLORS.black,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default SocialMediaBottomSheet;
