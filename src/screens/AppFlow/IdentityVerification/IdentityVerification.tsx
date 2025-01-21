import React, {useRef} from 'react';
import {ScrollView, Text, View, Linking} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LABLE, BUTTON_LABLE, ERROR_MESSAGE} from '../../../utils/constants';
import IdentityVerificationStyles from './IdentityVerificationStyles';
import Button from '../../../component/Button';
import Title from '../../../component/Title/Title';
import Header from '../../../component/Header/Header';
import {persistStore} from 'redux-persist';
import {store} from '../../../redux/store'; // Your store
import {useDispatch, useSelector} from 'react-redux';
import {
  resetAppFlowDetails,
  setPageProgress,
  UserDetailsState,
} from '../../../redux/slices/appFlowSlice';
import Input from '../../../component/Input/Input';
import IMAGES from '../../../assets/images';
import {useMemberSignUp} from '../../../redux/hooks/useMemberSignUp';
import {UserProfile} from '../../../redux/hooks/useMemberSignUp';
import useApi from '../../../axios/useApi';
import {EndPoint} from '../../../ApiManager/config';

interface IdentityVerificationProps extends NativeStackScreenProps<any, any> {}

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  navigation,
}) => {
  const {signUp} = useMemberSignUp();
  const {apiRequest, loading, error} = useApi();
  const userDetails = useSelector((state: any) => state.appFlow);

  console.log('persist data', userDetails);
  const styles = IdentityVerificationStyles();
  const dispatch = useDispatch();
  const usernameRef = useRef<any>(null);

  const onNextClick = async () => {


    const requestParams: any = {
      address: {
        address: userDetails.baseCity.address,
        placeId: userDetails.baseCity.placeId,
      },
      dateOfBirth: userDetails.birthday,
      email: userDetails.email,
      firstName: userDetails.firstName,
      focusIds: userDetails.creativeFocus.map((item: any) => item.id),
      gender: userDetails.gender,
      lastName: userDetails.lastName,
      phoneNumber: userDetails.phone,
      instagramAccessToken: 'string',
      instagramUserName: usernameRef.current.inputText,
      linkedInAccessToken: 'string',
      facebookAccessToken: 'string',
      platform: 'string',
      socialUrl: 'string',
    };
     console.log('requestParams', requestParams);
    // const response = await apiRequest('post', EndPoint.member_signUp,requestParams);
    console.log("response",error)
    //if not error then 
    dispatch(resetAppFlowDetails());
    // persistStore(store).purge(); // This clears the persisted state
    navigation.navigate('MyDetailsScreen');
  };

  const handleBackPress = () => {
    dispatch(setPageProgress(8));
    navigation.navigate('ProfilePhotoScreen');
  };

  const goToInstagram = () => {
    Linking.openURL('https://www.instagram.com/therumor/');
  };

  const goToEmail = () => {
    Linking.openURL(`mailto:${BUTTON_LABLE.SUPPORT_EMAIL_ID}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={LABLE.IDENTITY_VERIFICATION}
        onPress={handleBackPress}
      />

      <ScrollView
        contentContainerStyle={{paddingBottom: 50}}
        style={styles.contentContainer}>
        <Title
          title={LABLE.IDENTITY_VERIFICATION_TITLE}
          subTitle={LABLE.IDENTITY_VERIFICATION_SUBTITLE}
        />
        <Input
          ref={usernameRef}
          placeholder={'@username'}
          leftImage={IMAGES.instagramLogo}
          // iconStyle={styles.iconStyle}
          errorMessage={ERROR_MESSAGE.PLEASE_ENTER_YOUR_BASE_CITY}
          defaultValue={''}
        />
        <View style={styles.mainContainer}>
          <Text style={styles.title}>{LABLE.COMPLETE_VERIFICATION}</Text>
          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>1</Text>
          </View>
          <Text style={styles.subTitle}>{LABLE.SEND_DIRECT_MSG_CODE}</Text>
          <Text style={styles.subTitle}>
            <Text style={styles.btnRumor}>{LABLE.RUMORAPP}</Text>
            {' to '}
            <Text style={styles.emailStyle}>@therumor</Text>
          </Text>

          <View style={styles.numberContainer}>
            <Text style={styles.numberText}>2</Text>
          </View>
          <Text style={styles.subTitle}>{LABLE.WE_WILL_REVIEW_APP}</Text>

          <Button
            disabled={false}
            style={styles.btnSmallStyle}
            title={BUTTON_LABLE.GO_TO_INSTAGRAM}
            colorTheme="light"
            onPress={goToInstagram}
          />
          <View style={styles.divider} />
          <Text style={[styles.title, {marginVertical: 20}]}>
            {LABLE.DONT_USE_INSTAGRAM}
          </Text>
          <Text style={styles.subTitle}>{LABLE.EMAIL_THE_CODE}</Text>
          <Text style={styles.subTitle}>
            <Text style={styles.btnRumor}>{LABLE.RUMORAPP}</Text>
            {' to '}
            <Text style={styles.emailStyle}>
              {BUTTON_LABLE.SUPPORT_EMAIL_ID}
            </Text>
          </Text>
          <Button
            disabled={false}
            style={styles.btnSmallStyle}
            title={BUTTON_LABLE.SEND_EMAIL}
            colorTheme="light"
            onPress={goToEmail}
          />
        </View>
      </ScrollView>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.SUBMTI_APPLICATION}
        colorTheme="dark"
        onPress={onNextClick}
      />
    </SafeAreaView>
  );
};

export default IdentityVerification;
