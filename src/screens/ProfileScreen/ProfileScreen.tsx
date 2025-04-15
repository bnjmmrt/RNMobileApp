import Intercom, { Visibility } from '@intercom/intercom-react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  InteractionManager,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-animatable';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { openSettings } from 'react-native-permissions';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import DeleteAccountBottomSheet from 'src/component/BottomSheet/DeleteAccountBottomSheet';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { resetAppFlowDetails } from 'src/redux/slices/appFlowSlice';
import {
  resetProfileData,
  setProfileData,
} from 'src/redux/slices/appGlobalDataSlice';
import { setNotificationSettings } from 'src/redux/slices/appSettingsSlice';
import {
  resetLoginData,
  setAuthToken,
  setCompanyLogo,
  setProfilePicture,
} from 'src/redux/slices/authSlice';
import { verticalScale } from 'src/utils/dimensions';
import {
  changeSafeAreaViewConfig,
  fetchUserProfile,
} from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { environment } from '../../../environments/environment';
import { EndPoint } from '../../ApiManager/config';
import IMAGES from '../../assets/images/index';
import useApi from '../../axios/useApi';
import EditPictureBottomSheet from '../../component/BottomSheet/EditPictureBottomSheet';
import TermsAndPolicy from '../../component/TermsAndPlolicy/TermsAndPolicy';
import WebViewBottomSheet from '../../component/WebView/WebViewBottomSheet';
import { RootState } from '../../redux/slices';
import { BUTTON_LABLE, COLORS, PROFILE, ROLE } from '../../utils/constants';
import ProfileListItem from './ProfileListItem';
import ProfileScreenStyle from './ProfileScreenStyle';
import ProfileTopView from './ProfileTopView';
import { useUploadFile } from 'src/utils/hooks/useUploadFile';
import { TOP_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { useMemberLogoutMutation } from 'src/redux/actions/appFlowApiAction';

// Define the type for navigation props
interface ProfileScreenProps extends NativeStackScreenProps<any, any> { }

interface ListItem {
  id: string;
  title: string;
  image: string;
  onPress?: any;
}
const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const styles = ProfileScreenStyle();

  const editPhotoBottomSheetRef = useRef<any>(null);
  const savePhotoBottomSheetRef = useRef<any>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const logoutBottomSheetRef = useRef<any>(null);
  const deleteAccountBottomSheetRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheetMethods>(null);

  const { apiRequest, loading } = useApi();

  const [URL, setURL] = useState('');
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [image, setImage] = useState<string>('');
  const [imageSize, setImageSize] = useState<number>(0);
  const { uploadFileHook } = useUploadFile();
  const [memberLogout, { error, isLoading }] = useMemberLogoutMutation();

  const {
    userId,
    isGuest,
    role,
    token,
    roles,
    profileData,
    companyLogo,
    profilePicture,
  } = useSelector(
    (state: RootState) => ({
      isGuest: state.auth.isGuest,
      role: state.auth.role,
      token: state.auth.token,
      roles: state.auth.roles,
      userId: state.auth.userId,
      profileData: state.appFlowApiData.profileData,
      companyLogo: state.auth.companyLogo,
      profilePicture: state.auth.profilePicture,
    }),
    shallowEqual,
  );

  const getUserSettings = async () => {
    const response: any = await apiRequest(
      'get',
      `${EndPoint.user_notification_preferences}?id=${userId}`,
    );
    if (response.success) {
      //dependiing on API response parse data and set
      // setUserDetails(response.data.userData);
      dispatch(setNotificationSettings(response.data));
    }
  };

  const setWebUrl = (url: string) => {
    setURL(url);
    bottomSheetRef?.current?.open();
  };

  const deleteAccount = () => {
    deleteAccountBottomSheetRef.current?.open();
  };
  const callDeleteAccountAPpi = async () => {
    try {
      const response = await apiRequest(
        'delete',
        `users/v1/auth/users/${userId}`,
      );
      if (response?.success) {
        // FlashMessageComponent.show(
        //   'success',
        //   response?.message || 'User account deactivated successfully.',
        // );
        deleteAccountBottomSheetRef.current?.close();
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
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            navigation.replace('AuthStack');
          }, 500);
        });
      } else {
        Alert.alert('Error', response?.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to delete account');
    }
  };

  useEffect(() => {
    if (profileData?.email) {
      Intercom.loginUserWithUserAttributes({
        email: profileData.email,
        userId: role + profileData?.id,
        name: `${profileData?.firstName} ${profileData?.lastName}`,
      });
    }
    Intercom.setBottomPadding(60)
    Intercom.setLauncherVisibility(Visibility.GONE);

    return () => {
      Intercom.logout();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileData?.email,
    profileData?.firstName,
    profileData?.lastName,
    userId,
    role,
  ]);

  const contactSupportModal = () => {
    Intercom.present();
  };

  const roleText = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'member':
        return 'Member';
      case 'non_member':
        return 'Non-Member';
      case 'host':
        return 'Host';
      default:
        return 'Non-Member';
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
    {
      id: '5',
      title: PROFILE.DELETE_ACCOUNT,
      image: '',
      onPress: deleteAccount,
    },
  ];

  const itemsExtras: ListItem[] = [
    { id: '1', title: PROFILE.EDIT_PROFILE, image: IMAGES.edit },
    { id: '2', title: PROFILE.FOLLOWING, image: IMAGES.following },
    { id: '3', title: PROFILE.REFERRALS, image: IMAGES.thumbsUp },
    {
      id: '14',
      title: PROFILE.CONNECTED_ACCOUNTS,
      image: IMAGES.connectedAccount,
    },
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
    {
      id: '7',
      title: PROFILE.DELETE_ACCOUNT,
      image: '',
      onPress: deleteAccount,
    },
  ];

  const hostMemberItems: ListItem[] = [
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
      id: '7',
      title: PROFILE.DELETE_ACCOUNT,
      image: '',
      onPress: deleteAccount,
    },
  ];

  const handleLogoutPress = () => {
    logoutBottomSheetRef.current?.open();
  };

  const editPhotoClick = () => {
    editPhotoBottomSheetRef.current?.open();
  };

  const updateProfilePhoto = async (url: string) => {
    const fileUploadResponse: any = await apiRequest(
      'put',
      EndPoint.user_profile_picture + userId,
      { profilePicture: url },
    );

    if (fileUploadResponse.success) {
      FlashMessageComponent.show('success', 'Photo updated successfully');
      dispatch(setProfilePicture(fileUploadResponse?.data?.profilePicture));
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
      `${EndPoint.host_ep}`,
      requestObject,
    );
    if (response.success) {
      dispatch(setCompanyLogo(response?.data?.companyLogo));
      dispatch(
        setProfileData({
          ...profileData,
          companyLogo: response?.data?.companyLogo,
        }),
      );
      FlashMessageComponent.show('success', 'Photo updated successfully');
    }
  };

  const savePhoto = async () => {
    try {
      setLoader(true);
      const data = await fetch(image);
      const blob = await data.blob();
      const fileName = image.split('/').pop();
      const pathType = 'profile';
      const response = await uploadFileHook(
        fileName,
        imageSize,
        'image',
        blob,
        pathType,
      );
      if (response.success == true) {
        savePhotoBottomSheetRef.current?.close();
        const imageUrl =
          environment.BASE_URL + EndPoint.view_image + response.data.fileKeyId;
        if (role?.toLocaleLowerCase() === 'host') {
          await updateHostProfilePhoto(imageUrl);
        } else {
          await updateProfilePhoto(imageUrl);
        }
      }
      setLoader(false);
      console.log('savePhoto', response);
    } catch (error) {
      setLoader(false);
      console.error('Error uploading image:', error);
    }
  };
  const onCancel = () => {
    setImage('');
  };

  const openCamera = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then((image: ImageOrVideo) => {
        setImage(image.path);
        setImageSize(image.size);

        // editPhotoBottomSheetRef.current?.close();
        savePhotoBottomSheetRef.current?.open();
      })
      .catch(async error => {
        console.log('ImagePicker Error: ', error);

        if (error?.message?.includes('did not grant library permission')) {
          Alert.alert(
            'Permission Required',
            'We need access to your photo library to allow you to add a profile picture. Please enable photo library permissions in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: async () => {
                  openSettings();
                },
              },
            ],
          );
        }
      });
  };

  const logOut = async () => {
    logoutBottomSheetRef.current?.close();
    const requestParam = {
      fcmToken: '',
      deviceId: '',
    }
    const response = await memberLogout(requestParam).unwrap();
    if (response.success) {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: 'AuthStack' }],
      });
      dispatch(resetProfileData());
      dispatch(resetLoginData());
      dispatch(setAuthToken(null));
      dispatch(resetAppFlowDetails());
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          navigation.replace('AuthStack');
        }, 500);
      });
      FlashMessageComponent.show('success', 'Logout successfully');
    }
    else {
      FlashMessageComponent.show('error', 'Something went wrong, please try again!');
    }

  };

  const getUserName = () => {
    // if (isGuest && loginData.roles[0]?.roleName === ROLE.NON_MEMBER) {
    //   return profileData.name;
    // } else {
    return profileData?.firstName
      ? `${profileData?.firstName} ${profileData?.lastName}`
      : '';
    // }
  };

  useEffect(() => {
    fetchUserProfile();
    getUserSettings();
  }, []);

  useEffect(() => {
    let listItems = itemsExtras;
    if (role?.toLocaleLowerCase() === ROLE.NON_MEMBER && isGuest && !token) {
      listItems = items;
    } else if (role?.toLocaleLowerCase() === 'host') {
      if (roles && roles.length > 1) {
        listItems = hostMemberItems;
      } else {
        listItems = hostItems;
      }
    } else {
      listItems = itemsExtras;
    }
    // const listItems =
    //   loginData?.roles[0].roleName === ROLE.MEMBER || loginData?.roles[0].roleName === ROLE.NON_MEMBER
    //     ? itemsExtras
    //     : loginData?.roles[0]?.roleName === ROLE.HOST
    //     ? hostItems
    //     : items;
    setListItems(listItems);
  }, [roles, role, token]);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: !isGuest ? COLORS.black2 : COLORS.white },
      ]}>
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingTop: TOP_SAFEAREA_SPACING,
        }}>
        {/* <HeaderComponent isDarkTheme={false} /> */}

        <ScrollView>
          <View style={{ height: verticalScale(20) }} />
          <ProfileTopView
            editPhotoClick={editPhotoClick}
            profilePic={
              role?.toLocaleLowerCase() === 'host'
                ? companyLogo
                : profilePicture
                  ? profilePicture
                  : profileData?.profilePicture
            }
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

          <TermsAndPolicy setUrl={setWebUrl} type="small" showMessage={false} />

          <TouchableOpacity
            onPress={() => handleLogoutPress()}
            style={{ marginBottom: verticalScale(0) }}>
            <Text style={styles.textBelowStyle}>{PROFILE.LOGOUT}</Text>
          </TouchableOpacity>
        </ScrollView>

        <WebViewBottomSheet url={URL} ref={bottomSheetRef} />

        <EditPictureBottomSheet
          ref={editPhotoBottomSheetRef}
          onPress={openCamera}
          submitButtonText={BUTTON_LABLE.REPLACE_PHOTO}
          cancelButtonText={BUTTON_LABLE.CANCEL}
          snapPoints={[Platform.OS == 'android' ? 0.23 : 0.2]}
          image={null}
        />

        <EditPictureBottomSheet
          ref={savePhotoBottomSheetRef}
          onPress={savePhoto}
          onPencilClick={openCamera}
          loadding={loader}
          onCancel={onCancel}
          submitButtonText={BUTTON_LABLE.SAVE_PHOTO}
          cancelButtonText={BUTTON_LABLE.CANCEL}
          snapPoints={[Platform.OS === 'android' ? 0.51 : 0.43]}
          image={image}
        />

        <EditPictureBottomSheet
          ref={logoutBottomSheetRef}
          title={'Are you sure you want to log out?'}
          onPress={logOut}
          loadding={false}
          submitButtonText={BUTTON_LABLE.CONFIRM}
          cancelButtonText={BUTTON_LABLE.CANCEL}
          snapPoints={[Platform.OS === 'android' ? '0.29' : '0.30']}
          image={null}
        />
        <Text style={styles.textBelowStyle}>{environment.SERVER + ' '}{Platform.OS == 'android' ? environment.VERSION_ANDROID : environment.VERSION_IOS}</Text>
        <DeleteAccountBottomSheet
          ref={deleteAccountBottomSheetRef}
          onPress={deleteAccount}
          onDeletePress={callDeleteAccountAPpi}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;
