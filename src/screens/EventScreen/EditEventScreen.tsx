import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import DynamicTabBar, {
  TabItem,
} from 'src/component/ActiveTabBar/DynamicTabBar';
import Header from 'src/component/Header/Header';
import { COLORS, editEventsTab, EVENT } from 'src/utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import EditEventDetails from './EditEventDetails';
import EditEventSettings from './EditEventSettings';

interface EditEventScreenProps extends NativeStackScreenProps<any, any> {}

const EditEventScreen: React.FC<EditEventScreenProps> = ({ navigation }) => {
  const event = useRoute().params?.event;
  const [currentTab, setCurrentTab] = useState<TabItem>(editEventsTab[0]);

  const handleBackPress = () => {
    navigation.goBack();
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <Header
          headerTitle={EVENT.EDIT_EVENT}
          onPress={handleBackPress}
          showProgressBar={false}
        />
        <View style={{ marginTop: 12 }} />
        <DynamicTabBar
          onTabChange={handleTabChange}
          tabs={editEventsTab}
          activeTabIndex={0}
        />
        <View style={styles.contentContainer}>
          {currentTab.label === EVENT.DETAILS ? (
            <EditEventDetails item={event} />
          ) : null}
          {currentTab.label === EVENT.SETTINGS ? (
            <EditEventSettings event={event} />
          ) : null}
        </View>
        {/* <View style={styles.contentContainer}>{renderTabContent()}</View> */}
      </View>
    </KeyboardAvoidingView>
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
