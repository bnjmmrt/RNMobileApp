import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import useApi from 'src/axios/useApi';
import { BUTTON_LABLE, COLORS, editEventsTab, ERROR_MESSAGE, EVENT, LABLE } from 'src/utils/constants';
import { EndPoint } from 'src/ApiManager/config';
import Input from 'src/component/Input/Input';
import DatePickerComponent from '../ProfileScreen/EditProfile/DatePickerComponent';
import Button from 'src/component/Button';
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import BaseCityComponent from '../ProfileScreen/EditProfile/BaseCityComponent';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { Image } from 'react-native-animatable';
import CircleButtonOverlay from 'src/component/BackButton/CircleButtonOverlay';
import { CustomText } from 'src/component/CustomText';
import MapView from 'react-native-maps';
import { Address } from 'src/redux/slices/appFlowSlice';
import MapComponent from 'src/component/MapComponent';
import EventTalent from 'src/component/Event/EventTalent';
import HostEventTalent from 'src/component/Event/HostEventTalent';
import EditPictureBottomSheet from 'src/component/BottomSheet/EditPictureBottomSheet';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { environment } from 'environments/environment';


interface Location {
  location?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  placeId?: string
}

interface EventItem {
  startDate?: string;
  id?: string;
  endDate?: string;
  imageCover?: string;
  imageFlyer?: string;
  location?: Location;
  currentGuestStatus?: string;
  description?: string;
  showLocation?: boolean;
  name: string;
  furtherInstructions: string;
  talents: []
}

interface EditEventDetailsProps {
  item: EventItem;
}

