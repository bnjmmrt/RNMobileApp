import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  LABLE,
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
  ROLE,
} from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import ProfileCard from './ProfileCard';
import CheckInComponent from './CheckInComponent';
import EmptyRecordComponent from 'src/component/EmptyRecord/EmptyRecordComponent';
import IMAGES from '@images/index';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import AvatarInitials from 'src/component/AvatarInitials';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';

interface GuestCheckInScreenProps extends NativeStackScreenProps<any, any> {}

const GuestCheckInScreen: React.FC<GuestCheckInScreenProps> = ({
  navigation,
  route,
}) => {
  const { apiRequest, loading, error } = useApi();
  const [eventDetails, setEventDetails] = useState({
    guestDetail: {
      guestId: '24c29087-c1d3-4796-ac69-c237a3e352e5',
      inviteMessage: 'Aayie appka intejar hai',
      maxAdditionalGuests: 3,
      privateGuestNote: 'welcome-home',
      ticketType: 'VIP02',
      userId: '3c9e75e1-e7b3-4066-ba2b-7a5298f84c3a',
    },
    guestProfile: {
      addedBy: 'Rajni',
      addedByPicture:
        'https://stat5.bollywoodhungama.in/wp-content/uploads/2016/03/Rajinikanth2-1.jpg',
      additionalGuests: [
        {
          addedBy: '3c9e75e1-e7b3-4066-ba2b-7a5298f84c3a',
          category: [],
          checkIn: false,
          firstName: 'Danielle',
          gender: 'MALE',
          guestId: '3cea157e-4296-437a-ac62-b924b50597f2',
          id: 'f4322732-727f-40f4-abba-d28e87350d32',
          interest: [],
          invitationSource: 'INVITED_BY_HOST',
          lastName: 'Holland',
          privateGuestNote: 'tu bhi aaja',
        },
      ],
      age: 23 ,
      categories: [],
      checkIn: true,
      declinedBy: '',
      declinedByPicture: '',
      email: 'crussell@baker-byrd.com',
      favorite: true,
      followsYou: '24.5M',
      guestId: '24c29087-c1d3-4796-ac69-c237a3e352e5',
      id: '24c29087-c1d3-4796-ac69-c237a3e352e5',
      interest: ['Actor', 'Content Creator', 'Model'],
      invitationSource: -1,
      name: 'Stephen Zimmerman',
      phoneNumber: '845.375.8937',
      profilePicture: '',
      location: 'Pune,India',
      roles: [
        {
          roleId: '0ee616f4-287c-439a-8264-6af0529277b3',
          roleName: 'non_member',
          status: 'NEW_APPLICANT',
        },
      ],
      status: 'INVITED',
      userId: '3c9e75e1-e7b3-4066-ba2b-7a5298f84c3a',
    },
    quizDataList: {
      questions: [],
    },
    vouches: [],
  });
  const getEventGuestDetails = async () => {
    const response: any = await apiRequest(
      'get',
      EndPoint.event_guest_details + route?.params.guestId,
    );
    if (response.status === 200) {
      setEventDetails(response.data);
    }
  };
  useEffect(() => {
    getEventGuestDetails();
  }, []);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );
  const handleBackPress = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={LABLE.CHECK_IN}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      {true ? (
        <ScrollView style={styles.container}>
          <ProfileCard
            guest={{
              name: eventDetails.guestProfile.name,
              avatar: eventDetails.guestProfile.profilePicture,
              roles: eventDetails.guestProfile.roles,
              age: eventDetails.guestProfile.age,
              followers: eventDetails.guestProfile.followsYou,
              location: eventDetails.guestProfile.location,
              status: eventDetails.guestProfile.status,
              interests:eventDetails.guestProfile.interest,
              isMember:eventDetails.guestProfile.roles[0].roleName==='non_member' ? true:false
            }}
            actionButtons={[]}
          />
          <View style={styles.card}>
            <AvatarInitials size={32} name="Anurag Harod" />
            <View style={{ paddingLeft: verticalMarginScale(8) }}>
              <Text style={styles.blurText}>Guest of</Text>
              <Text style={styles.username}>Aurang</Text>
            </View>
          </View>
          <CheckInComponent />
        </ScrollView>
      ) : (
        <EmptyRecordComponent
          title={LABLE.USER_NOT_FOUND}
          subTitle={ERROR_MESSAGE.TCKET_ERROR_MESSAGE}
          btnShown={true}
          btnIcon={IMAGES.searchWhite}
          btnLabel={LABLE.SEARCH_USERS}
        />
        // <EmptyRecordComponent
        //   title={LABLE.USER_ALREADY_CHECKED_IN}
        //   subTitle={ERROR_MESSAGE.TCKET_ERROR_MESSAGE}
        //   btnShown={true}
        //   btnIcon={IMAGES.profileWhite}
        //   btnLabel={LABLE.MANAGE_GUESTS}
        // />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(16),
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(14),
  },
  username: {
    fontSize: fontScale(14),
    fontWeight: '500',
  },
  blurText: { color: COLORS.light_gray, fontSize: fontScale(11) },
});
export default GuestCheckInScreen;
