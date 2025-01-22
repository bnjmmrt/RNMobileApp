import React, {useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
} from '../../../utils/constants';
import BaseCityScreenStyles from './BaseCityScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import IMAGES from '../../../assets/images';
import Header from '../../../component/Header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {Address, setBaseCity, setPageProgress} from '../../../redux/slices/appFlowSlice';
import BottomSheetComponent from '../../../component/BottomSheet/BottomSheet';
import LocationPickerModal from '../../../component/BottomSheet/Modal';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';

interface BaseCityScreenProps extends NativeStackScreenProps<any, any> {}

const BaseCityScreen: React.FC<BaseCityScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);
  const [selectedCity, setSelectedCity] = useState<Address>(baseCity);
 
  const styles = BaseCityScreenStyles();
  const [isShown, setIsShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onNextClick = () => {

    console.log("selectedCity",selectedCity)
    if (validateInputs()) {
      dispatch(setBaseCity(selectedCity));
      dispatch(setPageProgress(6));
      navigation.navigate('CreativeFocusScreen');
    }
  };
  // Validate inputs
  const validateInputs = () => {
    if (!selectedCity) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BASE_CITY);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(4));
    navigation.navigate('BirthdayScreen');
  };

  const openLocationPicker = () => {
    console.log("clicked")
    setIsShown(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.BASE_CITY} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHERE_DO_YOU_CALL_HOME}
          subTitle={LABLE.WE_WILL_RECOMMEND_EVENTS_AND_EXPERIENCES_NEAR_YOU}
        />
        <TouchableOpacity onPress={openLocationPicker}>
          <CustomSelectableText
            placeholder={LABLE.SEARCH_FOR_A_LOCATION}
            leftImage={IMAGES.search}
            errorMessage={errorMessage}
            defaultValue={selectedCity.address}
            onPress={openLocationPicker}
          />
        </TouchableOpacity>

        {isShown && (  <LocationPickerModal setLocation={setSelectedCity}  />
          // <BottomSheetComponent
          //   ref={bottomSheetRef}
          //   snapPoints={['100%']} // Adjustable snap points
          //   onClose={() => setIsShown(false)}
          //   backColor={COLORS.white}
          //   children={
          //     <GooglePlacesInput/>
          //   }
          // />
         
        )}
      </View>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.NEXT}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default BaseCityScreen;
