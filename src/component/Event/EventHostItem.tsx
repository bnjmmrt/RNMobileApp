/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, View, Image, Dimensions } from 'react-native';
import {
  capitalizeFirstLetter,
  fontFamily,
  removeSignature,
} from '../../utils/functions';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT_STATUS,
  ROLE,
} from '../../utils/constants';
import IMAGES from '@images/index';
import ButtonSmall from '../ButtonSmall';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import FastImage from '@d11/react-native-fast-image';
import FollowButton from '../FollowButton/FollowButton';
import AvatarInitials from '../AvatarInitials';
import { ROUTES } from 'src/navigation/Route';
import { useNavigation } from '@react-navigation/native';
import { CustomText } from '../CustomText';
import { isIPad } from 'src/utils/isTabletConfig';

interface EventHostItemProps {
  item: any;
  length: number;
}

const handlEventPress = () => {
  // navigation.navigate('EventDetailsScreen', {item});
  FlashMessageComponent.show('success', 'in Prrogress..');
};

const EventHostItem: React.FC<EventHostItemProps> = ({ item, length }) => {
  const role = useSelector((state: RootState) => state.auth.role);
  const { navigate } = useNavigation();
  const getWidth = () => {
    if (length === 1) return Dimensions.get('screen').width - 30;
    if (length === 2) return Dimensions.get('screen').width * 0.65;
    return Dimensions.get('screen').width * 0.55;
  };

  console.log(item, 'chekcing checking');

  return (
    <View style={[styles.container, { width: getWidth() }]}>
      <AvatarInitials
        onPress={() => {
          role == ROLE.MEMBER &&
            navigate('ProfileStack', {
              screen: ROUTES.HostProfileScreen,
              params: { hostId: item.id },
            });
        }}
        imgUrl={removeSignature(item?.companyLogo)}
        size={40}
      />
      <View style={{ paddingHorizontal: 10, marginEnd: 20, flex: 1 }}>
        <CustomText style={styles.title} >
          {capitalizeFirstLetter(item?.name)}
        </CustomText>
        <CustomText style={styles.subtitle}>
          {capitalizeFirstLetter(item?.role?.name)}
        </CustomText>
      </View>

      {role === ROLE.MEMBER && item.role.name === 'host' && (
        <FollowButton
          id={item.id}
          isFollowing={item.isFollowedByCurrentGuest}
          handleRefresh={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 8,
    marginRight: 10,
    borderRadius: 99,
    maxWidth: isIPad ? 260 : 'auto',
    borderColor: COLORS.borderGray,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },
  image: {
    resizeMode: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 8,
  },
  title: {
    width: isIPad ? '100%' : '80%',
    fontFamily: fontFamily.ABCDiatype_Medium,
    fontSize: 14,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 12,
  },
  btnStyle: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default EventHostItem;
