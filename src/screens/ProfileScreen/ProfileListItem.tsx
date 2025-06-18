import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native-animatable';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import IMAGES from '../../assets/images';
import { ROUTES } from '../../navigation/Route';
import { COLORS, PROFILE, ROLE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { isIPad } from '../../utils/isTabletConfig';

type ProfileStackParamList = {
  ProfileStack: {
    screen: string;
    params?: any;
  };
};

interface ListItemProps {
  item: {
    id: string;
    title: string;
    image: string;
    onPress?: any;
  };
  onPress: () => void;
  activeScreen?: string | null;
}

const ProfileListItem: React.FC<ListItemProps> = ({
  item,
  onPress,
  activeScreen,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const route = useRoute();
  const role = useSelector((state: RootState) => state.auth.role);

  const getScreenNameForItem = (itemTitle: string) => {
    switch (itemTitle) {
      case PROFILE.EDIT_PROFILE:
        return role === ROLE.HOST
          ? ROUTES.HostEditProfileScreen
          : ROUTES.EditProfileScreen;
      case PROFILE.FOLLOWING:
        return ROUTES.FollowingScreen;
      case PROFILE.REFERRALS:
        return ROUTES.ReferralScreen;
      case PROFILE.CONNECTED_ACCOUNTS:
        return role === 'host'
          ? ROUTES.HostConnectedAccountsScreen
          : ROUTES.ConnectedAccountsScreen;
      case PROFILE.MY_INTERESTS:
        return ROUTES.SelectInterestScreen;
      case PROFILE.NOTIFICATION:
        return ROUTES.NotificationSettingsScreen;
      case PROFILE.FEEDBACK:
        return ROUTES.FeedbackScreen;
      default:
        return null;
    }
  };

  const isActive = () => {
    if (isIPad && activeScreen) {
      return activeScreen === item.title;
    }
    const screenName = getScreenNameForItem(item.title);
    return screenName ? route.name === screenName : false;
  };

  const redirectToProfileStack = (screenName: string, params = {}) => {
    navigation.navigate('ProfileStack', {
      screen: screenName,
      params,
    });
  };

  const handleItemClick = (item: any) => {
    if (isIPad) {
      onPress();
      return;
    }
    let screenName;
    switch (item.title) {
      case PROFILE.EDIT_PROFILE:
        screenName =
          role === ROLE.HOST
            ? ROUTES.HostEditProfileScreen
            : ROUTES.EditProfileScreen;
        redirectToProfileStack(screenName);
        break;

      case PROFILE.FOLLOWING:
        redirectToProfileStack(ROUTES.FollowingScreen);
        break;

      case PROFILE.REFERRALS:
        redirectToProfileStack(ROUTES.ReferralScreen, {
          activeTab: 'referrals',
        });
        break;

      case PROFILE.TRAVEL_PLANS:
        redirectToProfileStack(ROUTES.TravelPlansScreen);
        break;

      case PROFILE.CONNECTED_ACCOUNTS:
        screenName =
          role === 'host'
            ? ROUTES.HostConnectedAccountsScreen
            : ROUTES.ConnectedAccountsScreen;
        redirectToProfileStack(screenName);
        break;

      case PROFILE.MY_INTERESTS:
        redirectToProfileStack(ROUTES.SelectInterestScreen, {
          headerTitle: 'My Interests',
          btnTitle: 'Update',
          subTitle: PROFILE.MY_INTERESTS_DESC,
          fromProfile: true,
        });
        break;

      case PROFILE.NOTIFICATION:
        redirectToProfileStack(ROUTES.NotificationSettingsScreen, {});
        break;

      case PROFILE.FEEDBACK:
        redirectToProfileStack(ROUTES.FeedbackScreen);
        break;

      case PROFILE.CONTACT_SUPPORT:
        onPress();
        break;

      case PROFILE.DELETE_ACCOUNT:
        onPress();
        break;

      case PROFILE.APPLY_FOR_MEMBERSHIP:
        navigation.navigate('BeforeAppStaticScreen', { isFromProfile: true });
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputWrapper, isActive() && styles.activeInputWrapper]}
        onPress={() => handleItemClick(item)}
        activeOpacity={item.title === PROFILE.CONTACT_SUPPORT ? 1 : 0}>
        {item.image && <Image source={item.image as any} style={styles.icon} />}
        <Text
          style={[
            styles.input,
            { color: item.image ? COLORS.black : COLORS.errorText },
            isActive() && styles.activeText,
          ]}>
          {item.title}
        </Text>
        {item.image && (
          <Image resizeMode="contain" source={IMAGES.arrowRight} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    flex: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  activeInputWrapper: {
    backgroundColor: COLORS.borderGray,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  icon: {
    marginRight: 10,
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  activeText: {
    color: COLORS.black,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});

export default ProfileListItem;
