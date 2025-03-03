import React, { useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'src/component/Toast/Toast';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { extractCountryCode } from 'src/utils/functions';
import { setProfileData } from 'src/redux/slices/appGlobalDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import useApi from 'src/axios/useApi';
import Header from 'src/component/Header/Header';
import { COLORS, editEventsTab, EVENT, PROFILE } from 'src/utils/constants';
import DynamicTabBar, { TabItem } from 'src/component/ActiveTabBar/DynamicTabBar';
import EditEventDetails from './EditEventDetails';
import EditEventSettings from './EditEventSettings';
import { useRoute } from '@react-navigation/native';
import Input from 'src/component/Input/Input';
import { horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';

interface EditEventScreenProps extends NativeStackScreenProps<any, any> { }

const EditEventScreen: React.FC<EditEventScreenProps> = ({ navigation }) => {
  const event = useRoute().params?.event
  const [currentTab, setCurrentTab] = useState<TabItem>(editEventsTab[0]);

  const handleBackPress = () => {
    navigation.goBack()
  };

  const handleTabChange = (tab: TabItem) => {
    setCurrentTab(tab);
  };

  const renderTabContent = () => {
    switch (currentTab.label) {
      case EVENT.DETAILS:
        return <EditEventDetails item={event} />;
      case EVENT.SETTINGS:
        return <EditEventSettings event={event} />;
      default:
        return null;
    }
  };


  return (
    <View style={styles.container}>
      <Header
        headerTitle={EVENT.EDIT_EVENT}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <DynamicTabBar
        onTabChange={handleTabChange}
        tabs={editEventsTab}
        activeTabIndex={0}
      />
      <View style={styles.contentContainer}>{renderTabContent()}</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: 20
  },

  contentContainer: {
    flex: 1,
    marginTop: verticalMarginScale(20),
    paddingHorizontal: horizontalMarginScale(20),
  },

});

export default EditEventScreen;
