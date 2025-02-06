import React, { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setBirthday, setPageProgress } from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';
import Title from '../../../component/Title/Title';
import Button from '../../../component/Button';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import IMAGES from '../../../assets/images';
import { LABLE, BUTTON_LABLE, ERROR_MESSAGE } from '../../../utils/constants';
import DatepickerBottomSheet from '../../../component/BottomSheet/DatepickerBottomSheet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import BirthdayScreenStyles from './BirthdayScreenStyles';
import { formatDate, validateAge } from 'src/utils/functions';
interface BirthdayScreenProps extends NativeStackScreenProps<any, any> { }
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
interface BirthdayScreenProps extends NativeStackScreenProps<any, any> { }

const BirthdayScreen: React.FC<BirthdayScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<any>(null);
  const styles = BirthdayScreenStyles();
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const [selectedDate, setSelectedDate] = useState<string>(birthday); // Initialize with birthday from Redux
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [date, setDate] = useState<any>(new Date());

  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.navigate('GenderScreen');
  };

  const openDatePicker = () => {
    bottomSheetRef.current?.open(); // Open the date picker
  };

  const handleDateChange = (date: Date) => {
    setErrorMessage(null); // Clear any error message
    const formattedDate = formatDate(date);
    console.log(formattedDate);
    setSelectedDate(formattedDate); // Update the selected date
  };

  const validateInputs = () => {
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

  const onNextClick = () => {
    if (validateInputs()) {
      dispatch(setBirthday(selectedDate)); // Save the selected date
      dispatch(setPageProgress(5));
      navigation.navigate('BaseCityScreen'); // Navigate to the next screen
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.BIRTHDAY} onPress={handleBackPress} />
      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHEN_IS_YOUR_BIRTHDAY}
          subTitle={
            LABLE.WE_WILL_USE_THIS_INFORMATION_TO_TAILOR_YOUR_EXPERIENCE
          }
        />
        <CustomSelectableText
          placeholder={LABLE.DATE_PLACEHOLDER}
          leftImage={IMAGES.calender}
          rightImage={IMAGES.downArrow}
          errorMessage={errorMessage}
          defaultValue={selectedDate} // Display the selected date
          onPress={openDatePicker} // Open the date picker when pressed
        />
      </View>

      <Button
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick} // Validate and navigate to the next screen
      />

      {/* Pass the handleDateChange function to the DatepickerBottomSheet */}
      <DatepickerBottomSheet
        ref={bottomSheetRef}
        setSelectedDate={handleDateChange}
        date={date}
        setDate={setDate}
      />
    </View>
  );
};

export default BirthdayScreen;
