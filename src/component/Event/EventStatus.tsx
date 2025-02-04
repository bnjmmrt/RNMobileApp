import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, EVENT_STATUS } from '../../utils/constants';
import IMAGES from '@images/index';

interface EventStatusProps {
  status: number;
}

const statusMap = [
  { backgroundColor: COLORS.bgYellow, borderColor: COLORS.borderYellow, image: IMAGES.tickAwaiting, label: EVENT_STATUS.AWAITING },
  { backgroundColor: COLORS.bgBlue, borderColor: COLORS.borderBlue, image: IMAGES.tickInvited, label: EVENT_STATUS.INVITED },
  { backgroundColor: COLORS.bgRed, borderColor: COLORS.borderRed, image: IMAGES.tickDeclined, label: EVENT_STATUS.DECLINED_BY_HOST },
  { backgroundColor: COLORS.bgRed, borderColor: COLORS.borderRed, image: IMAGES.tickDeclined, label: EVENT_STATUS.DECLINED_BY_YOU },
  { backgroundColor: COLORS.bgGreen, borderColor: COLORS.borderGreen, image: IMAGES.tickGoing, label: EVENT_STATUS.GOING },
];

const EventStatus: React.FC<EventStatusProps> = ({ status }) => {
  const statusInfo = statusMap[status];

  if (!statusInfo) return null;

  return (
    <View style={[styles.container, { backgroundColor: statusInfo.backgroundColor, borderColor: statusInfo.borderColor }]}>  
      <Image source={statusInfo.image} style={styles.image} />
      <Text style={styles.subtitle}>{statusInfo.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 5,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
  subtitle: {
    color: COLORS.black2,
    fontSize: 14,
    paddingHorizontal: 5,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default EventStatus;
