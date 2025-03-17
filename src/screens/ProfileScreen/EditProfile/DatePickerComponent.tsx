import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import { LABLE, ERROR_MESSAGE } from '../../../utils/constants';
import CustomDatepickerBottomSheet from '../../../component/BottomSheet/CustomDatepickerBottomSheet';
import { validateAge } from '../../../utils/functions';
import { horizontalMarginScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import CustomDateTimePickerBottomSheet from 'src/component/BottomSheet/CustomDateTimePickerBottomSheet';
import { formatSingleToDeviceTimeZone } from 'src/utils/dateFunctions';

interface DatePickerComponentProps {
  birthDate: string,
}

const DatePickerComponent = forwardRef((props: DatePickerComponentProps, ref) => {
  const bottomSheetRef = useRef<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(props.birthDate); // Initialize with birthday from Redux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openDatePicker = () => {
    bottomSheetRef.current?.open();
  };
  useImperativeHandle(ref, () => ({
    validateBirthDate, selectedDate,
    validateEventDate,
    setSelectedDate
  }));

  const handleDateChange = (date: string) => {
    setErrorMessage(null);
    setSelectedDate(date);
    props?.onDateChange && props?.onDateChange(date);
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

  const validateEventDate = () => {
    if (!selectedDate) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_EVENT_DATE);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const formattedDate = formatSingleToDeviceTimeZone(selectedDate);

  return (
    <>
      <CustomSelectableText
        placeholder={LABLE.DATE_PLACEHOLDER}
        leftImage={IMAGES.calender}
        rightImage={IMAGES.downArrow}
        errorMessage={errorMessage}
        defaultValue={formattedDate}
        onPress={openDatePicker}
        style={styles.container}
      />
      {props?.type == "DateTime" ? <CustomDateTimePickerBottomSheet
        ref={bottomSheetRef}
        minDate={props?.startDate}
        setSelectedDate={handleDateChange}
        date={selectedDate}
      /> : <CustomDatepickerBottomSheet
        ref={bottomSheetRef}
        setSelectedDate={handleDateChange}
        date={selectedDate}
      />}
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
