import { BottomSheetView } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import moment from 'moment';
import React, { forwardRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateType, useDefaultClassNames, useDefaultStyles } from 'react-native-ui-datepicker';
import { fontFamily } from 'src/utils/functions';
import { COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import Button from '../Button';
import BottomSheetComponent from './BottomSheet';
import { formatDateToUTCString } from 'src/utils/dateFunctions';

interface Props {
  setSelectedDate: (date: string) => void;
  date: string;
  minDate: string;
  timeZone: string
}

const CustomDateTimePickerBottomSheet = forwardRef((props: Props, ref) => {
  const formatDate = (dateString: string) => {
    const date = moment(dateString, 'YYYY-MM-DD HH:mm:ssZ', true);

    if (!date.isValid()) {
      return 'Invalid Date';
    }

    return date.utc().format('YYYY-MM-DD HH:mm');
  };

  const formatDateValue = (date: string) => {
    const rawString = date?.toString();
    const isoString = rawString?.replace(" ", "T").replace(/\+(\d{2})$/, "+$1:00"); // fixes "+00" to "+00:00"
    return new Date(isoString)
  }

  const date = new Date(formatDateValue(props?.date));
  const minDate = new Date(formatDateValue(props?.minDate));
  const [selectedDate, setSelectedDate] = useState<DateType>(date);
  const timeZone = props?.timeZone;

  // const myDate = formatDate(props.date);
  // const formattedMinDate = props?.minDate ? formatDate(props?.minDate) : undefined;

  // const [selectedDate, setSelectedDate] = useState(myDate);
  const defaultClassNames = useDefaultClassNames();
  const defaultStyles = useDefaultStyles();

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['72%']}
      onClose={() => console.log(ref)}>
      <View style={styles.container}>
        <Text style={styles.title}>{'Date & Time'}</Text>
        <View>
          <View
            style={[
              styles.pickerRow,
              {
                marginTop: verticalMarginScale(30),
              },
            ]}>
            <BottomSheetView style={styles.datePicker}>
              <DateTimePicker
                mode="single"
                use12Hours
                timePicker
                date={selectedDate}
                // timeZone={timeZone}
                minDate={minDate}
                onChange={({ date }) => {
                  console.log('Type of date:', typeof date, date);
                  setSelectedDate(date instanceof Date ? date : new Date(date));
                }}
                styles={{
                  ...defaultStyles,
                  today: { backgroundColor: COLORS.disable, borderRadius: 22, width: 44, height: 44 }, // Add a border to today's date
                  selected: { backgroundColor: COLORS.black, borderRadius: 22, width: 44, height: 44 }, // Highlight the selected day
                  selected_label: { color: 'white' }, // Highlight the selected day label

                }}


              />

              {/* 
              <DateTimePicker
                classNames={{
                  ...defaultClassNames,
                  today: 'border-amber-500', // Add a border to today's date
                  selected: 'bg-amber-500 border-amber-500', // Highlight the selected day
                  selected_label: "text-white", // Highlight the selected day label
                  day: `${defaultClassNames.day} hover:bg-amber-100`, // Change background color on hover
                  disabled: 'opacity-50', // Make disabled dates appear more faded
                }}
                mode="single"
                // timePicker
                // use12Hours
                // minDate={props?.minDate || new Date()}

                // timePickerDecelerationRate={'fast'}
                date={selectedDate.toString()}
                // headerButtonStyle={styles.headerButtonStyle}
                // headerContainerStyle={{ marginTop: 16 }}
                // headerTextStyle={{
                //   fontFamily: fontFamily.ABCDiatype_Regular,
                //   fontSize: fontScale(14),
                // }}
                // weekDaysTextStyle={{
                //   fontFamily: fontFamily.ABCDiatype_Bold,
                //   fontSize: fontScale(14),
                // }}
                // calendarTextStyle={{
                //   fontFamily: fontFamily.ABCDiatype_Regular,
                //   fontSize: fontScale(14),
                // }}
                // selectedItemColor={COLORS.black}
                // selectedRangeBackgroundColor="lightgray"
                // dayContainerStyle={styles.dayContainerStyle}
                // buttonNextIcon={
                //   <Image resizeMode="contain" source={IMAGES.arrowRight} />
                // }
                // buttonPrevIcon={
                //   <Image
                //     source={IMAGES.arrowRight}
                //     style={{
                //       transform: [{ rotate: '180deg' }],
                //       resizeMode: 'contain',
                //     }}
                //   />
                // }
                onChange={({ date }) => {
                  setSelectedDate(date);
                }}
              /> */}
            </BottomSheetView>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Button
            style={styles.btnStyle}
            title={'Save'}
            colorTheme="dark"
            onPress={() => {
              const FormatedDate = formatDateToUTCString(selectedDate)
              props?.setSelectedDate(FormatedDate);
              ref?.current?.close();
            }}
          />
          <Button
            style={styles.btnStyle}
            title={'Cancel'}
            buttonType="stripe"
            colorTheme="dark"
            onPress={() => {
              ref?.current?.close();
            }}
          />
        </View>
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
  },
  subTitle: {
    marginVertical: verticalMarginScale(10),
    fontSize: fontScale(14),
    color: COLORS.light_gray,
  },
  btnStyle: {
    borderRadius: radiusScale(100),
    marginTop: verticalMarginScale(10),
  },
  pickerRow: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  overlayStyle: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    transform: [{ translateY: -25 }],
  },
  dayContainerStyle: {
    width: 40,
    height: 40,
    marginHorizontal: 'auto',
  },
  alert: {
    color: COLORS.red,
  },
  headerButtonStyle: {
    backgroundColor: COLORS.tabBorderColor,
    borderRadius: radiusScale(100),
    height: verticalScale(24),
    width: verticalScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    borderRadius: radiusScale(12),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: horizontalMarginScale(12),
  },
});

export default CustomDateTimePickerBottomSheet;
