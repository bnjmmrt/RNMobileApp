import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../../assets/images';
import { COLORS, PROFILE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../navigation/Route';

interface ListItemProps {
  item: {
    id: string;
    title: string;
    image: string;
    onPress?: any;
  };
  onPress: () => void;
}

const ProfileListItem: React.FC<ListItemProps> = ({ item, onPress }) => {
  const navigation = useNavigation<NavigationProp>();

  const redirectToProfileStack = (screenName: string, params = {}) => {
    navigation.navigate("ProfileStack", {
      screen: screenName,
      params
    });
  }

  const handleItemClick = (item: any) => {
    switch (item.title) {
      case PROFILE.EDIT_PROFILE:
        console.log('Redirecting to Edit Profile...');
        redirectToProfileStack(ROUTES.EditProfileScreen);
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
        redirectToProfileStack(ROUTES.ConnectedAccountsScreen);
        break;

      case PROFILE.MY_INTERESTS:
        console.log('Redirecting to My Interests...');
        redirectToProfileStack(ROUTES.SelectInterestScreen, {
          headerTitle: 'My Interests',
          btnTitle: 'Update',
          subTitle: PROFILE.MY_INTERESTS_DESC,
          fromProfile: true
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
        // Example: navigate('/contact-support');
        break;

      case PROFILE.DELETE_ACCOUNT:
        console.log('Redirecting to Delete Account...');
        // Example: navigate('/delete-account');
        onPress();
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
        <Image source={item.image} style={styles.icon} />
        <Text
          style={[
            styles.input,
            { color: item.image ? COLORS.black : COLORS.errorText },
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
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});

export default ProfileListItem;
