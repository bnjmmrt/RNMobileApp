import React, { forwardRef} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import GooglePlacesInput from '../GooglePlacesInput/GooglePlacesInput';
import { verticalMarginScale } from '../../utils/dimensions';
import { Address } from '../../redux/slices/appFlowSlice';
import BottomSheetComponent from './BottomSheet';

interface LocationPickerBottomSheetProps {
  setLocation: (location: Address) => void;
  setIsShown: (ishown: boolean) => void;
  handleSubmit?: (ishown: boolean) => void;
  submitVisible?: boolean;
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
        snapPoints={[ '95%' ]}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}>
            <GooglePlacesInput
              submit={submit}
              setLocation={props.setLocation}
              toggleLocationPicker={closePicker}
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
