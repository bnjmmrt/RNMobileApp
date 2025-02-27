/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { capitalizeFirstLetter, fontFamily } from '../../utils/functions';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT_STATUS,
  ROLE,
} from '../../utils/constants';
import IMAGES from '@images/index';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import ButtonSmall from '../ButtonSmall';
import TitleSubtitle from '../TitleSubTitleComponent/TitleSubtitle';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import FastImage from '@d11/react-native-fast-image';

interface EventHostItemProps {
  item: any;
}

const handlEventPress = () => {
  // navigation.navigate('EventDetailsScreen', {item});
  FlashMessageComponent.show('success', 'in Prrogress..');
};

const EventHostItem: React.FC<EventHostItemProps> = ({ item }) => {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <View style={[styles.container]}>
      <FastImage
        style={[styles.image]}
        source={{ uri: item?.companyLogo }}
        defaultSource={IMAGES.backgroundLogin}
        resizeMode="cover"
      />
      <View style={{ paddingHorizontal: 10, marginEnd: 20 }}>
        <Text style={styles.title}>{capitalizeFirstLetter(item?.name)}</Text>
        <Text style={styles.subtitle}>
          {capitalizeFirstLetter(item?.role?.name)}
        </Text>
      </View>

      {role == ROLE.MEMBER && (
        <ButtonSmall
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.FOLLOW}
          colorTheme={'dark'}
          onPress={handlEventPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    padding: verticalMarginScale(8),
    marginRight: 10,
    borderRadius: 30,
    borderColor: COLORS.borderGray,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'center',
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: radiusScale(20),
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: horizontalMarginScale(8),
    // marginEnd: 20,
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  btnStyle: {
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default EventHostItem;
