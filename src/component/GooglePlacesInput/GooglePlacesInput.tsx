import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useDispatch } from 'react-redux';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import useLocation from 'src/utils/hooks/useLocation';
import { environment } from '../../../environments/environment';
import IMAGES from '../../assets/images';
import { Address, setBaseCity } from '../../redux/slices/appFlowSlice';
import { COLORS } from '../../utils/constants';

interface GooglePlacesInputProps {
  setLocation: (location: Address) => void;
  submit: () => void;
  errorMessage?: string | null;
  setError?: (error: string | null) => void;
  defaultValue?: string;
  toggleLocationPicker?: () => void;
  allowFullAddres?: boolean;
  autoFetchCurrentLocation?: boolean;
  fetchTimezone?: boolean;
}
const GooglePlacesInput: React.FC<GooglePlacesInputProps> = ({
  setLocation,
  submit,
  defaultValue,
  errorMessage,
  setError,
  toggleLocationPicker,
  allowFullAddres,
  autoFetchCurrentLocation,
  fetchTimezone,
}) => {
  const googlePlacesRef = useRef<GooglePlacesAutocompleteRef>(null);
  const {
    currentAddress,
    currentPlaceId,
    hasLocationPermission,
    currentLocation,
    initiateLocationFetch,
  } = useLocation(false);
  const dispatch = useDispatch();
  const { updateKeyboardStatus } = useKeyboard(googlePlacesRef);

  const inputTextRef = useRef<string>('');
  const [clearBtnShown, setClearBtnShown] = useState(false);
  useEffect(() => {
    if (
      // hasLocationPermission &&
      currentAddress &&
      currentLocation &&
      currentPlaceId
    ) {
      const address: Address = {
        address: currentAddress,
        placeId: currentPlaceId,
        latitude: String(currentLocation.latitude) || '',
        longitude: String(currentLocation.longitude) || '',
      };
      setLocation(address);
      setError && setError(null);
      toggleLocationPicker && toggleLocationPicker();
      submit();
      googlePlacesRef?.current &&
        googlePlacesRef?.current?.setAddressText(currentAddress);
    }
  }, [hasLocationPermission, currentAddress, currentLocation, currentPlaceId]);

  useEffect(() => {
    if (!defaultValue) {
      if (autoFetchCurrentLocation) {
        initiateLocationFetch();
      }
    } else {
      googlePlacesRef?.current &&
        googlePlacesRef?.current?.setAddressText(defaultValue);
    }
  }, [autoFetchCurrentLocation, defaultValue]);

  const handleClearText = () => {
    setLocation({ address: '', placeId: '', latitude: '', longitude: '' });
    dispatch(setBaseCity({ address: '', placeId: '' }));
    googlePlacesRef?.current?.setAddressText('');
    setError && setError(null);
  };

  return (
    <>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        styles={{
          textInputContainer: {
            borderRadius: radiusScale(8),
            borderWidth: 1,
            height: 56,
            borderColor: errorMessage ? COLORS.borderRed : COLORS.borderGray,
            backgroundColor: errorMessage ? COLORS.bgRed : COLORS.white,
            paddingVertical: verticalMarginScale(18),
            paddingHorizontal: horizontalMarginScale(18),
          },
          textInput: {
            bottom: verticalMarginScale(13),
            fontSize: fontScale(14),
            fontFamily: fontFamily.ABCDiatype_Regular,
            paddingLeft: 4,
            backgroundColor: errorMessage ? COLORS.bgRed : COLORS.white,
          },
          listView: {
            borderRadius: radiusScale(8),
            borderWidth: 1,
            borderColor: COLORS.borderGray,
            marginTop: 5,
          },
          separator: { height: 0 },
          container: { flex: 0 },
        }}
        minLength={3}
        enablePoweredByContainer={false}
        placeholder="Search for a Location..."
        onPress={async (
          data: GooglePlaceData,
          detail: GooglePlaceDetail | null,
        ) => {
          // console.log('data.data', JSON.stringify(data));
          // console.log('data.detail', JSON.stringify(detail));
          const address: Address = {
            address: data.description,
            placeId: data.place_id,
            latitude: detail ? String(detail?.geometry?.location?.lat) : '',
            longitude: detail ? String(detail?.geometry?.location?.lng) : '',
          };
          if (detail?.address_components) {
            let city = '';
            detail?.address_components.forEach(component => {
              const types = component.types;

              if (types.includes('locality')) {
                city = component.long_name;
              }
            });
            if (city) {
              address.city = city;
            }
          }
          if (fetchTimezone) {
            const timestamp = Math.floor(Date.now() / 1000);
            const timeZoneResponse = await axios.get(
              `https://maps.googleapis.com/maps/api/timezone/json`,
              {
                params: {
                  location: `${address?.latitude},${address?.longitude}`,
                  timestamp: timestamp,
                  key: environment.PLACES_API_KEY,
                },
              },
            );

            if (timeZoneResponse.data.status == 'OK') {
              const timeZoneData = {
                timeZoneId: timeZoneResponse.data.timeZoneId,
                timeZoneName: timeZoneResponse.data.timeZoneName,
              };
              address.timeZone = timeZoneData;
            }
          }
          setLocation(address);
          setError && setError(null);
          toggleLocationPicker && toggleLocationPicker();
          submit();
          inputTextRef.current = data.description;
          // setClearBtnShown(true);
        }}
        fetchDetails={true}
        query={{
          key: environment.PLACES_API_KEY,
          language: 'en',
          types: allowFullAddres ? 'geocode' : '(cities)',
        }}
        renderLeftButton={() => (
          <View style={styles.iconContainer}>
            <Image
              source={
                defaultValue
                  ? IMAGES.location
                  : errorMessage
                  ? IMAGES.search_error
                  : IMAGES.search
              }
              style={styles.leftImage}
            />
          </View>
        )}
        renderRightButton={() => (
          <TouchableOpacity
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
            style={styles.iconContainer}
            onPress={handleClearText}>
            {clearBtnShown && inputTextRef.current && (
              <Image source={IMAGES.clear} style={styles.leftImage} />
            )}
          </TouchableOpacity>
        )}
        disableScroll={false}
        textInputProps={{
          clearButtonMode: 'never',
          autoCorrect: false,
          onBlur: () => {
            updateKeyboardStatus(false);
            setClearBtnShown(false);
          },
          onFocus: () => {
            updateKeyboardStatus(true);
            setClearBtnShown(true);
          },
          onChangeText: text => {
            if (inputTextRef.current === text) return;
            inputTextRef.current = text;
            if (!text) {
              setLocation({
                address: '',
                placeId: '',
                latitude: '',
                longitude: '',
              });
              dispatch(setBaseCity({ address: '', placeId: '' }));
              googlePlacesRef?.current?.setAddressText('');
              setError && setError(null);
            }
          },
        }}
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
    // width: verticalScale(16),
    // height: verticalScale(16),
    resizeMode: 'contain',
  },
  errorText: {
    fontSize: fontScale(12),
    color: COLORS.errorText,
    marginTop: verticalMarginScale(5),
    // bottom: Platform.OS === 'android' ? '67%' : '64%',
  },
});
export default GooglePlacesInput;
