import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  LABLE,
  BUTTON_LABLE,
  ERROR_MESSAGE,
  COLORS,
} from '../../../utils/constants';

import IMAGES from '../../../assets/images';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../redux/slices';
import {Address} from '../../../redux/slices/appFlowSlice';
import LocationPickerModal from '../../../component/BottomSheet/LocationPickerModal';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import {Wp} from '../../../utils/dimensions';

interface BaseCityComponentProps {}

const BaseCityComponent: React.FC<BaseCityComponentProps> = () => {
  const dispatch = useDispatch();
  const baseCity = useSelector((state: RootState) => state.appFlow.baseCity);
  const [selectedCity, setSelectedCity] = useState<Address>(baseCity);

  const [isShown, setIsShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate inputs
  const validateInputs = () => {
    if (!selectedCity.address) {
      setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BASE_CITY);
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const openLocationPicker = () => {
    console.log('clicked');
    setIsShown(!isShown);
  };

  return (
    <>
     
        <TouchableOpacity onPress={openLocationPicker}>
          <CustomSelectableText
            placeholder={LABLE.SEARCH_FOR_A_LOCATION}
            leftImage={IMAGES.search}
            errorMessage={errorMessage}
            defaultValue={selectedCity.address}
            onPress={openLocationPicker}
            style={styles.container}
          />
        </TouchableOpacity>

        {isShown && (
          <LocationPickerModal
            setLocation={setSelectedCity}
            setIsShown={setIsShown}
          />
        )}
    
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: 60,
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  spacer: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchImage: {marginRight: 6},
  input: {
    width: '90%',
    fontSize: 16,
    color: COLORS.white,
  },
});

export default BaseCityComponent;
