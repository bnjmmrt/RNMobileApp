import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { Event } from 'src/types';
import { CustomText } from '../CustomText';

interface EventOverviewProps {
  item: Event; // Extend this type with actual item properties for better type safety.
}

const MAX_LINES = 4;

const EventOverview: React.FC<EventOverviewProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(prev => !prev);

  // Check if "Read More" is needed
  const shouldShowReadMore =
    item?.description && item?.description?.split(' ').length > 26;

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{LABLE.ABOUT_THE_EVENT}</CustomText>

      <View style={styles.divider} />

      <CustomText
        style={styles.subtitle}
        textProps={{
          numberOfLines: expanded ? undefined : MAX_LINES,
        }}>
        {item?.description}
      </CustomText>

      {shouldShowReadMore && <View style={styles.divider} />}

      {shouldShowReadMore && (
        <TouchableOpacity onPress={handleToggle} style={styles.toggleContainer}>
          {!expanded ? (
            <CustomText style={styles.toggleText}>{LABLE.READ_MORE}</CustomText>
          ) : (
            <CustomText style={styles.toggleText}>{LABLE.VIEW_LESS}</CustomText>
          )}

          <Image
            source={expanded ? IMAGES.upArrow : IMAGES.downArrow}
            tintColor={COLORS.light_gray}
            style={styles.toggleIcon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    paddingVertical: verticalMarginScale(18),
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: horizontalMarginScale(16),
  },
  subtitle: {
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: verticalMarginScale(16),
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: verticalMarginScale(16),
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: verticalMarginScale(16),
  },
  toggleText: {
    textDecorationLine: 'underline',
    marginRight: 5,
  },
  toggleIcon: {
    width: verticalScale(10),
    height: verticalScale(10),
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
});

export default EventOverview;
