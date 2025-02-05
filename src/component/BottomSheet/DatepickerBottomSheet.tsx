import React, {forwardRef} from 'react';
import {Platform, View, StyleSheet, Text} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import {fontScale, radiusScale, verticalMarginScale, Wp} from '../../utils/dimensions';
import {
  BUTTON_LABLE,
  COLORS,
  LABLE,
} from '../../utils/constants';
import Button from '../Button';
import DatePicker from 'react-native-date-picker';
import {fontFamily} from '../../utils/functions';

interface Props {
  setSelectedDate:(date:Date)=>void,
  date:Date,
  setDate:(date:Date)=>void
}
const DatepickerBottomSheet = forwardRef((props:Props, ref) => {
  const hundredYearsAgo = new Date();
  hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onNextClick = () => {
    ref.current?.close(); 
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[Platform.OS === 'android' ? '55%' : '50%']}
      onClose={() => console.log(ref)}>
      <View style={styles.container}>
        <Text style={styles.title}>{LABLE.BIRTHDAY}</Text>
        <Text style={styles.subTitle}>{LABLE.SELECT_YOUR_BIRTHDAY_BELOW}</Text>
        <DatePicker
          title={''}
          theme="light"
          mode="date"
          open={true}
          date={props.date}
          locale="en-US"    
          onDateChange={(date: any) => {
            props?.setSelectedDate(date);
            props.setDate(date)
          }}
          minimumDate={hundredYearsAgo}
          // maximumDate={today}
        />
        <Button
          style={styles.btnStyle}
          title={BUTTON_LABLE.CONFIRM}
          colorTheme="dark"
          onPress={onNextClick}
        />
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize:fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    fontWeight: '700',
  },
  subTitle: {
    marginVertical:verticalMarginScale(10),
    fontSize: fontScale(14),
    color: COLORS.light_gray,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius:radiusScale(100),
    marginTop:verticalMarginScale(20),
  },
});

export default DatepickerBottomSheet;
