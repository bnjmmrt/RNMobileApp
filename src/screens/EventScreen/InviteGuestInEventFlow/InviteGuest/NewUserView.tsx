import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import { CustomText } from 'src/component/CustomText';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import PhoneNumberInput, {
  countryType,
  PhoneNumberInputRefMethods,
} from 'src/component/PhonNumberComponent/PhoneNumberInput';
import { EventStackParamList } from 'src/navigation/EventStack';
import { ROUTES } from 'src/navigation/Route';
import {
  useMarkUserFavMutation,
  useUnmarkUserFavMutation,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { setSelectedUsersToInvite } from 'src/redux/slices/inviteGuestsFlowSlice';
import { verticalMarginScale } from 'src/utils/dimensions';
import createStyles from './styles';
import {
  useGetUserWithRolesByEmailMutation,
  useGetUserWithRolesByIdMutation,
} from 'src/redux/actions/inviteGuestsApiAction';
import { existingUserType } from '.';

interface NewUserViewProps {
  firstNameRef: React.RefObject<InputRefMethods>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastNameRef: React.RefObject<InputRefMethods>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  phoneRef: React.RefObject<PhoneNumberInputRefMethods>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  emailRef: React.RefObject<InputRefMethods>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  selectedCountry: countryType | null;
  setSelectedCountry: React.Dispatch<React.SetStateAction<countryType | null>>;
  type: 'contact' | 'email' | 'existing';
  existingUserData: existingUserType | null;
  setExistingUserData: React.Dispatch<
    React.SetStateAction<existingUserType | null>
  >;
}

const NewUserView: React.FC<NewUserViewProps> = ({
  emailRef,
  email,
  setEmail,
  firstNameRef,
  firstName,
  setFirstName,
  lastNameRef,
  lastName,
  setLastName,
  phoneRef,
  phone,
  setPhone,
  selectedCountry,
  setSelectedCountry,
  type,
  existingUserData,
  setExistingUserData,
}) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();

  const { selectedUsers, selectedEvent, selectedManualUser, loginData } =
    useSelector(
      (state: RootState) => ({
        selectedUsers: state.inviteGuestsFlow.selectedUsers,
        selectedEvent: state.inviteGuestsFlow.selectedEvent,
        selectedManualUser: state.inviteGuestsFlow.selectedManualUser,
        loginData: state.auth.loginData,
      }),
      shallowEqual,
    );

  const [
    getUserWithEmail,
    { error: getUserWithEmailError, isLoading: getUserWithEmailLoading },
  ] = useGetUserWithRolesByEmailMutation();
  const [
    getUserWithId,
    { error: getUserWithIdError, isLoading: getUserWithIdLoading },
  ] = useGetUserWithRolesByIdMutation();
  const [
    markUserFav,
    { error: markUserFavError, isLoading: markUserFavLoading },
  ] = useMarkUserFavMutation();
  const [
    unMarkUserFav,
    { error: unMarkUserFavError, isLoading: unMarkUserFavLoading },
  ] = useUnmarkUserFavMutation();

  const fetchUserByEmail = async () => {
    try {
      const emailResponse = await getUserWithEmail({ email: email }).unwrap();
      if (emailResponse.status === 200) {
        console.log(emailResponse);

        setExistingUserData(emailResponse?.data);
        // const idResponse = await getUserWithId({
        //   id: emailResponse?.data?.id,
        // }).unwrap();
        // if (emailResponse.status === 200) {
        //   setExistingUserData(idResponse?.data);
        // }
      } else {
        setExistingUserData(null);
      }
    } catch (error) {
      setExistingUserData(null);
      console.error('Error fetching user:', error);
    }
  };

  const handleFavCta = async (user: string) => {
    // try {
    //   let response;
    //   let payload = {
    //     targetUserId: user,
    //     user: loginData.id,
    //   };
    //   if (userDetails?.isFavourite) {
    //     response = await unMarkUserFav(payload).unwrap();
    //   } else {
    //     response = await markUserFav(payload).unwrap();
    //   }
    //   if (response.status === 200) {
    //     fetchUserDetails({ user: user });
    //     FlashMessageComponent.show('success', 'User marked as favorite!');
    //   } else {
    //     const typedError = response as ApiErrorInterface;
    //     FlashMessageComponent.show('error', getErrorMessage(typedError));
    //   }
    // } catch (error) {
    //   const typedError = error as ApiErrorInterface;
    //   FlashMessageComponent.show('error', getErrorMessage(typedError));
    // }
  };

  useEffect(() => {
    if (type === 'email') {
      if (email) {
        setTimeout(() => {
          fetchUserByEmail();
        }, 1000);
      } else {
        setExistingUserData(null);
      }
    }
  }, [type, email]);

  return (
    <View
      style={[
        styles.contentWrapper,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
      ]}>
      <View style={{ flex: 1, gap: verticalMarginScale(24) }}>
        {type === 'contact' ? (
          <View style={styles.bannerTextContainer}>
            <Image
              source={IMAGES.info}
              style={styles.bannerInfo}
              resizeMode="contain"
            />
            <CustomText style={{ flex: 1 }}>
              {
                'Your changes will only be saved in Rumor and will not impact your device’s contact list.'
              }
            </CustomText>
          </View>
        ) : null}
        <Input
          ref={firstNameRef}
          defaultValue={firstName}
          label="First Name"
          errorMessage="First name is required"
          placeholder=""
          onChangeText={setFirstName}
          otherStyle={{ marginTop: 0 }}
          inputFieldContainerStyle={styles.inputStyle}
        />
        <Input
          ref={lastNameRef}
          defaultValue={lastName}
          label="Last Name"
          errorMessage="Last name is required"
          placeholder=""
          onChangeText={setLastName}
          otherStyle={{ marginTop: 0 }}
          inputFieldContainerStyle={styles.inputStyle}
        />
        {type === 'contact' ? (
          <PhoneNumberInput
            ref={phoneRef}
            label="Phone Number"
            onChangeText={text => setPhone(text)}
            onSelectCountry={setSelectedCountry}
            inputContainerStyle={styles.inputStyle}
          />
        ) : null}
        {type === 'email' ? (
          <Input
            ref={emailRef}
            defaultValue={email}
            label="Email"
            errorMessage="Please enter an email address in the correct format to continue"
            placeholder=""
            onChangeText={setEmail}
            otherStyle={{ marginTop: 0 }}
            inputFieldContainerStyle={styles.inputStyle}
            keyboardType="email-address"
          />
        ) : null}
        {existingUserData ? (
          <TouchableOpacity
            style={styles.userPreviewContainer}
            onPress={() => {
              dispatch(
                setSelectedUsersToInvite([
                  {
                    age: 0,
                    categories: [],
                    city: '',
                    followerCount: '',
                    gender: '',
                    id: existingUserData.id,
                    interests: [],
                    isFavourite: false,
                    name: existingUserData.name,
                    profilePicture: '',
                    type: '',
                    listMappingId: '',
                  },
                ]),
              );
              navigation.navigate(ROUTES.InviteGuestScreen, {
                isManual: false,
                type: 'existing',
              });
            }}>
            <AvatarInitials
              name={`${existingUserData?.name || ''}`}
              size={48}
              imgUrl={existingUserData?.profilePicture}
            />
            <View style={{ flex: 1 }}>
              <CustomText style={styles.userName}>
                {existingUserData?.name}
                <Image source={IMAGES.arrow_up_right} />
              </CustomText>
              <CustomText style={styles.alreadyPresent}>
                {'This user is already a part of our database'}
              </CustomText>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default NewUserView;
