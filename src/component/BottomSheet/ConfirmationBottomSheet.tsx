import React, {useRef, forwardRef} from 'react';
import {View, StyleSheet, Text, Image, Platform} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import {COLORS} from '../../utils/constants';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import {Hp} from '../../utils/dimensions';

interface ConfirmationBottomSheetProps {
  // onPress: () => void;
  snapPoints?: any[];
  logo: any;
  title: string;
  subTitle: string;
  btnLabel: string;
}
const ConfirmationBottomSheet = forwardRef(
  (props: ConfirmationBottomSheetProps, ref) => {
 
    const close = () => {
      ref.current.close();
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
          <View style={styles.logoContainer}>
            <Image source={props.logo} style={styles.logo} />
          </View>
          {props.title && <Text style={styles.title}>{props.title}</Text>}
          {props.subTitle && (
            <Text style={[styles.subTitle]}>{props.subTitle}</Text>
          )}

          <Button
            disabled={false}
            style={styles.btnStyle}
            title={props.btnLabel}
            colorTheme="dark"
            onPress={close}
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
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 50, 
    backgroundColor: COLORS.lighter_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
  },
  btnStyle: {
    borderRadius: 100,
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: Hp(1),
    textAlign: 'center',
  },
  
});

export default ConfirmationBottomSheet;
