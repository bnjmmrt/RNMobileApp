import React, { useRef, forwardRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import BottomSheetComponent from '../BottomSheet/AppBottomSheet';
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
        enablePanDownToClose={true}
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
          <View style={{height: 5}}/>
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
    marginTop:verticalMarginScale(8)
  },
  title: {
    fontSize: fontScale(24),
    textAlign: 'center',
    fontWeight:'700',
    color:COLORS.black,
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
    alignSelf: 'center'

  },
});

export default EditPictureBottomSheet;
