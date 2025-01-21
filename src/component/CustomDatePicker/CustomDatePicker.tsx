import React, {Dispatch, SetStateAction, useState} from 'react';
import DatePicker from 'react-native-date-picker';
import {BUTTON_LABLE, LABLE} from '../../utils/constants';
import Button from '../Button';
import {StyleSheet, Text} from 'react-native';
import {Wp} from '../../utils/dimensions';
import {View} from 'react-native-animatable';
import {fontFamily} from '../../utils/functions';

type Props = {
  date: Date;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setDate: (date: any) => void;
};

const DatePickerComponent: React.FC<Props> = ({date, setOpen, setDate}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  console.log('DatePickerComponent');
  const onNextClick = () => {
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      setDate(date);
    }
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{LABLE.BIRTHDAY}</Text>
      <Text style={styles.subTitle}>{LABLE.SELECT_YOUR_BIRTHDAY_BELOW}</Text>
      <DatePicker
        title={''}
        //  modal
        theme='light'
        mode="date"
        open={true}
        date={date}
        // onConfirm={(date: any) => {
        //   setDate(date);
        //   setOpen(false);
        //   console.log('Date', date);
        // }}
        // onCancel={() => {
        //   setOpen(false);
        // }}
        onDateChange={(date: any) => {
          setSelectedDate(date);
          // setOpen(false);
          console.log('Date', date);
        }}
      />
      <Button
        style={styles.btnStyle}
        title={BUTTON_LABLE.SUBMIT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
    fontWeight: '700',
  },
  subTitle: {
    marginVertical: 10,
    fontSize: 14,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
    marginTop: 20,
  },
});
export default DatePickerComponent;
