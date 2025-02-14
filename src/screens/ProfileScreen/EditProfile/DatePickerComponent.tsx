import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import { LABLE, ERROR_MESSAGE, COLORS } from '../../../utils/constants';
import DatepickerBottomSheet from '../../../component/BottomSheet/CustomDatepickerBottomSheet';
import { formatDate, validateAge } from '../../../utils/functions';
import { horizontalMarginScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';

interface DatePickerComponentProps {
  birthDate: string
}

const DatePickerComponent = forwardRef((props: DatePickerComponentProps, ref) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(props.birthDate); // Initialize with birthday from Redux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openDatePicker = () => {
    bottomSheetRef.current?.open();
  };
  useImperativeHandle(ref, () => ({
    validateBirthDate, selectedDate
  }));

  const handleDateChange = (date: string) => {
    setErrorMessage(null);
    setSelectedDate(date);
  };

  const validateBirthDate = () => {
    if (!selectedDate) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY);
      return false;
    } else if (validateAge(selectedDate)) {
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
        date={selectedDate}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: verticalScale(60),
  },
  calenderImage: { marginRight: verticalMarginScale(6), width: horizontalMarginScale(16), height: verticalMarginScale(16) },
  iconContainer: {},
});
export default DatePickerComponent;
