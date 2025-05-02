import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import CustomDateTimePickerBottomSheet from 'src/component/BottomSheet/CustomDateTimePickerBottomSheet';
import { convertUTCToTimeZoneFormat } from 'src/utils/dateFunctions';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import IMAGES from '../../../assets/images';
import CustomDatepickerBottomSheet from '../../../component/BottomSheet/CustomDatepickerBottomSheet';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import { ERROR_MESSAGE, LABLE } from '../../../utils/constants';
import { validateAge } from '../../../utils/functions';

interface DatePickerComponentProps {
  birthDate?: string;
  timeZone?: string;
  dateFormat?: string;
  minDate?: string;
  isDOB?: boolean;
}

const DatePickerComponent = forwardRef(
  (props: DatePickerComponentProps, ref) => {
    const bottomSheetRef = useRef<any>(null);
    const [selectedDate, setSelectedDate] = useState<string>(
      props.birthDate || '',
    ); // Initialize with birthday from Redux
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const openDatePicker = () => {
      bottomSheetRef.current?.open();
    };

    useImperativeHandle(ref, () => ({
      validateBirthDate,
      selectedDate,
      validateEventDate,
      setSelectedDate,
      setErrorMessage,
    }));

    const handleDateChange = (date: string) => {
      setErrorMessage(null);
      setSelectedDate(date);
      validateBirthDate(date);
      props?.onDateChange && props?.onDateChange(date);
    };

    const validateBirthDate = (selectedDate: string) => {
      if (!selectedDate) {
        setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY);
        return false;
      }
      if (validateAge(selectedDate)) {
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

    const displayDate = props?.isDOB
      ? selectedDate
      : convertUTCToTimeZoneFormat(
        selectedDate,
        props?.timeZone,
        props.dateFormat,
      );

    return (
      <>
        <CustomSelectableText
          placeholder={LABLE.DATE_PLACEHOLDER}
          leftImage={IMAGES.calender}
          rightImage={IMAGES.downArrow}
          errorMessage={errorMessage}
          defaultValue={displayDate}
          onPress={openDatePicker}
          style={styles.container}
        />
        {props?.type == 'DateTime' ? (
          <CustomDateTimePickerBottomSheet
            ref={bottomSheetRef}
            minDate={props?.minDate}
            setSelectedDate={handleDateChange}
            date={selectedDate}
            timeZone={'UTC'}
          />
        ) : (
          <CustomDatepickerBottomSheet
            ref={bottomSheetRef}
            setSelectedDate={handleDateChange}
            date={selectedDate}
          />
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    // height: verticalScale(60),
  },
  calenderImage: {
    marginRight: verticalMarginScale(6),
    width: horizontalMarginScale(16),
    height: verticalMarginScale(16),
  },
  iconContainer: {},
});
export default DatePickerComponent;
