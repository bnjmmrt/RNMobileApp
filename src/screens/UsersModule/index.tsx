import IMAGES from '@images/index';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {useSelector} from 'react-redux';
import DynamicTabBar, {TabItem} from 'src/component/ActiveTabBar/DynamicTabBar';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import {BUTTON_LABLE, COLORS} from 'src/utils/constants';
import {RootState} from '../../redux/slices';
import UsersScreenStyle from './style';
import UserListItem from './UsersListItem';
import UserActionsSheet from './BottomSheets/UserActionsSheet';
import BottomSheet from '@gorhom/bottom-sheet';
import AllUsers from './AllUsers';
import Lists from './Lists';

const tabsData: TabItem[] = [
  {
    id: '1',
    label: BUTTON_LABLE.ALL_USERS,
    title: 'No Events Here',
    subTitle: 'No upcoming events.',
  },
  {
    id: '2',
    label: BUTTON_LABLE.LISTS,
    title: 'No Events Here',
    subTitle: 'No invitations yet.',
  },
];

interface UserModuleProps extends NativeStackScreenProps<any, any> {}

const UserModule: React.FC<UserModuleProps> = ({navigation}) => {
  const styles = UsersScreenStyle();
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <Header
        headerTitle="Users"
        showProgressBar={false}
        rightIcon={IMAGES.plus}
        onPressRightIcon={() => {}}
        showBackButton={true}
        rightIconWrapperStyle={{backgroundColor: COLORS.black}}
      />
      <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />

      {currentTab.id === '1' ? <AllUsers /> : null}
      {currentTab.id === '2' ? <Lists /> : null}
    </SafeAreaView>
  );
};

export default UserModule;
