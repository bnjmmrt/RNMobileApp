import React from 'react';
import { StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS } from '../../utils/constants';

interface GooglePlacesInputProps{
  setLocation:(location:string)=>void
}
const GooglePlacesInput: React.FC<GooglePlacesInputProps>= ({setLocation}) => {

  return (
    <GooglePlacesAutocomplete
    styles={{
      textInputContainer: {
        borderRadius:8,
       borderWidth:2, 
       borderColor:COLORS.borderGray
      },
     
    }}
      placeholder='Search Location'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        setLocation(data.description)
      }}
      query={{
        key: 'AIzaSyAVGqg6utoXhEejF1ZFo-hvKEInA8KbcO8',
        language: 'en',
      }}
      
    />
  );
};


const styles=StyleSheet.create({
  input:{

  }
})
export default GooglePlacesInput;