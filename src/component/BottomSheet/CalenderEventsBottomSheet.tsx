import React, { forwardRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import useCalender from 'src/utils/hooks/useCalender';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import Button from '../Button';
import BottomSheetComponent from './BottomSheet';

interface CalenderEventsBottomSheetProps {
  eventDetails: any;
}
const CalenderEventsBottomSheet = forwardRef(
  (props: CalenderEventsBottomSheetProps, ref) => {
    const { addEventToCalendar } = useCalender(props.eventDetails);
    const cancelClick = () => {
      ref.current?.close();
    };

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={[Platform.OS == 'android' ? '32%' : '30%']}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          <Text style={styles.title}>{LABLE.ADD_TO_CALENDAR}</Text>

          <Text style={[styles.subTitle]}>{LABLE.NEVER_MISS_MOMENT}</Text>

          <Button
            disabled={false}
            style={styles.btnStyle}
            title={
              Platform.OS === 'ios'
                ? LABLE.ADD_TO_APPLE_CALENDAR
                : LABLE.ADD_TO_GOOGLE_CALENDAR
            }
            colorTheme="dark"
            onPress={() =>
              addEventToCalendar().then(() => {
                cancelClick();
              })
            }
          />

          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.CANCEL}
            colorTheme="dark"
            onPress={cancelClick}
            clearButtonStyle={styles.clearButton}
            textStyle={{ color: '#000' }}
          />
        </View>
      </BottomSheetComponent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    // paddingVertical: verticalMarginScale(16),
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
    marginTop: verticalMarginScale(2),
    marginBottom: verticalMarginScale(12),
    textAlign: 'center',
  },
});

export default CalenderEventsBottomSheet;
