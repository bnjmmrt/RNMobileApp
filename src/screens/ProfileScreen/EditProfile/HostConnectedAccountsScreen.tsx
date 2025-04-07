import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Button from '../../../component/Button';
import Header from '../../../component/Header/Header';
import { BUTTON_LABLE, COLORS, PROFILE } from '../../../utils/constants';
// import {useGetPostsQuery} from '../../../redux/slices/apiSlice';
import IMAGES from '@images/index';
import { useDispatch, useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import SocialMediaInput from 'src/component/Input/SocialMediaInput';
import Toast from 'src/component/Toast/Toast';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import useKeyboard from 'src/utils/hooks/useKeyboard';
import useApi from '../../../axios/useApi';
import { RootState } from '../../../redux/slices';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../../utils/dimensions';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

interface HostConnectedAccountsScreenProps
  extends NativeStackScreenProps<any, any> {}

const HostConnectedAccountsScreen: React.FC<
  HostConnectedAccountsScreenProps
> = ({ navigation }) => {
  const { apiRequest, loading, error } = useApi();
  const { keyboardVisible } = useKeyboard();
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.auth.userId);
  const hostProfileData = useSelector(
    (state: RootState) => state.appFlowApiData.profileData,
  );
  const instagramRef = useRef<any>(null);
  const tiktokRef = useRef<any>(null);
  const facebookRef = useRef<any>(null);
  const linkedinRef = useRef<any>(null);
  const xRef = useRef<any>(null);
  const youtubeRef = useRef<any>(null);

  const [isToastShown, setIsToastShown] = useState(false);

  const onConfirmClick = async () => {
    const requestObject: any = {
      socialMedia: {
        facebook: facebookRef?.current.inputText,
        instagram: instagramRef?.current.inputText,
        linkedin: linkedinRef?.current.inputText,
        tiktok: tiktokRef?.current.inputText
          ? '@' + tiktokRef?.current.inputText
          : '',
        x: xRef?.current.inputText,
        youtube: youtubeRef?.current.inputText
          ? '@' + youtubeRef?.current.inputText
          : '',
      },
    };

    const response: any = await apiRequest(
      'put',
      `${EndPoint.host_ep}`,
      requestObject,
    );
    if (response.success) {
      FlashMessageComponent.show(
        'success',
        'Connected Accounts updated successfully',
      );
      //navigate if required
      dispatch(setProfileData({ ...hostProfileData, ...response?.data }));
      handleBackPress();
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: keyboardVisible
            ? Platform.OS === 'ios'
              ? verticalMarginScale(50)
              : verticalMarginScale(10)
            : 0,
        },
      ]}>
      <Header
        headerTitle={PROFILE.CONNECTED_ACCOUNTS}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <SocialMediaInput
              image={IMAGES.profileInsta}
              ref={instagramRef}
              label={PROFILE.INSTAGRAM}
              prefix={'instagram.com/'}
              isIconShown={false}
              defaultValue={
                hostProfileData?.socialMedia?.instagram
                  ? hostProfileData?.socialMedia?.instagram
                  : ''
              }
            />
            <SocialMediaInput
              image={IMAGES.host_tiktok}
              ref={tiktokRef}
              label={PROFILE.TIKTOK}
              prefix={'tiktok.com/@'}
              isIconShown={false}
              defaultValue={
                hostProfileData?.socialMedia?.tiktok
                  ? hostProfileData?.socialMedia?.tiktok?.replace('@', '')
                  : ''
              }
            />
            <SocialMediaInput
              image={IMAGES.fb}
              ref={facebookRef}
              label={PROFILE.FACEBOOK}
              prefix={'facebook.com/'}
              isIconShown={false}
              defaultValue={
                hostProfileData?.socialMedia?.facebook
                  ? hostProfileData?.socialMedia?.facebook
                  : ''
              }
            />
            <SocialMediaInput
              image={IMAGES.linkdn}
              ref={linkedinRef}
              label={PROFILE.LINKEDIN}
              prefix={'linkedin.com/in/'}
              isIconShown={false}
              defaultValue={
                hostProfileData?.socialMedia?.linkedin
                  ? hostProfileData?.socialMedia?.linkedin
                  : ''
              }
            />
            <SocialMediaInput
              image={IMAGES.host_x}
              ref={xRef}
              label={PROFILE.X}
              prefix={'x.com/'}
              isIconShown={false}
              defaultValue={
                hostProfileData?.socialMedia?.x
                  ? hostProfileData?.socialMedia?.x
                  : ''
              }
            />
            <SocialMediaInput
              image={IMAGES.yt}
              ref={youtubeRef}
              label={PROFILE.YOUTUBE}
              prefix={'youtube.com/@'}
              isIconShown={false}
              defaultValue={
                hostProfileData?.socialMedia?.youtube
                  ? hostProfileData?.socialMedia?.youtube?.replace('@', '')
                  : ''
              }
            />
          </View>
          {isToastShown && (
            <Toast
              message={'Please select at least one'}
              onClose={() => setIsToastShown(false)}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {!keyboardVisible ? (
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.CONFIRM}
          colorTheme="dark"
          onPress={onConfirmClick}
          loading={loading}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  btnStyle: {
    // marginTop: verticalMarginScale(20),
    // marginBottom: verticalMarginScale(20),
    borderRadius: radiusScale(100),
    bottom: BOTTOM_SAFEAREA_SPACING,
  },
  contentContainer: {
    flex: 1,
    // paddingVertical: verticalMarginScale(10),
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(20),
  },
  label: {
    paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
  textareaContainer: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    padding: verticalMarginScale(10),
    backgroundColor: COLORS.white,
    // marginVertical: verticalMarginScale(10),
    width: '100%',
  },
  textArea: {
    textAlignVertical: 'top',
    fontSize: fontScale(16),
    color: '#333',
    height: verticalScale(100),
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
});

export default HostConnectedAccountsScreen;
