import React, {useRef, useState} from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {setPageProgress} from '../../../redux/slices/appFlowSlice';
import Header from '../../../component/Header/Header';
import {
  COLORS,
  PROFILE,
} from '../../../utils/constants';
import {useNavigation} from '@react-navigation/native';

interface NotificationsScreenProps {}

interface ConfigData {
  logo: string;
  title: string;
  subTitle: string;
  connectBtnBackground: string;
  snapPoints?: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isSMSNotificationEnabled, setSMSNotificationEnabled] = useState(true);
  const [isPushNotificationEnabled, setPushNotificationEnabled] =
    useState(false);
  const [isEmailNotificationEnabled, setEmailNotificationEnabled] =
    useState(false);

  const toggleSMSNotification = () =>
    setSMSNotificationEnabled(previousState => !previousState);
  const togglePushNotification = () =>
    setPushNotificationEnabled(previousState => !previousState);
  const toggleEmailNotification = () =>
    setEmailNotificationEnabled(previousState => !previousState);

  const handleBackPress = () => {
    dispatch(setPageProgress(3));
    navigation.goBack();
  };

  const onConfirm = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={PROFILE.NOTIFICATION}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <ScrollView>
        <View style={styles.itemContainer}>
          <View style={[styles.item,styles.topRadius]}>
            <Text style={styles.label}>{PROFILE.SMS_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{false: COLORS.black, true: COLORS.black}}
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
              trackColor={{false: COLORS.black, true: COLORS.black}}
              thumbColor={
                isPushNotificationEnabled ? COLORS.white : COLORS.white
              }
              onValueChange={togglePushNotification}
              value={isPushNotificationEnabled}
            />
          </View>
          <View style={[styles.item,styles.bottomRadius]}>
            <Text style={styles.label}>{PROFILE.EMAIL_NOTIFICATIONS}</Text>
            <Switch
              style={styles.switch}
              trackColor={{false: COLORS.black, true: COLORS.black}}
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
  },
  itemContainer: {marginTop: 20, paddingVertical: 10, paddingHorizontal: 20},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: 18,
    paddingVertical:16,
    marginBottom: 4,
    borderRadius:4
  },
  topRadius:{
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  bottomRadius:{
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
  },
  switch: {
    transform: [{scaleX: 0.6}, {scaleY: 0.6}], 
  },
});
export default NotificationsScreen;
