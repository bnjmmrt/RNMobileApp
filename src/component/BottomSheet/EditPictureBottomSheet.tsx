import React, { useRef, forwardRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { COLORS } from '../../utils/constants';
import Button from '../Button';
import { fontFamily, removeSignature } from '../../utils/functions';
import { EndPoint } from '../../ApiManager/config';
import useApi from '../../axios/useApi';
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import IMAGES from '@images/index';
import FastImage from '@d11/react-native-fast-image';

interface EditPictureBottomSheetProps {
  onPress: () => void;
  onPencilClick?: () => void;
  title?: string;
  submitButtonText: string;
  cancelButtonText: string;
  snapPoints: any;
  image: any | null;
  eventImage?: string
}
const EditPictureBottomSheet = forwardRef(
  (props: EditPictureBottomSheetProps, ref) => {
    const inputRef = useRef(null);
    // const [image, setImage] = useState<string>(image);
    console.log(props)

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

          {props.image && (
            <View style={styles.profilePhotoContainer}>
              <Image
                style={styles.profilePhotoContainer}
                source={{ uri: props.image }}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.iconContainer} onPress={props.onPencilClick}>
                <Image
                  resizeMode="contain"
                  source={IMAGES.pencil}
                  style={styles.ic_pencil}
                />
              </TouchableOpacity>
            </View>

          )}
          {props?.eventImage &&
            <FastImage
              source={{
                uri: removeSignature(props?.eventImage),
              }}
              resizeMode={FastImage.resizeMode.cover}
              defaultSource={IMAGES.eventCoverPlaceholders1} // Placeholder
              style={styles.coverImageStyle}
            />
          }

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
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
    gap: 8,
  },
  btnStyle: {
    borderRadius: fontScale(100),
    height: 48
  },
  clearButton: {
    borderWidth: horizontalScale(1),
    backgroundColor: COLORS.white,
    borderColor: COLORS.black,
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    textAlign: 'center',
  },
  profilePhotoContainer: {
    height: verticalScale(196),
    width: verticalScale(196),
    borderRadius: radiusScale(100),
    borderWidth: horizontalScale(1),
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
    alignSelf: 'center'

  },
});

export default EditPictureBottomSheet;
