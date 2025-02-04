import IMAGES from '@images/index';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {View} from 'react-native';
import DynamicTabBar, {TabItem} from 'src/component/ActiveTabBar/DynamicTabBar';
import Header from 'src/component/Header/Header';
import {BUTTON_LABLE, COLORS} from 'src/utils/constants';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import AllUsers from './AllUsers';
import AddNewUserSheet from './BottomSheets/AddNewUserSheet';
import Lists from './Lists';
import UsersScreenStyle from './style';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
  const addNewUserSheetRef = useRef(null);

  const styles = UsersScreenStyle();

  const [currentTab, setCurrentTab] = useState<TabItem>(tabsData[0]);

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  const onPressHeaderPlus = () => {
    if (currentTab.id === '1') {
      addNewUserSheetRef?.current?.open();
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, []),
  );

  return (
    <View style={[styles.container]}>
      <Header
        headerTitle="Users"
        showProgressBar={false}
        rightIcon={IMAGES.plus}
        onPressRightIcon={onPressHeaderPlus}
        showBackButton={false}
        rightIconWrapperStyle={{backgroundColor: COLORS.black}}
      />
      <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />

      {currentTab.id === '1' ? <AllUsers /> : null}
      {currentTab.id === '2' ? <Lists /> : null}
      <AddNewUserSheet ref={addNewUserSheetRef} />
    </View>
  );
};

export default UserModule;
