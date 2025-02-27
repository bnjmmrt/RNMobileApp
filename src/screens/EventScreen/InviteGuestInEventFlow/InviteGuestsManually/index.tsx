import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import DynamicTabBar, {
  TabItem,
} from 'src/component/ActiveTabBar/DynamicTabBar';
import Header from 'src/component/Header/Header';
import { EventStackParamList } from 'src/navigation/EventStack';
import { BUTTON_LABLE, COLORS } from 'src/utils/constants';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import InviteFromContacts from './InviteFromContacts';
import InviteFromEmail from './InviteFromEmail';
import createStyles from './styles';

const tabsData: TabItem[] = [
  {
    id: '1',
    label: BUTTON_LABLE.INVITE_FROM_CONTACTS,
    title: 'No Events Here',
    subTitle: 'No upcoming events.',
  },
  {
    id: '2',
    label: BUTTON_LABLE.INVITE_MANUALLY,
    title: 'No Events Here',
    subTitle: 'No invitations yet.',
  },
];

interface InviteGuestsManuallyProps
  extends NativeStackScreenProps<
    EventStackParamList,
    'InviteGuestsManuallyScreen'
  > {}

const InviteGuestsManually: React.FC<InviteGuestsManuallyProps> = ({}) => {
  const styles = createStyles();

  const [currentTab, setCurrentTab] = useState<TabItem | null>(tabsData[0]);

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle="Invite Guest"
        showProgressBar={false}
        rightIconWrapperStyle={{ backgroundColor: COLORS.black }}
      />

      <DynamicTabBar onTabChange={handleTabChange} tabs={tabsData} />

      {currentTab?.id === '1' ? <InviteFromContacts /> : null}
      {currentTab?.id === '2' ? <InviteFromEmail /> : null}
    </View>
  );
};

export default InviteGuestsManually;
