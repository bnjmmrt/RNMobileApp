import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
  horizontalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import IMAGES from '@images/index';
import { Vouch } from '../types';
import AvatarInitials from 'src/component/AvatarInitials';

interface GuestVouchesProps {
  requestSource?: string;
  vouches: Vouch[];
}

const GuestVouches: React.FC<GuestVouchesProps> = ({
  requestSource,
  vouches,
}) => {
  if (!requestSource && (!vouches || vouches.length === 0)) {
    return null;
  }

  return (
    <View style={styles.container}>
      {requestSource && (
        <View style={styles.sourceSection}>
          <View style={styles.iconContainer}>
            <Image source={IMAGES.phone01} style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Request Source</Text>
            <Text style={styles.value}>In-App</Text>
          </View>
        </View>
      )}

      <View style={styles.vouchContainer}>
        {vouches.map(vouch => (
          <View key={vouch.email} style={styles.vouchSection}>
            <AvatarInitials
              name={vouch.name}
              size={32}
              imgUrl={vouch.picture}
              backgroundColor={COLORS.neutral_surface}
            />

            <View style={styles.textContainer}>
              <Text style={styles.label}>Vouched by</Text>
              <Text style={styles.value}>{vouch.name}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: horizontalMarginScale(12),
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(16),
    borderColor: COLORS.neutralBorder,
    borderWidth: verticalScale(1),
    overflow: 'hidden',
  },
  sourceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: horizontalMarginScale(12),
  },
  vouchContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.neutralBorder,
  },
  vouchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: horizontalMarginScale(12),
  },
  iconContainer: {
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: radiusScale(100),
    backgroundColor: COLORS.lighter_gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    tintColor: COLORS.black,
    resizeMode:'contain'
  },

  textContainer: {
    marginLeft: horizontalMarginScale(12),
  },
  label: {
    fontSize: fontScale(11),
    color: COLORS.light_text,
    marginBottom: verticalMarginScale(2),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  value: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
});

export default GuestVouches;
