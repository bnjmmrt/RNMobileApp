import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import {
  fontScale,
  verticalScale,
  horizontalScale,
  radiusScale,
} from '../../utils/dimensions';

interface FormCardProps {
  styling: string;
  eventName: string;
  name: string;
  containerStyle?: object;
}

const FormCard: React.FC<FormCardProps> = ({
  styling,
  eventName,
  name,
  containerStyle,
}) => {
  return (
    <View style={[styles.formCard, containerStyle]}>
      <FastImage
        source={{ uri: styling }}
        style={styles.formImage}
        defaultSource={IMAGES.eventCoverPlaceholders1}
        resizeMode="cover"
      />
      <View style={styles.formTextContainer}>
        <Text style={styles.eventNameText}>{eventName || '[Event Name]'}</Text>
        <Text style={styles.formNameText}>{name || '[Sign-Up Form Name]'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    width: verticalScale(205),
    marginHorizontal: 'auto',
    borderRadius: radiusScale(16),
    overflow: 'hidden',
    backgroundColor: COLORS.lighter_gray,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formImage: {
    width: '100%',
    height: verticalScale(300),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  formTextContainer: {
    padding: horizontalScale(16),
  },
  eventNameText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  formNameText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.light_gray,
  },
});

export default FormCard;
