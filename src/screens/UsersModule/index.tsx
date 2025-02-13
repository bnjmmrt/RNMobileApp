import IMAGES from '@images/index';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {View} from 'react-native';
import DynamicTabBar, {TabItem} from 'src/component/ActiveTabBar/DynamicTabBar';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import Header from 'src/component/Header/Header';
import {BUTTON_LABLE, COLORS} from 'src/utils/constants';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import AllUsers from './AllUsers';
import AddNewUserSheet from './BottomSheets/AddNewUserSheet';
import ListActionsSheet, {
  listActionCurrentPageType,
} from './BottomSheets/ListActionsSheet';
import Lists from './Lists';
import UsersScreenStyle from './style';

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
  const addNewUserSheetRef = useRef<BottomSheetMethods>(null);
  const listActionSheetRef = useRef<BottomSheetMethods>(null);
  const styles = UsersScreenStyle();

  const [currentTab, setCurrentTab] = useState<TabItem | null>(tabsData[0]);
  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<listActionCurrentPageType>('');

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  const onPressHeaderPlus = () => {
    if (currentTab) {
      if (currentTab.id === '1') {
        addNewUserSheetRef?.current?.open();
      }
      if (currentTab.id === '2') {
        console.log('llll');

        setSelectedActionSheetAction('createList');
        listActionSheetRef?.current?.open();
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, [currentTab?.id]),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle="Users"
        showProgressBar={false}
        rightIcon={IMAGES.plus}
        onPressRightIcon={onPressHeaderPlus}
        showBackButton={false}
        rightIconWrapperStyle={{backgroundColor: COLORS.black}}
      />
      <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />

      {currentTab?.id === '1' ? <AllUsers /> : null}
      {currentTab?.id === '2' ? <Lists /> : null}

      <AddNewUserSheet
        ref={addNewUserSheetRef}
        onSuccess={() => {
          setCurrentTab(null);
          setTimeout(() => {
            setCurrentTab(tabsData[0]);
          }, 100);
        }}
      />
      <ListActionsSheet
        ref={listActionSheetRef}
        from="customLists"
        selectedAction={selectedActionSheetAction}
        setSelectedAction={setSelectedActionSheetAction}
        onSuccess={() => {
          setCurrentTab(null);
          setTimeout(() => {
            setCurrentTab(tabsData[1]);
          }, 100);
        }}
        listType="custom"
      />
    </View>
  );
};

export default UserModule;
