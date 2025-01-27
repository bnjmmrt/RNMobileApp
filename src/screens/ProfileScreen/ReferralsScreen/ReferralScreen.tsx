import React, { useRef, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import TabBar from 'src/component/ActiveTabBar/TabBar';
import Header from 'src/component/Header/Header';
import { BUTTON_LABLE, COLORS, PROFILE } from 'src/utils/constants';
import { Text } from 'react-native';
import { fontFamily } from 'src/utils/functions';
import ReferralRequestItem from './ReferralRequestItem';
import Button from 'src/component/Button';
import InviteFriendsSheet from './InviteFriendsSheet';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import { Hp } from 'src/utils/dimensions';
import { useNavigation } from '@react-navigation/native';

const ReferralScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'referrals' | 'vouches'>('referrals');
  const inviteFriendSheetRef=useRef(null);
  const [showBottomSheet,setShowSheet]=useState(false);
  const {goBack}=useNavigation();

  const referralsData = [
    { id: 1, name: 'Sarah Michaels' },
    { id: 2, name: 'John Doe' },
  ];

  const vouchRequestsData = [
    { id: 1, name: 'Emily Johnson' },
    { id: 2, name: 'Michael Brown' },
  ];

  const renderContent = () => {
    const data = activeTab === 'referrals' ? referralsData : vouchRequestsData;
    const subtitle =
      activeTab === 'referrals'
        ? PROFILE.REVIEW_REFERRAL_REQUESTS
        : PROFILE.REVIEW_REFERRAL_REQUESTS;

    return (
      <>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
        <FlatList
          data={data}
          ListEmptyComponent={ <View style={{ alignItems: 'center', justifyContent: 'center', height: Hp(50), flexDirection: 'row'}}>
          <EventEmptyRecord title= {"You have no referral requests at this time."}/>
          </View>}
          contentContainerStyle={{ gap: 12, marginTop: 24, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ReferralRequestItem
              name={item.name}
              message={
                activeTab === 'referrals'
                  ? 'has requested your referral.'
                  : 'has requested your vouch.'
              }
              onApproveApi={() => new Promise((resolve) => setTimeout(resolve, 1000))}
              onDeclineApi={() => new Promise((resolve) => setTimeout(resolve, 1000))}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
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
        onTabChange={(tab) => setActiveTab(tab === "01" ? 'referrals' : 'vouches')}
        tabOneLabel="Referral Requests"
        tabTwoLabel="Vouch Requests"
      />
      <View style={{ paddingHorizontal: 20, flex: 1 }}>{renderContent()}</View>
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.INVITE_FRIENDS}
        colorTheme="dark"
        onPress={() => {
            setShowSheet(true);
            setTimeout(() => {
                inviteFriendSheetRef.current.open();
            }, 500);
        }}
      />
      {showBottomSheet && <InviteFriendsSheet ref={inviteFriendSheetRef}/>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    color: COLORS.black,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  btnStyle: {
    borderRadius: 100,
  },
});

export default ReferralScreen;
