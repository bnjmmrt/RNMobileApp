import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import type {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';
import {environment} from '../../../environments/environment';
import IMAGES from '../../assets/images';
import {Address} from '../../redux/slices/appFlowSlice';
import {COLORS} from '../../utils/constants';

interface GooglePlacesInputProps {
  setLocation: (location: Address) => void;
  submit: () => void;
}
const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setLocation,
  submit,
}) => {
  return (
    <GooglePlacesAutocomplete
      styles={{
        textInputContainer: {
          borderRadius: radiusScale(8),
          borderWidth: 2,
          borderColor: COLORS.borderGray,
          paddingVertical: verticalMarginScale(18),
          paddingHorizontal: horizontalMarginScale(18),
        },
        textInput: {
          height: '100%',
          marginTop: 0,
          marginBottom: 0,
          fontSize: fontScale(14),
          fontFamily: fontFamily.ABCDiatype_Regular,
        },
      }}
      enablePoweredByContainer={false}
      placeholder="Search Location"
      onPress={(data: GooglePlaceData, detail: GooglePlaceDetail | null) => {
        // 'details' is provided when fetchDetails = true
        // console.log('data.placeId', detail);
        const address: Address = {
          address: data.description,
          placeId: data.place_id,
          latitude: detail ? String(detail?.location?.latitude) : '',
          longitude: detail ? String(detail?.location?.longitude) : '',
        };
        setLocation(address);
        submit();
      }}
      query={{
        key: environment.PLACES_API_KEY,
        language: 'en',
      }}
      renderLeftButton={() => (
        <View style={styles.iconContainer}>
          <Image source={IMAGES.location} style={styles.leftImage} />
        </View>
      )}
      enablePoweredByContainer={false}
    />
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
});
export default GooglePlacesInput;
