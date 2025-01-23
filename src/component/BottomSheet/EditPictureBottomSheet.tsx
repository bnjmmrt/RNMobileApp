import React, {useRef, forwardRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import {COLORS} from '../../utils/constants';
import Button from '../Button';
import { fontFamily } from '../../utils/functions';

interface EditPictureBottomSheetProps {
  onPress: () => void;
  title?: string;
  submitButtonText: string;
  cancelButtonText: string;
  snapPoints:any
}
const EditPictureBottomSheet = forwardRef(
  (props: EditPictureBottomSheetProps, ref) => {
    const inputRef = useRef(null);
    //   const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();

    const cancelClick = () => {
      ref.current?.close();
    };

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={props.snapPoints}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          {props.title && <Text style={styles.title}>{props.title}</Text>}
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={props.submitButtonText}
            colorTheme="dark"
            onPress={props.onPress}
          />
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={props.cancelButtonText}
            colorTheme="dark"
            onPress={cancelClick}
            clearButtonStyle={styles.clearButton}
            textStyle={{color: '#000'}}
          />
        </View>
      </BottomSheetComponent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  btnStyle: {
    borderRadius: 100,
  },
  clearButton: {
    borderWidth: 1,
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
  },
  title: {
    fontSize: 24,
    fontFamily:fontFamily.RomieTrial_Bold,
    textAlign:"center"
  },
});

export default EditPictureBottomSheet;
