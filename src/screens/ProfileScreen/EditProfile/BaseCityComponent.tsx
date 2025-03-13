import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Address } from '../../../redux/slices/appFlowSlice';
import { LABLE, ERROR_MESSAGE, COLORS } from '../../../utils/constants';
import IMAGES from '../../../assets/images';
import CustomSelectableText from '../../../component/CustomSelectableText/CustomSelectableText';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalScale,
  Wp,
} from '../../../utils/dimensions';
import LocationPickerBottomSheet from 'src/component/BottomSheet/LocationPickerBottomSheet';

interface BaseCityComponentProps {
  location?: Address;
  onLocationSelect?:(value:any)=>void
}

const BaseCityComponent = forwardRef(
  ({ location, onLocationSelect }: BaseCityComponentProps, ref) => {
    console.log('Sayyed my location:', location);
    const defaultAddress: Address = {
      placeId: 'ChIJkbeSa_BfYzARphNChaFPjNc',
      address: 'India',
    };

    // Initialize state with location prop or default address
    const [selectedCity, setSelectedCity] = useState<Address>(
      location || defaultAddress,
    );
    console.log("selectedCityselectedCityselectedCityselectedCityselectedCity",selectedCity)
    const [isShown, setIsShown] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const locationRef = useRef<any>(null);
    // Sync state when location prop changes
    useEffect(() => {
      if (location) {
        setSelectedCity(location);
      }
    }, [location]);

    useEffect(() => {
      onLocationSelect && onLocationSelect(selectedCity)
      setErrorMessage(null);
    }, [selectedCity]);

    useImperativeHandle(ref, () => ({
      validateBaseCity,
      selectedCity,
    }));

    const validateBaseCity = () => {
      if (!selectedCity?.address) {
        setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_YOUR_BASE_CITY);
        return false;
      }
      setErrorMessage(null);
      return true;
    };

    const toggleLocationPicker = () => locationRef?.current?.open();

    return (
      <>
        <TouchableOpacity
          onPress={toggleLocationPicker}
          style={styles.container}>
          <CustomSelectableText
            placeholder={LABLE.SEARCH_FOR_A_LOCATION}
            leftImage={IMAGES.location}
            errorMessage={errorMessage}
            defaultValue={selectedCity?.address}
            onPress={toggleLocationPicker}
          />
        </TouchableOpacity>

        <LocationPickerBottomSheet
          ref={locationRef}
          setLocation={setSelectedCity}
          setIsShown={setIsShown}
          // toggleLocationPicker={toggleLocationPicker}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    height: verticalScale(60),
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: radiusScale(100),
  },
  contentContainer: {
    flex: 1,
    paddingVertical: horizontalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  spacer: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    height: verticalScale(50),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(15),
  },
  searchImage: { marginRight: horizontalMarginScale(6) },
  input: {
    width: '90%',
    fontSize: fontScale(16),
    color: COLORS.white,
  },
});

export default BaseCityComponent;
