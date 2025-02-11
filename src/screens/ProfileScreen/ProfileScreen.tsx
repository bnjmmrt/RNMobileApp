import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { BUTTON_LABLE, COLORS, LABLE, PROFILE } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import ProfileScreenStyle from './ProfileScreenStyle';
import { SafeAreaView } from 'react-native';
import HeaderComponent from '../../component/HeaderComponent';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import ProfileTopView from './ProfileTopView';
import ProfileListItem from './ProfileListItem';
import TermsAndPolicy from '../../component/TermsAndPlolicy/TermsAndPolicy';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import { Text } from 'react-native-animatable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import EditPictureBottomSheet from '../../component/BottomSheet/EditPictureBottomSheet';
import DeleteAccountBottomSheet from 'src/component/BottomSheet/DeleteAccountBottomSheet';
import useApi from '../../axios/useApi';
import { EndPoint } from '../../ApiManager/config';
import { setProfilePic } from '../../redux/slices/appFlowSlice';
import { environment } from '../../../environments/environment';
import ContactSupporrtBottomSheet from 'src/component/BottomSheet/ContactSupporrtBottomSheet';
import { setAuthToken, setLoginData } from 'src/redux/slices/authSlice';
import { ROUTES } from 'src/navigation/Route';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { resetLoginData } from 'src/redux/slices/authSlice';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { verticalScale } from 'src/utils/dimensions';
import { resetAppFlowDetails } from 'src/redux/slices/appFlowSlice';

// Define the type for navigation props
interface ProfileScreenProps extends NativeStackScreenProps<any, any> { }

