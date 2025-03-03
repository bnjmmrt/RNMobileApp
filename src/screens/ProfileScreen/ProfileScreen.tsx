import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import {
  BUTTON_LABLE,
  COLORS,
  LABLE,
  PROFILE,
  ROLE,
} from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import ProfileScreenStyle from './ProfileScreenStyle';
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
import { environment } from '../../../environments/environment';
import ContactSupporrtBottomSheet from 'src/component/BottomSheet/ContactSupporrtBottomSheet';
import { setAuthToken } from 'src/redux/slices/authSlice';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { resetLoginData } from 'src/redux/slices/authSlice';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { verticalScale } from 'src/utils/dimensions';
import { resetAppFlowDetails } from 'src/redux/slices/appFlowSlice';
import { resetProfileData, setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { setNotificationSettings } from 'src/redux/slices/appSettingsSlice';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
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
  const [URL, setURL] = useState('');
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [image, setImage] = useState<string>('');
  const editPhotoBottomSheetRef = useRef<any>(null);
  const savePhotoBottomSheetRef = useRef<any>(null);
  const logoutBottomSheetRef = useRef<any>(null);
  const deleteAccountBottomSheetRef = useRef<any>(null);
  const bottomSheetRef = useRef(null);

  const userId = useSelector((state: RootState) => state.auth.userId);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const role = useSelector((state: RootState) => state.auth.role);
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const profileData = useSelector((state: RootState) => state.appFlowApiData?.profileData);
  const [isShown, setIsShown] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, []),
  );

  const getUserSettings = async () => {
    const response: any = await apiRequest(
      'get',
      EndPoint.user_settings + userId,
    );
    if (response.status === 200) {
      //dependiing on API response parse data and set
      // setUserDetails(response.data.userData);
      dispatch(setNotificationSettings(response.data.notificationsSettings));
    }
  };

  const getHostProfile = async () => {
    const response: any = await apiRequest(
      'get',
      `v1/auth/host/${userId}/profile`,
    );
    // console.log('getHostDetails', response);
    if (response.status === 200) {
      dispatch(setProfileData(response.data));
      // setUser(response?.data);
    }
  };

  const getMemberNonMemberProfile = async () => {
    if (isGuest && loginData.roles[0]?.roleName === ROLE.NON_MEMBER) {
      const response: any = await apiRequest('post',
        EndPoint.get_user_with_role_by_id,
        { id: userId },
      );
      if (response.status === 200) {
        dispatch(setProfileData(response?.data));
      }
    } else {
      const response: any = await apiRequest('get', EndPoint.user + userId);
      if (response.status === 200) {
        dispatch(setProfileData({...response?.data, profilePicture: response?.data?.imageUrl}));
      }
    }
  };

  useEffect(() => {
    switch (role) {
      // case ROLE.MEMBER:
      //   break;
      case ROLE.HOST:
        getHostProfile();
        break;
      default:
        getMemberNonMemberProfile();
        break;
    }
    getUserSettings();
  }, []);

  const setWebUrl = (url: string) => {
    console.log('setUrl', url);
    setURL(url);
    URL.length && bottomSheetRef?.current?.open();
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

  const roleText = (role: string) => {
    switch (role.toLowerCase()) {
      case 'member':
        return 'Member'
      case 'non_member':
        if (isGuest && loginData.roles[0]?.roleName === ROLE.NON_MEMBER) {
          return 'Invited'
        } else {
          return 'Non-Member'
        }
      case 'host':
        return 'Host'
      default:
        return 'Non-Member'
    }
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
    { id: '1', title: PROFILE.EDIT_PROFILE, image: IMAGES.edit },
    { id: '2', title: PROFILE.FOLLOWING, image: IMAGES.following },
    { id: '3', title: PROFILE.REFERRALS, image: IMAGES.thumbsUp },
    // {
    //   id: '14',
    //   title: PROFILE.CONNECTED_ACCOUNTS,
    //   image: IMAGES.connectedAccount,
    // },
    { id: '5', title: PROFILE.MY_INTERESTS, image: IMAGES.heart },
    { id: '6', title: PROFILE.NOTIFICATION, image: IMAGES.notification },
    { id: '7', title: PROFILE.FEEDBACK, image: IMAGES.feedback },
    {
      id: '8',
      title: PROFILE.CONTACT_SUPPORT,
      image: IMAGES.contact,
      onPress: contactSupportModal,
    },
    {
      id: '9',
      title: PROFILE.DELETE_ACCOUNT,
      image: '',
      onPress: deleteAccount,
    },
  ];

  const hostItems: ListItem[] = [
    { id: '1', title: PROFILE.EDIT_PROFILE, image: IMAGES.edit },
    {
      id: '2',
      title: PROFILE.CONNECTED_ACCOUNTS,
      image: IMAGES.connectedAccount,
    },
    { id: '3', title: PROFILE.NOTIFICATION, image: IMAGES.notification },
    { id: '4', title: PROFILE.FEEDBACK, image: IMAGES.feedback },
    {
      id: '5',
      title: PROFILE.CONTACT_SUPPORT,
      image: IMAGES.contact,
      onPress: contactSupportModal,
    },
    {
      id: '6',
      title: PROFILE.APPLY_FOR_MEMBERSHIP,
      image: IMAGES.membership,
    },
    { id: '7', title: PROFILE.DELETE_ACCOUNT, image: '', onPress: deleteAccount },
  ];

  useEffect(() => {
    let listItems = itemsExtras;
    if (role.toLocaleLowerCase() === 'non_member' && isGuest) {
      listItems = items;
    } else if (role.toLocaleLowerCase() === 'host') {
      listItems = hostItems
    } else {
      listItems = itemsExtras
    }
    // const listItems =
    //   loginData?.roles[0].roleName === ROLE.MEMBER || loginData?.roles[0].roleName === ROLE.NON_MEMBER
    //     ? itemsExtras
    //     : loginData?.roles[0]?.roleName === ROLE.HOST
    //     ? hostItems
    //     : items;
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

  const updateProfilePhoto = async (url: string) => {
    const fileUploadResponse: any = await apiRequest(
      'put',
      EndPoint.user_profile_picture + userId,
      { profilePicture: url },
    );

    if (fileUploadResponse.status === 200) {
      FlashMessageComponent.show('success', 'Photo updated successfully');
      dispatch(
        setProfileData({
          ...profileData,
          profilePicture: fileUploadResponse?.data?.profilePicture,
        }),
      );
    }
  };

  const updateHostProfilePhoto = async (url: string) => {
    const requestObject: any = {
      companyLogo: url,
    };
    const response: any = await apiRequest(
      'put',
      `v1/auth/host/${userId}/profile`,
      requestObject
    );
    if (response.status === 200) {
      dispatch(setProfileData({ ...profileData, companyLogo: response?.data?.companyLogo }))
      FlashMessageComponent.show('success', "Photo updated successfully")
    }
  };

  const savePhoto = async () => {
    if (image) {
      // setIsToastShown(false);
      savePhotoBottomSheetRef.current?.close();
      const response: any = await uploadFile();
      console.log('savePhoto', response);
      if (response.status === 200) {
        // setIsToastShown(false);
        const imageUrl =
          environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
        if (role.toLocaleLowerCase() === 'host') {
          await updateHostProfilePhoto(imageUrl)
        } else {
          await updateProfilePhoto(imageUrl)
        }
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
      // editPhotoBottomSheetRef.current?.close();
      savePhotoBottomSheetRef.current?.open();
    });
  };

  const logOut = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
    dispatch(resetProfileData());
    dispatch(resetLoginData());
    dispatch(setAuthToken(null));
    dispatch(resetAppFlowDetails());
    logoutBottomSheetRef.current?.close();
    // navigation.dispatch(resetAction);
    navigation.replace("AuthStack")
  };

  const getUserName = () => {
    // if (isGuest && loginData.roles[0]?.roleName === ROLE.NON_MEMBER) {
    //   return profileData.name;
    // } else {
      return profileData?.firstName ? `${profileData?.firstName} ${profileData?.lastName}` : ''
    // }
  }

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
          {/* <HeaderComponent isDarkTheme={false} /> */}

          <ScrollView>
            <ProfileTopView
              editPhotoClick={editPhotoClick}
              profilePic={role.toLocaleLowerCase() === 'host' ? profileData?.companyLogo : profileData?.profilePicture}
              name={getUserName()}
              loading={loading}
              // role={loginData?.roles[0].roleName}
              role={roleText(role)}
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

            <TermsAndPolicy
              setUrl={setWebUrl}
              type="small"
              showMessage={false}
            />

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
            snapPoints={[Platform.OS == 'android' ? '50%' : '50%']}
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
