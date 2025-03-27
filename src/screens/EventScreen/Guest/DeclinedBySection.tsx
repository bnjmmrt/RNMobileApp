import IMAGES from '@images/index';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface DeclinedBySectionProps {
  name: string;
}

const DeclinedBySection: React.FC<DeclinedBySectionProps> = ({ name }) => {
  return (
    <View style={styles.addedByContainer}>
      <View style={styles.addedByAvatarPlaceholder}>
        <Image source={IMAGES.user_x} />
      </View>
      <View style={styles.addedByUser}>
        <Text style={styles.addedByText}>Declined by</Text>
        <Text style={styles.addedByName}>{name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addedByContainer: {
    marginTop: verticalMarginScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(8),
    borderColor: COLORS.neutralBorder,
    borderWidth: verticalScale(1),
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
  },
  addedByText: {
    fontSize: fontScale(11),
    color: COLORS.light_text,
    marginBottom: verticalMarginScale(2),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  addedByUser: {
    marginLeft: horizontalMarginScale(8),
  },
  addedByAvatar: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: radiusScale(100),
  },
  addedByAvatarPlaceholder: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: radiusScale(100),
    backgroundColor: COLORS.lighter_gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addedByAvatarText: {
    fontSize: fontScale(12),
    color: COLORS.dark_gray,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  addedByName: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default DeclinedBySection;
