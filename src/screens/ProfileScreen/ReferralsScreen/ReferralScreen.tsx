import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import TabBar from 'src/component/ActiveTabBar/TabBar';
import Header from 'src/component/Header/Header';
import {BUTTON_LABLE, COLORS, PROFILE} from 'src/utils/constants';
import {Text} from 'react-native';
import {fontFamily} from 'src/utils/functions';
import ReferralRequestItem from './ReferralRequestItem';
import Button from 'src/component/Button';
import InviteFriendsSheet from './InviteFriendsSheet';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  Wp,
} from 'src/utils/dimensions';
import {useNavigation} from '@react-navigation/native';
import useContacts from 'src/utils/hooks/useContactPermission';
import useApi from 'src/axios/useApi';
import {EndPoint} from 'src/ApiManager/config';
import {useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

const ReferralScreen: React.FC = () => {
  const {apiRequest, loading} = useApi();
  const [activeTab, setActiveTab] = useState<'referrals' | 'vouches'>(
    'referrals',
  );
  const loginData = useSelector((state: RootState) => state.auth?.loginData);
  const inviteFriendSheetRef = useRef<any>(null);
  const {goBack} = useNavigation();
  const {requestContactPermission} = useContacts();

  const [referrelRequests, setReferrelRequests] = useState<any[]>([]);

  const [vouchRequests, setVouchRequests] = useState<any[]>([]);

  const getReferredRequest = async () => {
    const response: any = await apiRequest('get', EndPoint.referral_requests);

    if (response?.status === 200) {
      setReferrelRequests(response?.data);
    }
  };

  const getVouchRequest = async () => {
    const response: any = await apiRequest('get', EndPoint.vouch_requests);

    if (response.status === 200) {
      setVouchRequests(response?.data);
    }
  };

  const updateReferrel = async (id: string, status: boolean) => {
    const response: any = await apiRequest(
      'put',
      EndPoint.referral_requests + '/' + id,{isApproved: status}
    );
    if(response?.status!==200){
      FlashMessageComponent.show('error',"Something went wrong, please try later")
     }
   
  };

  const updateVouch = async (id: string, status: boolean) => {
    const response: any = await apiRequest(
      'put',
      EndPoint.vouch_requests + '/' + id,{ isApproved: status},
    );
    if(response?.status!==200){
     FlashMessageComponent.show('error',"Something went wrong, please try later")
    }
  };

  useEffect(() => {
    getReferredRequest();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab === '01' ? 'referrals' : 'vouches');
    tab === '01' ? getReferredRequest() : getVouchRequest();
  };

  const handleApproveDeclineClick = async (flag: boolean, id: string) => {
  
    if (activeTab === 'referrals') {
     await updateReferrel(id, flag);
    } else {
     await updateVouch(id, flag);
    }
  };

  const renderContent = () => {
    const data = activeTab === 'referrals' ? referrelRequests : vouchRequests;
    const subtitle =
      activeTab === 'referrals'
        ? PROFILE.REVIEW_REFERRAL_REQUESTS
        : PROFILE.REVIEW_VOUCH_REQUESTS;

    return (
      <>
        <FlatList
          data={data}
          ListEmptyComponent={
            <View style={styles.listEmptyCopmponentStyle}>
              <EventEmptyRecord
                title={
                  activeTab === 'referrals'
                    ? 'You have no referral requests at this time.'
                    : 'You have no vouch requests at this time.'
                }
              />
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          }
          contentContainerStyle={styles.contentContainerStyle}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <ReferralRequestItem
              name={item.requesterName}
              image={item?.requesterProfileImage}
              message={
                activeTab === 'referrals'
                  ? 'has requested your referral.'
                  : `has requested your vouch for [${item?.eventName}]`
              }
              onApproveApi={() => handleApproveDeclineClick(true, item?.id)}
              onDeclineApi={() => handleApproveDeclineClick(false, item?.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.REFERRALS}
        showProgressBar={false}
        onPress={goBack}
      />
      <TabBar
        onTabChange={handleTabChange}
        tabOneLabel="Referral Requests"
        tabTwoLabel="Vouch Requests"
        countOne={4}
        countTwo={2}
        width={Wp(88)}
      />
      <View style={{paddingHorizontal: horizontalMarginScale(20), flex: 1}}>
        {renderContent()}
      </View>
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.INVITE_FRIENDS}
        colorTheme="dark"
        onPress={async () => {
          await requestContactPermission();
          inviteFriendSheetRef?.current.open();
        }}
      />
      <InviteFriendsSheet ref={inviteFriendSheetRef} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionSubtitle: {
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
    marginBottom: verticalMarginScale(12),
  },
  contentContainerStyle: {
    gap: 12,
    marginTop: verticalMarginScale(16),
    paddingBottom: 60,
  },
  listEmptyCopmponentStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Hp('50%'),
    flexDirection: 'row',
  },
  messageText: {
    fontSize: 14,
    color: COLORS.black,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  btnStyle: {
    borderRadius: radiusScale(99),
    marginBottom: verticalMarginScale(20),
  },
});

export default ReferralScreen;
