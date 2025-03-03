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
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import FeatureTalentBottomSheet from 'src/component/BottomSheet/FeatureTalentBottomSheet';
import moment from 'moment';
import { setRsvpStatus } from 'src/redux/slices/rspvSlice';
import { useNavigation } from '@react-navigation/native';
import { current } from '@reduxjs/toolkit';
import { removeSignature } from 'src/utils/functions';


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
  const { goBack } = useNavigation();
  const [showAddress, setshowAddress] = useState(item?.showLocation || false);
  let today = new Date();
  const [selected, setSelected] = useState<DateType>();
  const [selectedStartDate, setSelectedStartDate] = useState(item?.startDate || '');


  const latitude = item?.location?.latitude ?? 37.78825;
  const longitude = item?.location?.longitude ?? -122.4324;
  const address: Address = {
    placeId: item?.location?.placeId || '',
    address: item?.location?.location || '',
    latitude: item?.location?.latitude || '',
    longitude: item?.location?.longitude || '',
  };
  const [eventAddress, setEventAddress] = useState<Address>(address);
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

  useEffect(() => {
    const formattedStartDate = moment.utc(startDateRef?.current?.selectedDate).format("YYYY-MM-DDTHH:mm:ss[Z]");
    setSelectedStartDate(formattedStartDate);
    console.log("FORMATED START DATE: " + formattedStartDate)
  }, [selectedStartDate])



  const [eventName, setEventName] = useState(item?.name || '');
  const [startDate, setStartDate] = useState(item.startDate);
  const [endDate, setEndDate] = useState(item.endDate);
  const [furtherInstructions, setFurtherInstructions] = useState(item?.furtherInstructions || '');
  const [eventDescription, setEventDescription] = useState(item?.description || '');
  const [featureTalent, setFeatureTalent] = useState(item?.talents || []);
  const [image, setImage] = useState<string>(removeSignature(item?.imageCover) || removeSignature(item?.imageFlyer) || '');
  const rspvStatus = useSelector((state: RootState) => state.rspv.rspvStatus);

  // console.log("Sayyed item:", item)
  const onConfirmClick = async () => {
    // Validate inputs before proceeding
    const isEventNameValid = eventNameRef.current?.validateInputs();
    const isDescriptionValid = eventDescriptionRef.current?.validateInputs();
    const isStartDateValid = startDateRef.current?.validateBirthDate();
    const isEndDateValid = endDateRef.current?.validateBirthDate();
    const isBaseCityValid = baseCityRef.current?.validateBaseCity();

    if (!isEventNameValid || !isDescriptionValid || !isStartDateValid || !isEndDateValid || !isBaseCityValid) {
      FlashMessageComponent.show("error", "Please fill in all required fields correctly.");
      return;
    }
    const formattedStartDate = moment.utc(startDateRef?.current?.selectedDate).format("YYYY-MM-DDTHH:mm:ss[Z]");
    const formattedEndDate = moment.utc(endDateRef?.current?.selectedDate).format("YYYY-MM-DDTHH:mm:ss[Z]");
    const filteredTalent = featureTalent.map(({ id, ...rest }) =>
      rest.action === "create" ? rest : { id, ...rest }
    );
    // Construct the request object
    const requestObject = {
      name: eventNameRef.current.inputText,
      description: eventDescriptionRef.current.inputText,
      eventLocation: {
        city: eventAddress?.address || "",
        latitude: Number(eventAddress?.latitude) || 0,
        location: baseCityRef.current.selectedCity?.address || "",
        longitude: Number(eventAddress?.longitude) || 0,
        placeId: eventAddress?.placeId || "",
      },
      furtherInstructions: furtherInstructioneRef.current.inputText,
      imageFlyer: image,
      talents: filteredTalent,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      showLocation: showAddress

    };

    console.log("Request Payload:", requestObject);

    try {
      const response = await apiRequest("put", EndPoint.edit_event + item.id, requestObject);
      console.log(response, "RESPONSE")
      dispatch(setRsvpStatus("UPDATE" + Date.now()));

      if (response.status === 200) {
        FlashMessageComponent.show("success", "Event Updated Successfully");
        goBack();
        handleBackPress();
      } else {
        FlashMessageComponent.show("error", "Failed to update event. Please try again.");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      FlashMessageComponent.show("error", "An error occurred while updating the event.");
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
      setImage(response?.data?.pathFileUrl);

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
      savePhoto(image.path)
    });
  };

  useEffect(() => {
  }, [eventAddress])

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
            <DatePickerComponent type={'DateTime'} ref={startDateRef} onDateChange={(e) => setSelectedStartDate(e)} birthDate={item?.startDate} />
            <CustomText style={[styles.label]}>{EVENT.END_DATE}</CustomText>
            <DatePickerComponent type={'DateTime'} startDate={selectedStartDate} ref={endDateRef} birthDate={item?.endDate} />
          </View>

          <View>
            <CustomText style={[styles.label]}>{EVENT.LOCATION}</CustomText>
            <BaseCityComponent ref={baseCityRef} location={eventAddress} onLocationSelect={(e) => { setEventAddress(e) }} />
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
            <MapComponent item={{ location: eventAddress }} />
          </View>

          <Input
            ref={eventDescriptionRef}
            label={EVENT.EVENT_DESCRIPTION}
            errorMessage={ERROR_MESSAGE.LAST_NAME}
            defaultValue={item?.description}
            multiline={true}
          />

          <HostEventTalent talents={featureTalent} onTalentChange={(e) => setFeatureTalent(e)} />

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