const EditEventDetails: React.FC<EditEventDetailsProps> = ({
  item,
}) => {

  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const [showAddress, setshowAddress] = useState(item?.showLocation || false);

  const latitude = item?.location?.latitude ?? 37.78825;
  const longitude = item?.location?.longitude ?? -122.4324;
  const address: Address = {
    placeId: item?.location?.placeId || '',
    address: item?.location?.location || '',
  };
  const profileData = useSelector(
    (state: RootState) => state.appFlowApiData?.profileData,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  const eventNameRef = useRef<any>(null);
  const furtherInstructioneRef = useRef<any>(null);
  const eventDescriptionRef = useRef<any>(null);
  const baseCityRef = useRef<any>(null);
  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);
  const editPhotoBottomSheetRef = useRef<any>(null);


  const [eventName, setEventName] = useState(item?.name || '');
  const [startDate, setStartDate] = useState(item.startDate);
  const [endDate, setEndDate] = useState(item.endDate);
  const [furtherInstructions, setFurtherInstructions] = useState(item?.furtherInstructions || '');
  const [eventDescription, setEventDescription] = useState(item?.description || '');
  const [featureTalent, setFeatureTalent] = useState(item?.talents || []);
  const [image, setImage] = useState<string>(item?.imageCover || item?.imageFlyer || '');

  console.log("Sayyed item:", item)
  const onConfirmClick = async () => {
    if (
      eventNameRef.current.validateInputs() &&
      eventDescriptionRef.current.validateInputs() &&
      startDateRef.current.validateBirthDate() &&
      baseCityRef.current.validateBaseCity()
    ) {
      const requestObject: any = {
        address: {
          address: baseCityRef.current.selectedCity.address,
          city: '',
          latitude: '',
          longitude: '',
          placeId: baseCityRef.current.selectedCity.placeId,
          regionCode: '',
        },
        firstName: eventNameRef.current.inputText,
        lastName: eventDescriptionRef.current.inputText,
      };
      console.log('requestObject', requestObject);

      const response: any = await apiRequest(
        'put',
        EndPoint.user_profile + userId,
        requestObject,
      );
      if (response.status === 200) {
        const responseUser: any = await apiRequest(
          'get',
          EndPoint.user + userId,
        );
        if (responseUser.status === 200) {
          dispatch(setProfileData(responseUser?.data));
        }
        FlashMessageComponent.show('success', 'Profile Updated Successfully');
        handleBackPress();
      }
    }
  };

  const handleBackPress = () => {
    //navigation.goBack()
  };


  const uploadFile = async (image: string) => {
    const mimeType = `images/${image.split('.').pop()}`;
    const fileName = image.split('/').pop();

    const formData = new FormData();
    formData.append('file', {
      uri: image,
      type: mimeType,
      name: fileName,
    });

    return await apiRequest('post', EndPoint.file_upload, formData, null, {
      'Content-Type': 'multipart/form-data',
    });
  };

  const savePhoto = async (image: string) => {
    if (image) {
      // setIsToastShown(false);
      const response: any = await uploadFile(image);
      console.log('savePhoto', response);
      if (response.status === 200) {
        // setIsToastShown(false);
        // const imageUrl =environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
        // if (role.toLocaleLowerCase() === 'host') {
        //   await updateHostProfilePhoto(imageUrl)
        // } else {
        //   await updateProfilePhoto(imageUrl)
        // }
      } else {
        //display error
      }
    }
  };

  const openCamera = async () => {
    editPhotoBottomSheetRef.current?.close();
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: false,
    }).then((image: ImageOrVideo) => {
      setImage(image.path);
      savePhoto(image.path)
    });
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>

          <View>
            <FastImage
              source={{
                uri: image,
              }}
              resizeMode={FastImage.resizeMode.cover}
              defaultSource={IMAGES.eventCoverPlaceholders1} // Placeholder
              style={styles.coverImageStyle}
            />

            <CircleButtonOverlay onPress={() => { editPhotoBottomSheetRef.current?.open() }} />

          </View>



          <Input
            ref={eventNameRef}
            label={EVENT.EVENT_NAME}
            errorMessage={ERROR_MESSAGE.FIRST_NAME}
            defaultValue={item?.name}
          />


          <View>
            <CustomText style={[styles.label]}>{EVENT.START_DATE}</CustomText>
            <DatePickerComponent ref={startDateRef} birthDate={profileData.dateOfBirth} />

            <CustomText style={[styles.label]}>{EVENT.END_DATE}</CustomText>
            <DatePickerComponent ref={endDateRef} birthDate={profileData.dateOfBirth} />

          </View>

          <View>
            <CustomText style={[styles.label]}>{EVENT.LOCATION}</CustomText>
            <BaseCityComponent ref={baseCityRef} location={address} />
          </View>

          <View style={{ flex: 1, flexDirection: 'row', marginTop: verticalMarginScale(24) }}>

            <TouchableOpacity style={{ paddingEnd: 10 }} onPress={() => setshowAddress(!showAddress)}>
              <Image
                source={
                  showAddress ? IMAGES.checkbox_active : IMAGES.checkbox_inactive
                }
              />
            </TouchableOpacity>
            <CustomText style={{ alignSelf: 'center' }}>{EVENT.HIDE_ADDRESS}</CustomText>

          </View>

          <Input
            ref={furtherInstructioneRef}
            label={EVENT.FURTHER_INSTRUCTION}
            errorMessage={ERROR_MESSAGE.LAST_NAME}
            defaultValue={item?.furtherInstructions}
          />

          <View style={styles.mapContainer}>
            <MapComponent item={item} />
          </View>

          <Input
            ref={eventDescriptionRef}
            label={EVENT.EVENT_DESCRIPTION}
            errorMessage={ERROR_MESSAGE.LAST_NAME}
            defaultValue={item?.description}
            multiline={true}
          />

          <HostEventTalent talents={item?.talents} />

        </View>



      </ScrollView>

      <EditPictureBottomSheet
        ref={editPhotoBottomSheetRef}
        onPress={openCamera}
        submitButtonText={BUTTON_LABLE.REPLACE_PHOTO}
        cancelButtonText={BUTTON_LABLE.CANCEL}
        snapPoints={[Platform.OS == 'android' ? '20%' : '20%']}
        image={null}
        onPencilClick={openCamera}
      />

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.CONFIRM}
        colorTheme="dark"
        onPress={onConfirmClick}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: 20
  },
  mapContainer: {
    marginTop: verticalMarginScale(24)
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  coverImageStyle: {
    marginBottom: verticalMarginScale(20),
    backgroundColor: COLORS.borderGray,
    borderRadius: 20,
    height: verticalScale(348),
    width: horizontalScale(238),
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
    alignSelf: 'center'

  },
  btnStyle: {
    borderRadius: radiusScale(100),
    bottom: verticalMarginScale(20),
  },
  contentContainer: {
    flex: 1
  },
  scrollContainer: { paddingBottom: verticalMarginScale(40) },
  label: {
    // paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    marginBottom: verticalMarginScale(5),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default EditEventDetails;
