import IMAGES from '@images/index';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useRef, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import DynamicTabBar, {TabItem} from 'src/component/ActiveTabBar/DynamicTabBar';
import Header from 'src/component/Header/Header';
import {BUTTON_LABLE} from 'src/utils/constants';
import userDetailsStyle from './style';
import UserEvents from './UserEvents';
import UserInformation from './UserInformation';
import UserInterests from './UserInterests';
import UserLists from './UserLists';
import UserOverview from './UserOverview';
import UserProfile from './UserProfile';
import UserActionsSheet from '../BottomSheets/UserActionsSheet';

interface UserDetailsProps extends NativeStackScreenProps<any, any> {}

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

const UserDetails: React.FC<UserDetailsProps> = ({}) => {
  const styles = userDetailsStyle();
  const actionSheetRef = useRef(null);

  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Header
        headerTitle="User Profile"
        showProgressBar={false}
        rightIcon={IMAGES.upDownArrow}
        onPressRightIcon={() => {
          actionSheetRef?.current?.open();
        }}
        showBackButton={true}
      />
      <ScrollView>
        <UserProfile />
        <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />

        {currentTab.id === '1' ? (
          <View style={{gap: 16}}>
            <UserOverview />
            <UserInterests />
            <UserLists />
            <UserInformation />
          </View>
        ) : null}
        {currentTab.id === '2' ? (
          <View>
            <UserEvents />
          </View>
        ) : null}
      </ScrollView>
      <UserActionsSheet ref={actionSheetRef} />
    </SafeAreaView>
  );
};

export default UserDetails;
