import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';

interface EventFeatureTalentsProps {
  item: {}; // Extend this type with actual item properties for better type safety.
}

const MAX_LINES = 4;

const EventFeatureTalents: React.FC<EventFeatureTalentsProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded((prev) => !prev);

  // Check if "Read More" is needed
  const shouldShowReadMore = LABLE.DUMMY_TEXT.split(' ').length > 30;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{LABLE.FEATURED_TALENT}</Text>

      <View style={styles.divider} />

      <Text
        style={styles.subtitle}
        numberOfLines={expanded ? undefined : MAX_LINES}
      >
        {LABLE.DUMMY_TEXT}
      </Text>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    borderRadius: 15,
    marginVertical: 10,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  title: {
    color: COLORS.black2,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginBottom: 10,
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
    paddingVertical: 10,
  },
  toggleText: {
    color: COLORS.black2,
    textDecorationLine: 'underline',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginRight: 5,
  },
  toggleIcon: {
    width: 12,
    height: 12,
    tintColor: COLORS.light_gray,
  },
});

export default EventFeatureTalents;
