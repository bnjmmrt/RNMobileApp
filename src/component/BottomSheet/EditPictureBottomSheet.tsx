import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { COLORS } from '../../utils/constants';
import { fontFamily, removeSignature } from '../../utils/functions';
import BottomSheetComponent, {
  BottomSheetMethods,
} from '../BottomSheet/AppBottomSheet';
import Button from '../Button';

interface EditPictureBottomSheetProps {
  onPress: () => void;
  onPencilClick?: () => void;
  title?: string;
  submitButtonText: string;
  cancelButtonText: string;
  snapPoints: any;
  image: any | null;
  eventImage?: string;
}
const EditPictureBottomSheet = forwardRef<
  BottomSheetMethods,
  EditPictureBottomSheetProps
>((props, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);
  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const cancelClick = () => {
    sheetRef?.current?.close();
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={props.snapPoints}
      onClose={() => console.log(ref)}>
      <View style={styles.container}>
        {props.title && <Text style={styles.title}>{props.title}</Text>}

        {props.image && (
          <View style={styles.profilePhotoContainer}>
            <Image
              style={styles.profilePhotoContainer}
              source={{ uri: props.image }}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={props.onPencilClick}>
              <Image
                resizeMode="contain"
                source={IMAGES.pencil}
                style={styles.ic_pencil}
              />
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 5 }} />
        {props?.eventImage && (
          <FastImage
            source={{
              uri: removeSignature(props?.eventImage),
            }}
            resizeMode={FastImage.resizeMode.cover}
            style={styles.coverImageStyle}
          />
        )}
        <View style={{ height: 5 }} />
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
          textStyle={{ color: '#000' }}
        />
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    // gap: 8,
  },
  btnStyle: {
    borderRadius: fontScale(100),
    height: 48,
  },
  clearButton: {
    borderWidth: 2,
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
    marginTop: verticalMarginScale(8),
  },
  title: {
    fontSize: fontScale(24),
    textAlign: 'center',
    // fontWeight:'700',
    color: COLORS.black,
    paddingBottom: verticalMarginScale(16),
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  profilePhotoContainer: {
    height: 196,
    width: 196,
    borderRadius: 100,
    borderWidth: 1,
    backgroundColor: COLORS.tabBorderColor,
    borderColor: COLORS.borderGray,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 50,
    width: 40,
    height: 40,
    position: 'absolute',
    right: 5,
    bottom: 15,
  },
  ic_pencil: {
    height: verticalScale(16),
    width: horizontalScale(16),
    tintColor: COLORS.white,
  },
  coverImageStyle: {
    marginVertical: verticalMarginScale(20),
    backgroundColor: COLORS.borderGray,
    borderRadius: 20,
    height: verticalScale(348),
    width: horizontalScale(238),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    alignSelf: 'center',
  },
});

export default EditPictureBottomSheet;
