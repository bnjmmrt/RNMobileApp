import React, { useRef } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import IMAGES from '../../../assets/images';
import BirthdayScreenStyles from './BirthdayScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import { LABLE, BUTTON_LABLE, ERROR_MESSAGE } from '../../../utils/constants';
import Input from '../../../component/Input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setBirthday, setPageProgress } from '../../../redux/slices/appFlowSlice';

interface BirthdayScreenProps extends NativeStackScreenProps<any, any> { }

const BirthdayScreen: React.FC<BirthdayScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const birthday = useSelector((state: RootState) => state.appFlow.birthday);
  const styles = BirthdayScreenStyles();
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const birthdayRef = useRef<any>(null);

  const onNextClick = () => {
    birthdayRef.current && birthdayRef.current.handleNextPress();
     dispatch(setBirthday(birthdayRef.current.inputText));
     dispatch(setPageProgress(5));
    navigation.navigate('BaseCityScreen');
  };

  const handleBackPress = () => navigation.goBack();

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
        <Input
          ref={birthdayRef}
          placeholder={LABLE.DATE_PLACEHOLDER}
          leftImage={IMAGES.calender}
          rightImage={IMAGES.downArrow}
          errorMessage={ERROR_MESSAGE.PLEASE_ENTER_YOUR_BIRTHDAY}
          onPressImage={() => {
            console.log('handle datepicker click');
          }}
          defaultValue={birthday}
        />
      </View>

      <Button
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default BirthdayScreen;
