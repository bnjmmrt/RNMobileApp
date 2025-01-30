import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import {LABLE, ERROR_MESSAGE, COLORS} from '../../../utils/constants';
import DatepickerBottomSheet from '../../../component/BottomSheet/DatepickerBottomSheet';
import {formatDate} from '../../../utils/functions';

interface DatePickerComponentProps {}

const DatePickerComponent: React.FC<DatePickerComponentProps> = () => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<any>(null);
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const [selectedDate, setSelectedDate] = useState<string>(birthday); // Initialize with birthday from Redux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [date, setDate] = useState<any>(new Date());

  const openDatePicker = () => {
    bottomSheetRef.current?.open(); // Open the date picker
  };

  const handleDateChange = (date: Date) => {
    setErrorMessage(null); // Clear any error message
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate); // Update the selected date
  };

  const isUnder18 = (selectedDate: string) => {
    const [day, month, year] = selectedDate.split('/').map(Number); // Parse the date
    const selectedDateObj = new Date(year, month - 1, day); // Create a date object
    const today = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
    return selectedDateObj > eighteenYearsAgo; // Check if under 18
  };

  const validateInputs = () => {
    if (!selectedDate) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY);
      return false;
    } else if (isUnder18(selectedDate)) {
      setErrorMessage(ERROR_MESSAGE.AGE_REQUIREMENT_NOT_MET);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  return (
    <>
      <CustomSelectableText
        placeholder={LABLE.DATE_PLACEHOLDER}
        leftImage={IMAGES.calender}
        rightImage={IMAGES.downArrow}
        errorMessage={errorMessage}
        defaultValue={selectedDate}
        onPress={openDatePicker}
        style={styles.container}
      />
      <DatepickerBottomSheet
        ref={bottomSheetRef}
        setSelectedDate={handleDateChange}
        date={date}
        setDate={setDate}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: 60,
  },
  calenderImage: {marginRight: 6, width: 16, height: 16},
  iconContainer: {},
});
export default DatePickerComponent;
