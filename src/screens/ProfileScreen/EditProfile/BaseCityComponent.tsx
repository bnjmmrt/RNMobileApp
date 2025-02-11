import React, {forwardRef, useImperativeHandle, useState} from 'react';
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
import {fontScale, horizontalMarginScale, radiusScale, verticalScale, Wp} from '../../../utils/dimensions';

interface BaseCityComponentProps {}

const BaseCityComponent =forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.appFlowApiData.profileData?.address);
  //need to get from store when response updated in api
  const [selectedCity, setSelectedCity] = useState<Address>({"placeId": "ChIJkbeSa_BfYzARphNChaFPjNc",address:'India'});

  const [isShown, setIsShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  useImperativeHandle(ref, () => ({
    validateBaseCity,
     selectedCity
    }));

  // Validate inputs
  const validateBaseCity = () => {
    if (!selectedCity?.address) {
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
            defaultValue={selectedCity?.address}
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
});

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height:verticalScale(60),
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius:radiusScale(100),
  },
  contentContainer: {
    flex: 1,
    paddingVertical:horizontalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  spacer: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    height:verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:horizontalMarginScale(15),
  },
  searchImage: {marginRight: horizontalMarginScale(6)},
  input: {
    width: '90%',
    fontSize:fontScale(16),
    color: COLORS.white,
  },
});

export default BaseCityComponent;
