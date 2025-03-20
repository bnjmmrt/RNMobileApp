import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import { fontScale, verticalMarginScale } from 'src/utils/dimensions';
import { Event } from 'src/types';

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
      <Text style={styles.title}>{LABLE.ABOUT_THE_EVENT}</Text>

      <View style={styles.divider} />

      <Text
        style={styles.subtitle}
        numberOfLines={expanded ? undefined : MAX_LINES}>
        {item?.description}
      </Text>

      {shouldShowReadMore && <View style={styles.divider} />}

      {shouldShowReadMore && (
        <TouchableOpacity onPress={handleToggle} style={styles.toggleContainer}>
          {!expanded ? (
            <Text style={styles.toggleText}>{LABLE.READ_MORE}</Text>
          ) : (
            <Text style={styles.toggleText}>{LABLE.VIEW_LESS}</Text>
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
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    borderRadius: 15,
    paddingTop: verticalMarginScale(16),
    paddingBottom: verticalMarginScale(8),
    backgroundColor: COLORS.white,
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(16),
    marginBottom: 5,
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: verticalMarginScale(15),
  },
  subtitle: {
    color: COLORS.black,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: verticalMarginScale(15),
    paddingVertical: verticalMarginScale(4),
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: verticalMarginScale(15),
  },
  toggleText: {
    color: COLORS.black2,
    textDecorationLine: 'underline',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginRight: 5,
  },
  toggleIcon: {
    width: 10,
    height: 10,
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
});

export default EventOverview;
