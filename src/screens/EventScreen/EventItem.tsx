import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { fontFamily, formatEventDates } from '../../utils/functions';
import { Wp, Hp, horizontalScale, verticalScale } from '../../utils/dimensions';
import ButtonSmall from '../../component/ButtonSmall';
import FastImage from '@d11/react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from 'src/navigation/Route';
import IMAGES from '@images/index';

interface EventItemProps {
  item: {};
}
const EventItem: React.FC<EventItemProps> = ({ item }) => {

  // Handle the "Next" button press
  const navigation = useNavigation();
  // Handle the "Next" button press


  const handlEventPress = () => {
    navigation.navigate(ROUTES.EventStack, {
      screen: ROUTES.EventDetailsScreen,
      params: item
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer]}>
        <FastImage
          source={{ uri: item?.imageCover }}
          resizeMode={FastImage.resizeMode.center}
          defaultSource={IMAGES.iconRumor} // Your local placeholder image
          style={styles.icon}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.titleStyle}>{item?.name}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item?.startDate}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item?.location?.location}
        </Text>
        <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
          <ButtonSmall
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.VIEW_EVENT}
            colorTheme={'dark'}
            onPress={handlEventPress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingVertical: 7,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    // width: Wp(90),
    height: Hp(24),
    backgroundColor: COLORS.white,
    borderColor: COLORS.borderGray,
    // alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    // height: 100,
  },
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 15,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  errorInputWrapper: {
    borderColor: COLORS.borderRed,
    backgroundColor: COLORS.bgRed,
  },
  icon: {
    borderRadius: 10,
    height: horizontalScale(175),
    width: verticalScale(120),
    backgroundColor: COLORS.borderGray
  },
  titleStyle: {
    fontSize: 22,
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: 5,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 12,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginTop: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.errorText,
  },
});

export default EventItem;
