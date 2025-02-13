import React, {useRef, forwardRef, useState} from 'react';
import {View, StyleSheet, Text, Image, Platform} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import {BUTTON_LABLE, COLORS} from '../../utils/constants';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import {EndPoint} from '../../ApiManager/config';
import useApi from '../../axios/useApi';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

interface CalenderEventsBottomSheetProps {
  onPress: () => void;
  // title?: string;
  submitButtonText: string;
  cancelButtonText: string;
  snapPoints: any;
  image: any | null;
}
const CalenderEventsBottomSheet = forwardRef(
  (props: CalenderEventsBottomSheetProps, ref) => {
    const inputRef = useRef(null);
    // const [image, setImage] = useState<string>(image);

    const cancelClick = () => {
      ref.current?.close();
    };

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={[Platform.OS == 'android' ? '40%' : '40%']}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          <Text style={styles.title}>{'Add To Caleneder'}</Text>

          <Text style={[styles.subTitle]}>
            {' '}
            {'Never miss a moment.\nSync this event to your calendar.'}
          </Text>

          {props.image && (
            <View style={styles.profilePhotoContainer}>
              <Image
                style={styles.profilePhotoContainer}
                source={{uri: props.image}}
                resizeMode="cover"
              />
            </View>
          )}

          {Platform.OS === 'ios' ? (
            <Button
              disabled={false}
              style={styles.btnStyle}
              title={'Add to Apple Calendar'}
              colorTheme="dark"
              onPress={props.onPress}
            />
          ) : (
            <Button
              disabled={false}
              style={styles.btnStyle}
              title={'Add to Google Calendar'}
              colorTheme="dark"
              onPress={props.onPress}
            />
          )}

          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.CLEAR}
            colorTheme="dark"
            onPress={cancelClick}
            clearButtonStyle={styles.clearButton}
            textStyle={{color: '#000'}}
          />
        </View>
      </BottomSheetComponent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    paddingVertical: verticalMarginScale(16),
    gap: 8,
  },
  btnStyle: {
    borderRadius: fontScale(100),
  },
  clearButton: {
    borderWidth: horizontalScale(1),
    backgroundColor: COLORS.tabBorderColor,
    // borderColor: COLORS.black,
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  subTitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: verticalMarginScale(2),
    textAlign: 'center',
  },
  profilePhotoContainer: {
    height: verticalScale(196),
    width: verticalScale(196),
    borderRadius: radiusScale(100),
    borderWidth: horizontalScale(1),
    backgroundColor: COLORS.tabBorderColor,
    borderColor: COLORS.borderGray,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalenderEventsBottomSheet;