interface ListItem {
  id: string;
  title: string;
  image: string;
  onPress?: any;
}
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { apiRequest, loading, error } = useApi();
  const dispatch = useDispatch();
  const styles = ProfileScreenStyle();
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [URL, setURL] = useState('');
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [image, setImage] = useState<string>('');
  const editPhotoBottomSheetRef = useRef<any>(null);
  const savePhotoBottomSheetRef = useRef<any>(null);
  const logoutBottomSheetRef = useRef<any>(null);
  const deleteAccountBottomSheetRef = useRef<any>(null);
  const contactSupportBottomSheetRef = useRef<any>(null);
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const memberProfileData = useSelector((state: RootState) => state.appFlowApiData.memberProfileData);
  const [isShown, setIsShown] = useState(false);

  const bottomSheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
        showBottomSafeAreaView: false,
      })

    }, []),
  );

  // useEffect(() => {
  //   URL.length > 0 && bottomSheetRef?.current?.open();
  // }, [URL]);

  const setWebUrl = (url: string) => {
    console.log('setUrl', url);
    setURL(url);
    URL.length && bottomSheetRef?.current?.open();

  };

  const onChangeBottomSheet = (index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
  };

  const [isInvited, setInvited] = useState<boolean>(
    loginData?.isInvited || false,
  );
  const deleteAccount = () => {
    deleteAccountBottomSheetRef.current?.open();
  };

  const contactSupportModal = () => {
    setIsShown(true);
  };

  const items: ListItem[] = [
    { id: '1', title: PROFILE.EDIT_PROFILE, image: IMAGES.edit },
    { id: '2', title: PROFILE.NOTIFICATION, image: IMAGES.notification },
    { id: '3', title: PROFILE.FEEDBACK, image: IMAGES.feedback },
    {
      id: '4',
      title: PROFILE.CONTACT_SUPPORT,
      image: IMAGES.contact,
      onPress: contactSupportModal,
    },
    { id: '5', title: PROFILE.DELETE_ACCOUNT, image: '', onPress: deleteAccount },
  ];

  const itemsExtras: ListItem[] = [
    { id: '11', title: PROFILE.EDIT_PROFILE, image: IMAGES.edit },
    { id: '12', title: PROFILE.FOLLOWING, image: IMAGES.following },
    { id: '13', title: PROFILE.REFERRALS, image: IMAGES.thumbsUp },
    {
      id: '14',
      title: PROFILE.CONNECTED_ACCOUNTS,
      image: IMAGES.connectedAccount,
    },
    { id: '15', title: PROFILE.MY_INTERESTS, image: IMAGES.heart },
    { id: '16', title: PROFILE.NOTIFICATION, image: IMAGES.notification },
    { id: '17', title: PROFILE.FEEDBACK, image: IMAGES.feedback },
    {
      id: '18',
      title: PROFILE.CONTACT_SUPPORT,
      image: IMAGES.contact,
      onPress: contactSupportModal,
    },
    {
      id: '19',
      title: PROFILE.DELETE_ACCOUNT,
      image: '',
      onPress: deleteAccount,
    },

  ];

  const hasFullAccess =
    loginData?.isSignUpCompleted || loginData?.token?.id

  useEffect(() => {
    const listItems = hasFullAccess ? itemsExtras : items;
    setListItems(listItems);
  }, [loginData]);

  const handleLogoutPress = () => {
    logoutBottomSheetRef.current?.open();
  };

  const editPhotoClick = () => {
    editPhotoBottomSheetRef.current?.open();
  };

  const uploadFile = async () => {
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

  const savePhoto = async () => {
    if (image) {
      // setIsToastShown(false);
      savePhotoBottomSheetRef.current?.close();
      const response: any = await uploadFile();
      if (response.data) {
        // setIsToastShown(false);
        dispatch(
          setProfilePic(environment.IMAGE_URL + response.data.fileKeyId),
        );
      } else {
        //display error
      }
    }
  };

  const openCamera = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    }).then((image: ImageOrVideo) => {
      setImage(image.path);
      editPhotoBottomSheetRef.current?.close();
      savePhotoBottomSheetRef.current?.open();
    });
  };

  const logOut = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
    dispatch(resetLoginData());
    dispatch(setAuthToken(null))
    dispatch(resetAppFlowDetails());
    logoutBottomSheetRef.current?.close();
    navigation.dispatch(resetAction);
  };


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: !isInvited ? COLORS.black2 : COLORS.white },
      ]}>

      {isInvited ? (
        <BeforeAppStaticComponent
          title={LABLE.STREAMLINE_YOUR_LIFESTYLE}
          subTitle={LABLE.MANAGE_YOUR_EVENTS}
        />
      ) : (
        <View style={{ backgroundColor: COLORS.white }}>
          <HeaderComponent isDarkTheme={false} />

          <ScrollView>

            <ProfileTopView
              editPhotoClick={editPhotoClick}
              profilePic={memberProfileData?.imageUrl}
              name={`${memberProfileData?.firstName} ${memberProfileData?.lastName}`}
              loading={loading}
            />
            {listItems.map(item => {
              return (
                <ProfileListItem
                  key={item.id}
                  item={item}
                  onPress={item.onPress}
                />
              );
            })}

            <TermsAndPolicy setUrl={setWebUrl} type="small" showMessage={false} />

            <TouchableOpacity
              onPress={() => handleLogoutPress()}
              style={{ marginBottom: verticalScale(50) }}>
              <Text style={styles.textBelowStyle}>{PROFILE.LOGOUT}</Text>
            </TouchableOpacity>
          </ScrollView>

          <WebViewBottomSheet url={URL} ref={bottomSheetRef} />

          {isShown && (
            <ContactSupporrtBottomSheet
              // setLocation={setSelectedCity}
              setIsShown={setIsShown}
            />
          )}
          {/* <ContactSupporrtBottomSheet ref={contactSupportBottomSheetRef}/> */}
          <EditPictureBottomSheet
            ref={editPhotoBottomSheetRef}
            onPress={openCamera}
            submitButtonText={BUTTON_LABLE.REPLACE_PHOTO}
            cancelButtonText={BUTTON_LABLE.CANCEL}
            snapPoints={[Platform.OS == 'android' ? '20%' : '20%']}
            image={null}
          />

          <EditPictureBottomSheet
            ref={savePhotoBottomSheetRef}
            onPress={savePhoto}
            submitButtonText={BUTTON_LABLE.SAVE_PHOTO}
            cancelButtonText={BUTTON_LABLE.CANCEL}
            snapPoints={[Platform.OS == 'android' ? '50%' : '45%']}
            image={image}
          />

          <EditPictureBottomSheet
            ref={logoutBottomSheetRef}
            title="Are you sure you want to log out?"
            onPress={logOut}
            submitButtonText={BUTTON_LABLE.CONFIRM}
            cancelButtonText={BUTTON_LABLE.CANCEL}
            snapPoints={[Platform.OS == 'android' ? '40%' : '30%']}
            image={null}
          />
          <DeleteAccountBottomSheet
            ref={deleteAccountBottomSheetRef}
            onPress={deleteAccount}
          />
        </View>
      )}
    </View>
  );
};

export default ProfileScreen;
