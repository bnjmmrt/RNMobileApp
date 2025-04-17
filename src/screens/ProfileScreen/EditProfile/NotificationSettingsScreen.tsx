import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setPageProgress } from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';
import { COLORS, PROFILE } from '../../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../../redux/slices';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { setNotificationSettings } from 'src/redux/slices/appSettingsSlice';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { isIPad } from 'src/utils/isTabletConfig';

interface NotificationSettingsScreenProps {}

interface ConfigData {
  logo: string;
  title: string;
  subTitle: string;
  connectBtnBackground: string;
  snapPoints?: any;
}

const NotificationSettingsScreen: React.FC<
  NotificationSettingsScreenProps
> = () => {
  const dispatch = useDispatch();
  const { apiRequest, loading, error } = useApi();
  const navigation = useNavigation();
  const notificationsSettings = useSelector(
    (state: RootState) => state.appSettings.notificationsSettings,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  const [isSMSNotificationEnabled, setSMSNotificationEnabled] = useState(
    notificationsSettings?.enableSmsNotifications,
  );
  const [isPushNotificationEnabled, setPushNotificationEnabled] = useState(
    notificationsSettings?.enableAppNotifications,
  );
  const [isEmailNotificationEnabled, setEmailNotificationEnabled] = useState(
    notificationsSettings?.enableEmailNotifications,
  );

  const toggleSMSNotification = () => {
    const newValue = !isSMSNotificationEnabled;
    setSMSNotificationEnabled(newValue);
    updateSettings(
      { ...notificationsSettings, enableSmsNotifications: newValue },
      newValue,
      'SMS',
    );
  };

  const togglePushNotification = () => {
    const newValue = !isPushNotificationEnabled;
    setPushNotificationEnabled(newValue);
    updateSettings(
      { ...notificationsSettings, enableAppNotifications: newValue },
      newValue,
      'Push',
    );
  };

  const toggleEmailNotification = () => {
    const newValue = !isEmailNotificationEnabled;
    setEmailNotificationEnabled(newValue);
    updateSettings(
      { ...notificationsSettings, enableEmailNotifications: newValue },
      newValue,
      'Email',
    );
  };

  const updateSettings = async (
    requestData: any,
    newValue: boolean,
    type: 'SMS' | 'Push' | 'Email',
  ) => {
    const response: any = await apiRequest(
      'put',
      `${EndPoint.user_notification_preferences}?id=${userId}`,
      { ...requestData, muteDuration: '24h' },
    );

    if (response.success) {
      dispatch(setNotificationSettings(response.data));

      // Determine the success message dynamically
      const status = newValue ? 'ON' : 'OFF';
      FlashMessageComponent.show(
        'success',
        `${type} Notifications turned ${status} successfully`,
      );
    }
  };
  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        headerTitle={PROFILE.NOTIFICATION}
        onPress={handleBackPress}
        showProgressBar={false}
        showBackButton={!isIPad}
      />
      <ScrollView>
        <View style={styles.itemContainer}>
          <View style={[styles.item, styles.topRadius]}>
            <Text style={styles.label}>{PROFILE.SMS_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: COLORS.borderGray, true: COLORS.black }}
              thumbColor={COLORS.white}
              onValueChange={toggleSMSNotification}
              value={isSMSNotificationEnabled}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>{PROFILE.PUSH_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: COLORS.borderGray, true: COLORS.black }}
              thumbColor={COLORS.white}
              onValueChange={togglePushNotification}
              value={isPushNotificationEnabled}
            />
          </View>
          <View style={[styles.item, styles.bottomRadius]}>
            <Text style={styles.label}>{PROFILE.EMAIL_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: COLORS.borderGray, true: COLORS.black }}
              thumbColor={COLORS.white}
              onValueChange={toggleEmailNotification}
              value={isEmailNotificationEnabled}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 20,
  },
  itemContainer: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 4,
    borderRadius: 4,
    height: 56,
  },
  topRadius: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  bottomRadius: {
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
});
export default NotificationSettingsScreen;
