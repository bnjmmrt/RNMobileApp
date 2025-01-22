import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS } from '../../utils/constants';
import { Address } from '../../redux/slices/appFlowSlice';
import { environment } from '../../../environments/environment';
import IMAGES from '../../assets/images';

interface GooglePlacesInputProps {
  setLocation: (location: Address) => void;
  submit: () => void;
}
const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({ setLocation, submit }) => {
  return (
    <GooglePlacesAutocomplete
      styles={{
        textInputContainer: {
          borderRadius: 8,
          borderWidth: 2,
          borderColor: COLORS.borderGray,

        },

      }}
      placeholder="Search Location"
      onPress={(data: any, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log("data.placeId", data, data.place_id);
        const address: Address = {
          address: data.description,
          placeId: data.place_id,
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
    />
  );
};

const styles = StyleSheet.create({
  input: {},
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginBottom: 3,
  },
  leftImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
export default GooglePlacesInput;
