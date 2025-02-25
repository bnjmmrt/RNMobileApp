import React, { useEffect, useRef } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import { environment } from '../../../environments/environment';
import IMAGES from '../../assets/images';
import { Address } from '../../redux/slices/appFlowSlice';
import { COLORS } from '../../utils/constants';
const { height } = Dimensions.get('window');

interface GooglePlacesInputProps {
  setLocation: (location: Address) => void;
  submit: () => void;
  errorMessage?: string | null;
  setError?: (error: string | null) => void;
  defaultValue?: string;
}
const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setLocation,
  submit,
  defaultValue,
  errorMessage,
  setError,
}) => {
  const googlePlacesRef = useRef(null);

  useEffect(() => {
    
    if (defaultValue) {
      googlePlacesRef?.current &&
        googlePlacesRef?.current?.setAddressText(defaultValue);
    }

    if(googlePlacesRef?.current?.isFocused()){
      // setError(null)
    }
  }, [googlePlacesRef?.current]);
  return (
    <>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        styles={{
          textInputContainer: {
            borderRadius: radiusScale(8),
            borderWidth: 2,
            height: 60,
            borderColor: errorMessage ? COLORS.borderRed : COLORS.borderGray,
            paddingVertical: verticalMarginScale(18),
            paddingHorizontal: horizontalMarginScale(18),
          },
          textInput: {
            // height: '100%',
            // marginTop: 0,
            bottom: verticalMarginScale(13),
            fontSize: fontScale(14),
            fontFamily: fontFamily.ABCDiatype_Regular,
          },
          listView:{
            // height:200,
            backgroundColor:"red"
          }
        }}
        minLength={3}
        enablePoweredByContainer={false}
        placeholder="Search Location"
        onPress={(data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
          // 'details' is provided when fetchDetails = true
          // console.log('data.placeId', detail);
          const address: Address = {
            address: data.description,
            placeId: data.place_id,
            latitude: detail ? String(detail?.geometry?.location?.lat) : '',
            longitude: detail ? String(detail?.geometry?.location?.lng) : '',
          };
          setLocation(address);
          setError(null);
          submit();
        }}
        
        fetchDetails={true}
        query={{
          key: environment.PLACES_API_KEY,
          language: 'en',
          types: '(cities)',
        }}
        renderLeftButton={() => (
          <View style={styles.iconContainer}>
            <Image source={IMAGES.location} style={styles.leftImage} />
          </View>
        )}
        disableScroll={false}
      />
      {errorMessage && <Text style={[styles.errorText]}>{errorMessage}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {},
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 10,
    // marginBottom: 3,
  },
  leftImage: {
    width: verticalScale(16),
    height: verticalScale(16),
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: fontScale(12),
    color: COLORS.errorText,
    marginTop: verticalMarginScale(5),
    bottom: Platform.OS === 'android' ? '67%' : '64%',
  },
});
export default GooglePlacesInput;
