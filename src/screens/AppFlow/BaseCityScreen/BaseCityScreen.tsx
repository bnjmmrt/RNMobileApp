import React, { useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LABLE, BUTTON_LABLE, ERROR_MESSAGE, COLORS } from '../../../utils/constants';
import BaseCityScreenStyles from './BaseCityScreenStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import IMAGES from '../../../assets/images';
import Input from '../../../component/Input/Input';
import Header from '../../../component/Header/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/slices';
import { setBaseCity, setPageProgress } from '../../../redux/slices/appFlowSlice';
import GooglePlacesInput from '../../../component/GooglePlacesInput/GooglePlacesInput';
import BottomSheetComponent from '../../../component/BottomSheet/BottomSheet';
import LocationPickerModal from '../../../component/BottomSheet/Modal';



interface BaseCityScreenProps extends NativeStackScreenProps<any, any> { }

const BaseCityScreen: React.FC<BaseCityScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);
  const styles = BaseCityScreenStyles();
  const baseCityRef = useRef<any>(null);
  const bottomSheetRef = useRef<any>(null);
  const [isShown, setIsShown] = useState(false);

  const onNextClick = () => {
  
    if(baseCityRef.current.validateInputs()){
      dispatch(setBaseCity(baseCityRef.current.inputText))
      dispatch(setPageProgress(6))
     navigation.navigate('CreativeFocusScreen');
    }
     
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(4));
    navigation.navigate('BirthdayScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={LABLE.BASE_CITY} onPress={handleBackPress} />

      <View style={styles.contentContainer}>
        <Title
          title={LABLE.WHERE_DO_YOU_CALL_HOME}
          subTitle={LABLE.WE_WILL_RECOMMEND_EVENTS_AND_EXPERIENCES_NEAR_YOU}
        />
        <TouchableOpacity onPress={()=>setIsShown(true)}>
        <Input
          ref={baseCityRef}
          placeholder={LABLE.SEARCH_FOR_A_LOCATION}
          leftImage={IMAGES.search}
          errorMessage={ERROR_MESSAGE.PLEASE_ENTER_YOUR_BASE_CITY}
          defaultValue={baseCity}
        />
        </TouchableOpacity>

{isShown && (
        // <BottomSheetComponent
        //   ref={bottomSheetRef}
        //   snapPoints={['100%']} // Adjustable snap points
        //   onClose={() => setIsShown(false)}
        //   backColor={COLORS.white}
        //   children={
        //     <GooglePlacesInput/>
        //   }
        // />
        <LocationPickerModal/>
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
