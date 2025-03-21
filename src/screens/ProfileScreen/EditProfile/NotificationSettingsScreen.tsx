import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setPageProgress } from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';
import { COLORS, PROFILE } from '../../../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../../redux/slices';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { setNotificationSettings } from 'src/redux/slices/appSettingsSlice';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

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
      EndPoint.user_notification_preferences,
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
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.NOTIFICATION}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <ScrollView>
        <View style={styles.itemContainer}>
          <View style={[styles.item, styles.topRadius]}>
            <Text style={styles.label}>{PROFILE.SMS_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: COLORS.black, true: COLORS.black }}
              thumbColor={
                isSMSNotificationEnabled ? COLORS.white : COLORS.white
              }
              onValueChange={toggleSMSNotification}
              value={isSMSNotificationEnabled}
            />
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>{PROFILE.PUSH_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: COLORS.black, true: COLORS.black }}
              thumbColor={
                isPushNotificationEnabled ? COLORS.white : COLORS.white
              }
              onValueChange={togglePushNotification}
              value={isPushNotificationEnabled}
            />
          </View>
          <View style={[styles.item, styles.bottomRadius]}>
            <Text style={styles.label}>{PROFILE.EMAIL_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{ false: COLORS.black, true: COLORS.black }}
              thumbColor={
                isEmailNotificationEnabled ? COLORS.white : COLORS.white
              }
              onValueChange={toggleEmailNotification}
              value={isEmailNotificationEnabled}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: verticalMarginScale(20),
  },
  itemContainer: {
    marginTop: verticalMarginScale(20),
    paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(20),
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(18),
    marginBottom: verticalMarginScale(4),
    borderRadius: radiusScale(4),
    height: verticalScale(56),
  },
  topRadius: {
    borderTopLeftRadius: radiusScale(25),
    borderTopRightRadius: radiusScale(25),
  },
  bottomRadius: {
    borderBottomRightRadius: radiusScale(25),
    borderBottomLeftRadius: radiusScale(25),
  },
  label: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontWeight: '500',
  },
  switch: {
    transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
  },
});
export default NotificationSettingsScreen;
