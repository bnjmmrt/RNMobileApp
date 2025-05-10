import React, { useCallback, useEffect } from 'react';
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { fetchUserProfile, fontFamily } from 'src/utils/functions';
import IMAGES from '../assets/images';
import { COLORS } from '../utils/constants';
import { fontScale, verticalMarginScale, Wp } from '../utils/dimensions';
import HeaderProfileSwitcher from './HeaderProfileSwitcher';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ROUTES } from 'src/navigation/Route';
import useApi from 'src/axios/useApi';
import { setNotificationCount } from 'src/redux/slices/appGlobalDataSlice';
import { EndPoint } from 'src/ApiManager/config';

interface HeaderComponentProps {
  rightImageStyle?: StyleProp<ImageStyle>;
  isDarkTheme?: boolean;
  hasGradient?: boolean;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  rightImageStyle,
  isDarkTheme,
  hasGradient = false,
}) => {
  const backgroundColor = isDarkTheme ? COLORS.black2 : COLORS.white;
  const tintColor = isDarkTheme ? COLORS.white : COLORS.black2;
  const backgroundColorNotification = isDarkTheme
    ? COLORS.dark_gray
    : COLORS.tabBorderColor;
  const { role, userId } = useSelector(
    (state: RootState) => ({
      role: state.auth.role,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );
  const { apiRequest } = useApi();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const navigation = useNavigation();

  const handleNotificationPress = () =>
    navigation.navigate(ROUTES.NotificationsScreen);

  const notiCount = useSelector(
    (state: RootState) => state.appFlowApiData.notiCount,
  );

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getNotificationCount();
    }, [role]),
  );

  const getNotificationCount = async () => {
    const notificationCount: any = await apiRequest(
      'get',
      `${EndPoint.notification_count}?id=${userId}&role=${role}`,
    );
    if (notificationCount.data) {
      dispatch(
        setNotificationCount(notificationCount?.data?.totalNotifications),
      );
    }
  };
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: hasGradient ? 'transparent' : backgroundColor },
      ]}>
      <View style={styles.logoContainer}>
        <Image
          style={[styles.imgStyle, rightImageStyle]}
          source={IMAGES.rumorLogoDark}
          tintColor={tintColor}
        />
        {role == 'host' && (
          <View
            style={{
              borderRadius: 20,
              borderWidth: 1,
              paddingHorizontal: 5,
              marginBottom: 25,
              marginStart: 5,
              backgroundColor: COLORS.black,
              borderColor: COLORS.black, // Add border color to make the border visible
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: fontFamily.ABCDiatype_Medium,
                fontSize: fontScale(12),
              }}>
              Host
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.iconsWrapper]}>
        <TouchableOpacity
          onPress={handleNotificationPress}
          style={[
            styles.iconButton,
            { backgroundColor: backgroundColorNotification },
          ]}>
          {notiCount > 0 && (
            <Image style={styles.badge} source={IMAGES.notification_badge} />
          )}
          <Image
            style={[styles.imgStyle, rightImageStyle]}
            source={IMAGES.bell}
            tintColor={tintColor}
          />
        </TouchableOpacity>
        <HeaderProfileSwitcher isDarkTheme={isDarkTheme} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Wp(100),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginHorizontal: 5,
    backgroundColor: COLORS.tabBorderColor,
  },
  profileButtonContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.lighter_gray,
    overflow: 'hidden',
  },
  avatarContainer: {},
  imgStyle: {
    resizeMode: 'contain',
  },
  badge: { position: 'absolute', top: -4, right: -3, resizeMode: 'contain' },
});

export default HeaderComponent;
