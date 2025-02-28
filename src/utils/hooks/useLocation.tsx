import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import { environment } from '../../../environments/environment';

const useLocation = (autoFetchLocation: boolean) => {
  const [hasLocationPermission, setHasLocationPermission] =
    useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null);

  const checkLocationPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);

    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available on this device or OS.');
        setHasLocationPermission(false);
        break;
      case RESULTS.DENIED:
        console.log('Permission has not been requested / is denied.');
        setHasLocationPermission(false);
        break;
      case RESULTS.GRANTED:
        console.log('Permission is granted.');
        setHasLocationPermission(true);
        break;
      case RESULTS.BLOCKED:
        console.log('Permission is denied and cannot be requested (blocked).');
        setHasLocationPermission(false);
        break;
    }
  };

  const requestLocationPermission = async () => {
    let status;

    if (Platform.OS === 'ios') {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    if (status === RESULTS.GRANTED) {
      setHasLocationPermission(true);
    } else {
      console.log(
        'Location permission denied. Location permission is required for the app to function correctly. Please enable it in settings.',
      );
      Alert.alert(
        'Permission Required',
        'We need access to your location to provide accurate results and personalized services. Please enable location permissions in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: async () => {
              openSettings();
              await checkLocationPermission();
            },
          },
        ],
      );
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${environment.PLACES_API_KEY}`;
    const defaultResponse = {
      formatted_address: latitude.toFixed(2) + ', ' + longitude.toFixed(2),
      place_id: null,
    };

    try {
      const response = await axios.get(geocodeUrl);
      if (response.data.status === 'OK') {
        return {
          formatted_address: response.data.results[0].formatted_address,
          place_id: response.data.results[0].place_id,
        };
      } else {
        return defaultResponse;
      }
    } catch (error) {
      return defaultResponse;
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async position => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const formatted_address = await getAddressFromCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );
        setCurrentAddress(formatted_address.formatted_address);
        setCurrentPlaceId(formatted_address.place_id);
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert('Error getting location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const initiateLocationFetch = () => {
    requestLocationPermission();
  };

  useEffect(() => {
    if (autoFetchLocation) {
      requestLocationPermission();
    }
  }, []);

  useEffect(() => {
    if (hasLocationPermission) {
      getCurrentLocation();
    }
  }, [hasLocationPermission]);

  return {
    hasLocationPermission,
    currentLocation,
    currentAddress,
    currentPlaceId,
    initiateLocationFetch,
  };
};

export default useLocation;
