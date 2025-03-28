import React, { forwardRef } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Address } from '../../redux/slices/appFlowSlice';
import { verticalMarginScale } from '../../utils/dimensions';
import GooglePlacesInput from '../GooglePlacesInput/GooglePlacesInput';
import BottomSheetComponent from './BottomSheet';

interface LocationPickerBottomSheetProps {
  setLocation: (location: Address) => void;
  setIsShown: (ishown: boolean) => void;
  handleSubmit?: (ishown: boolean) => void;
  submitVisible?: boolean;
  allowFullAddres?: boolean;
  fetchTimezone?: boolean;
}

const LocationPickerBottomSheet = forwardRef(
  (props: LocationPickerBottomSheetProps, ref) => {
    const submit = () => {
      props.handleSubmit?.(true);
      props.setIsShown(false);
    };
    const closePicker = () => ref?.current && ref?.current?.close();

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={['95%']}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <GooglePlacesInput
              submit={submit}
              setLocation={props.setLocation}
              toggleLocationPicker={closePicker}
              allowFullAddres={props.allowFullAddres}
              fetchTimezone={props.fetchTimezone}
            />
          </KeyboardAvoidingView>
        </View>
      </BottomSheetComponent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    padding: verticalMarginScale(20),
    flex: 1,
  },
});

export default LocationPickerBottomSheet;
