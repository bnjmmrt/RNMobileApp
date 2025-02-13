import IMAGES from '@images/index';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, View} from 'react-native';
import DynamicTabBar, {TabItem} from 'src/component/ActiveTabBar/DynamicTabBar';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import Header from 'src/component/Header/Header';
import {AppStackParamList} from 'src/navigation/AppStack';
import {useFetchUserDetailsQuery} from 'src/redux/actions/usersApiAction';
import {BUTTON_LABLE, COLORS} from 'src/utils/constants';
import {verticalMarginScale} from 'src/utils/dimensions';
import UserActionsSheet, {
  UserActionCurrentPageType,
} from '../BottomSheets/UserActionsSheet';
import userDetailsStyle from './style';
import UserEvents from './UserEvents';
import UserInformation from './UserInformation';
import UserInterests from './UserInterests';
import UserLists from './UserLists';
import UserOverview from './UserOverview';
import UserProfile from './UserProfile';
import FullScreenLoader from 'src/component/FullScreenLoader';

interface UserDetailsProps
  extends NativeStackScreenProps<AppStackParamList, 'UserDetail'> {}

const tabsData: TabItem[] = [
  {
    id: '1',
    label: BUTTON_LABLE.OVERVIEW,
    title: 'No Events Here',
    subTitle: 'No upcoming events.',
  },
  {
    id: '2',
    label: BUTTON_LABLE.EVENTS,
    title: 'No Events Here',
    subTitle: 'No invitations yet.',
  },
];

const UserDetails: React.FC<UserDetailsProps> = ({route}) => {
  const styles = userDetailsStyle();
  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const {user} = route?.params;

  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);
  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<UserActionCurrentPageType>('');

  const {data: userData, isLoading} = useFetchUserDetailsQuery({
    user: user,
  });

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  return (
    <View style={styles.container}>
      <Header
        headerTitle="User Profile"
        showProgressBar={false}
        rightIcon={IMAGES.dots}
        onPressRightIcon={() => {
          actionSheetRef?.current?.open();
        }}
        showBackButton={true}
      />
      {isLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={COLORS.black} />
        </View>
      ) : null}
      {userData ? (
        <ScrollView
          style={{marginTop: verticalMarginScale(16)}}
          contentContainerStyle={{gap: verticalMarginScale(16)}}>
          <UserProfile user={user} />

          <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />

          {currentTab.id === '1' && userData ? (
            <View
              style={{
                gap: verticalMarginScale(16),
                marginBottom: verticalMarginScale(10),
              }}>
              <UserOverview user={user} />
              <UserInterests user={user} />
              <UserLists user={user} />
              <UserInformation user={user} />
            </View>
          ) : null}
          {currentTab.id === '2' ? (
            <View>
              <UserEvents />
            </View>
          ) : null}
        </ScrollView>
      ) : null}
      <UserActionsSheet
        ref={actionSheetRef}
        user={user}
        selectedAction={selectedActionSheetAction}
        setSelectedAction={setSelectedActionSheetAction}
        from={'userDetail'}
        selectedUsers={[user]}
      />
    </View>
  );
};

export default UserDetails;
