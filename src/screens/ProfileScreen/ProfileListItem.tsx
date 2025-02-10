import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Image} from 'react-native-animatable';
import IMAGES from '../../assets/images';
import {COLORS, PROFILE} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../navigation/Route';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';

interface ListItemProps {
  item: {
    id: string;
    title: string;
    image: string;
    onPress?: any;
  };
  onPress: () => void;
}

const ProfileListItem: React.FC<ListItemProps> = ({item, onPress}) => {
  const navigation = useNavigation<NavigationProp>();
  const loginData = useSelector((state: RootState) => state.auth.loginData);

  const redirectToProfileStack = (screenName: string, params = {}) => {
    navigation.navigate('ProfileStack', {
      screen: screenName,
      params,
    });
  };

  const handleItemClick = (item: any) => {
    let screenName;
    switch (item.title) {
      case PROFILE.EDIT_PROFILE:
        screenName =
          loginData?.roles[0].roleName === 'host'
            ? ROUTES.HostEditProfileScreen
            : ROUTES.EditProfileScreen;
        console.log('Redirecting to Edit Profile...');
        redirectToProfileStack(screenName);
        break;

      case PROFILE.FOLLOWING:
        console.log('Redirecting to Following...');
        redirectToProfileStack(ROUTES.FollowingScreen);
        // Example: navigate('/following');
        break;

      case PROFILE.REFERRALS:
        console.log('Redirecting to Referrals...');
        redirectToProfileStack(ROUTES.ReferralScreen);
        // Example: navigate('/referrals');
        break;

      case PROFILE.CONNECTED_ACCOUNTS:
        console.log('Redirecting to Connected Accounts...');
        screenName =
          loginData?.roles[0].roleName === 'host'
            ? ROUTES.HostConnectedAccountsScreen
            : ROUTES.ConnectedAccountsScreen;
        redirectToProfileStack(screenName);
        break;

      case PROFILE.MY_INTERESTS:
        console.log('Redirecting to My Interests...');
        redirectToProfileStack(ROUTES.SelectInterestScreen, {
          headerTitle: 'My Interests',
          btnTitle: 'Update',
          subTitle: PROFILE.MY_INTERESTS_DESC,
          fromProfile: true,
        });
        break;

      case PROFILE.NOTIFICATION:
        console.log('Redirecting to Notifications...');
        redirectToProfileStack(ROUTES.NotificationsScreen);
        break;

      case PROFILE.FEEDBACK:
        console.log('Redirecting to Feedback...');
        redirectToProfileStack(ROUTES.FeedbackScreen);
        break;

      case PROFILE.CONTACT_SUPPORT:
        console.log('Redirecting to Contact Support...');
        onPress();
        break;

      case PROFILE.DELETE_ACCOUNT:
        console.log('Redirecting to Delete Account...');
        // Example: navigate('/delete-account');
        onPress();
        break;

      case PROFILE.APPLY_FOR_MEMBERSHIP:
        navigation.navigate('AppFlowStack');
        break;
      default:
        console.log('Unknown item clicked');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.inputWrapper]}
        onPress={() => handleItemClick(item)}>
        {item.image && <Image source={item.image} style={styles.icon} />}
        <Text
          style={[
            styles.input,
            {color: item.image ? COLORS.black : COLORS.errorText},
          ]}>
          {item.title}
        </Text>
        {item.image && <Image source={IMAGES.arrowRight} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(10),
    backgroundColor: COLORS.white,
    marginBottom: verticalMarginScale(5),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalMarginScale(55),
    borderWidth: verticalScale(1),
    flex: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(20),
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  icon: {
    marginRight: horizontalMarginScale(10),
    width: horizontalMarginScale(20),
    height: verticalMarginScale(20),
  },
  input: {
    flex: 1,
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
});

export default ProfileListItem;
