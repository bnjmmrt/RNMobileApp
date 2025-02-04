import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import IMAGES from '../../../assets/images';
import BirthdayScreenStyles from './BirthdayScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
} from '../../../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setBirthday, setPageProgress } from '../../../redux/slices/appFlowSlice';
import BottomSheetComponent from '../../../component/BottomSheet/BottomSheet';
import DatePickerComponent from '../../../component/CustomDatePicker/CustomDatePicker';
import DatePickerInput from '../../../component/DatePickerInput/DatePickerInput';

interface BirthdayScreenProps extends NativeStackScreenProps<any, any> {}

const BirthdayScreen: React.FC<BirthdayScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<any>(null);
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const styles = BirthdayScreenStyles();
  const [selectedDate, setSelectedDate] = useState<string>(birthday || ''); // Initialize with birthday from state
  const [isShown, setIsShown] = useState(false);

  const onNextClick = () => {
    dispatch(setBirthday(selectedDate)); // Save the selected date to Redux
    dispatch(setPageProgress(5));
    navigation.navigate('BaseCityScreen');
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.navigate('GenderScreen');
  };

  const openDatePicker = () => {
    setIsShown(true);
  };

  const handleDateChange = (date: Date) => {
    const formattedDate = date
      .toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) // Format to DD/MM/YYYY
      .replace(/\//g, '/');
    setSelectedDate(formattedDate); // Update selected date
  
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.BIRTHDAY} onPress={handleBackPress} />
      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHEN_IS_YOUR_BIRTHDAY}
          subTitle={
            LABLE.WE_WILL_USE_THIS_INFORMATION_TO_TAILOR_YOUR_EXPERIENCE
          }
        />
        <DatePickerInput
          placeholder={LABLE.DATE_PLACEHOLDER}
          leftImage={IMAGES.calender}
          rightImage={IMAGES.downArrow}
          errorMessage={ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY}
          defaultValue={selectedDate} // Display the selected date
          onPressImage={() => openDatePicker()} // Open date picker
        />
      </View>

      <Button
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />

      {isShown && (
        <BottomSheetComponent
          ref={bottomSheetRef}
          snapPoints={['60%']} // Adjustable snap points
          onClose={() => setIsShown(false)}
          backColor={COLORS.white}
          children={
            <DatePickerComponent
              date={new Date()}
              setOpen={() => setIsShown(false)}
              setDate={handleDateChange} // Update the selected date
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default BirthdayScreen;