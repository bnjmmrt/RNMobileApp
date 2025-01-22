import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import DateBottomSheet from '../../../component/BottomSheet/DateBottomSheet';
import DatePickerComponent from '../../../component/CustomDatePicker/CustomDatePicker';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import { BlurView } from "@react-native-community/blur";

interface BirthdayScreenProps extends NativeStackScreenProps<any, any> {}

const BirthdayScreen: React.FC<BirthdayScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  // const bottomSheetRef = useRef<any>(null);
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const styles = BirthdayScreenStyles();
  const [selectedDate, setSelectedDate] = useState<string>(birthday); // Initialize with birthday from state
  const [isShown, setIsShown] = useState(false);
  // const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string|null>(null);
  const [date, setDate] = useState<Date>(new Date()); // Initialize with birthday from state
 
 
  const onNextClick = () => {
    if(validateInputs()){
    dispatch(setBirthday(selectedDate)); // Save the selected date to Redux
    dispatch(setPageProgress(5));
    navigation.navigate('BaseCityScreen');
    }
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.navigate('GenderScreen');
   
  };

  const openDatePicker = () => {
    console.log("cliicked")
    setIsShown(true);
  };

  const handleDateChange = (date: Date) => {
    setErrorMessage(null);
    setDate(date)
    setBirthday
    const formattedDate = date
      .toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }) // Format to DD/MM/YYYY
      .replace(/\//g, '/');
    setSelectedDate(formattedDate); // Update selected date
  
  };

  const isUnder18 = (selectedDate:string)=> {
    const [day, month, year] = selectedDate.split('/').map(Number); // Split and convert to numbers
    const selectedDateObj = new Date(year, month - 1, day); // Create a Date object (month is zero-based)
  
    const today = new Date(); 
    const eighteenYearsAgo = new Date(); 
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
  
    return selectedDateObj > eighteenYearsAgo; 
  }

 // Validate inputs
 const validateInputs = () => {

  if (!selectedDate) {
    setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY);
    return false;
  }else if(isUnder18(selectedDate)){
    console.log("selectedDate")
    setErrorMessage(ERROR_MESSAGE.AGE_REQUIREMENT_NOT_MET);
    return false;
  }
  setErrorMessage(null);
  return true;
};

  return (
    <SafeAreaView style={styles.container}>
      {isShown && <BlurView
        style={{...StyleSheet.absoluteFillObject}}
        blurType="dark"
        blurAmount={10}
        blurRadius={10}
        reducedTransparencyFallbackColor="white"
      />}
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
          errorMessage={ errorMessage}
          defaultValue={selectedDate} // Display the selected date
          onPress={() => openDatePicker()} // Open date picker
        />
      </View>

      <Button
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />

      {isShown && (
        <DateBottomSheet
          // ref={bottomSheetRef}
          snapPoints={['50%']} // Adjustable snap points
          onClose={() => setIsShown(false)}
          backgroundColor={COLORS.white}
          indicatorColor={COLORS.lighter_gray}
          children={
            <DatePickerComponent
              date={date}
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
