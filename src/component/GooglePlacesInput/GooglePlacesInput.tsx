import React from 'react';
import {StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {COLORS} from '../../utils/constants';
import {Address} from '../../redux/slices/appFlowSlice';

interface GooglePlacesInputProps {
  setLocation: (location: Address) => void;
}
const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({setLocation}) => {
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
        console.log("data.placeId",data, data.place_id);
        const address: Address = {
          address: data.description,
          placeId: data.place_id,
        };
        setLocation(address);
      }}
      query={{
        key: 'AIzaSyAVGqg6utoXhEejF1ZFo-hvKEInA8KbcO8',
        language: 'en',
      }}
    />
  );
};

const styles = StyleSheet.create({
  input: {},
});
export default GooglePlacesInput;
