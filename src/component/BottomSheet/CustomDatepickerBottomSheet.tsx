import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, View, StyleSheet, Text } from 'react-native';
import BottomSheetComponent from './BottomSheet';
import { fontScale, radiusScale, verticalMarginScale, Wp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import Button from '../Button';
import moment from 'moment';
import WheelPicker from '../WheelPicker/WheelPicker';
import { fontFamily, parseAndFormatDate } from 'src/utils/functions';

interface Props {
  setSelectedDate: (date: string) => void;
  date: string;
}
const CustomDatepickerBottomSheet = forwardRef((props: Props, ref) => {

  const myDate = parseAndFormatDate(props.date);
  const initialDate = new Date(myDate)
  const [selectedDay, setSelectedDay] = useState<string>(`${initialDate.getDate()}`);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Intl.DateTimeFormat('en-US', { month: 'long' }).format(initialDate)
  );
  const [selectedYear, setSelectedYear] = useState<string>(`${initialDate.getFullYear()}`);
  const [days, setDays] = useState<string[]>([]);

  const [dateOfBirth, setDateOfBirth] = useState<string | undefined>('');

  const months = useMemo(
    () => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    []
  );


  const years = useMemo(
    () => Array.from({ length: 2025 - 1970 }, (_, i) => `${1970 + i}`),
    []
  );

  // Function to calculate days based on month and year
  const calculateDays = useCallback(() => {
    const monthIndex = months.indexOf(selectedMonth); // Convert month name to index (0-based)
    const year = parseInt(selectedYear, 10);

    // Use Date to determine the number of days in the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Update the days array
    const newDays = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    setDays(newDays);

    // Adjust selectedDay if it exceeds the valid range
    if (parseInt(selectedDay, 10) > daysInMonth) {
      setSelectedDay(`${daysInMonth}`); // Set to the last valid day
    }
  }, [months, selectedMonth, selectedYear, selectedDay]);

  useEffect(() => {
    calculateDays();
  }, [selectedMonth, selectedYear, calculateDays]);

  useEffect(() => {
    console.log('Date of Birth:', dateOfBirth);
  }, [dateOfBirth]);

  // Function to handle Date of Birth selection
  const dobSelectFunction = () => {
    console.log('Select button value !!!!!', selectedDay, selectedMonth, selectedYear);
    const dateFormat = handleFormatDate(selectedDay, selectedMonth, selectedYear, months);
    setDateOfBirth(dateFormat);
    props.setSelectedDate(dateFormat || '')
    ref.current?.close();
  };

  const handleFormatDate = (selectedDay: string, selectedMonth: string, selectedYear: string, months: string[]) => {
    const monthIndex = months.indexOf(selectedMonth);
    if (monthIndex === -1) {
      console.error('Invalid month name');
      return;
    }
    const monthNumber = (monthIndex + 1).toString().padStart(2, '0'); // Convert to two-digit month
    const dateString = `${selectedDay}/${monthNumber}/${selectedYear}`;
    const formattedDate = moment(dateString, 'DD/MM/YYYY').format('MM-DD-YYYY');
    console.log('Formatted Date:', formattedDate);
    return formattedDate;
  };

  const handleMonthChange = (newMonth: string) => {
    const monthIndex = months.indexOf(newMonth);
    const year = parseInt(selectedYear, 10);
    const daysInNewMonth = new Date(year, monthIndex + 1, 0).getDate();

    setSelectedMonth(newMonth);

    // Ensure the day remains within valid bounds
    if (parseInt(selectedDay, 10) > daysInNewMonth) {
      setSelectedDay(`${daysInNewMonth}`);
    }
  };

  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    const monthIndex = months.indexOf(selectedMonth);
    const daysInMonth = new Date(parseInt(newYear, 10), monthIndex + 1, 0).getDate();

    if (parseInt(selectedDay, 10) > daysInMonth) {
      setSelectedDay(`${daysInMonth}`);
    }
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[Platform.OS === 'ios' ? '48%' : '48%']}
      onClose={() => console.log(ref)}>
      <View style={styles.container}>
        <Text style={styles.title}>{LABLE.BIRTHDAY}</Text>
        <Text style={styles.subTitle}>{LABLE.SELECT_YOUR_BIRTHDAY_BELOW}</Text>
        <View>
          <View style={[styles.pickerRow, {
            marginTop: verticalMarginScale(30),
          }]}>
            <WheelPicker
              wrapperHeight={140}
              highlightBorderWidth={2}
              highlightColor={COLORS.bgGreen}
              itemHeight={50}
              data={months}
              selectedValue={selectedMonth}
              onValueChange={handleMonthChange}
              contentStyle={{ width: 110 }}
            />
            <WheelPicker
              wrapperHeight={140}
              highlightBorderWidth={2}
              highlightColor={COLORS.bgGreen}
              itemHeight={50}
              data={days}
              selectedValue={selectedDay}
              onValueChange={(value: string) => setSelectedDay(value)}
              contentStyle={{ width: 80 }}
              overlayStyle={styles.overlayStyle}
            />
            <WheelPicker
              wrapperHeight={140}
              highlightBorderWidth={2}
              highlightColor={COLORS.bgGreen}
              itemHeight={50}
              data={years}
              selectedValue={selectedYear}
              onValueChange={handleYearChange}
              contentStyle={{ width: 90 }}
            />
          </View>
        </View>
        <Button
          style={styles.btnStyle}
          title={BUTTON_LABLE.CONFIRM}
          colorTheme="dark"
          onPress={dobSelectFunction}
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
    width: Wp(85),
    borderRadius: radiusScale(100),
    marginTop: verticalMarginScale(30),
  },
  pickerRow: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    height: verticalMarginScale(150),
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
});

export default CustomDatepickerBottomSheet;
