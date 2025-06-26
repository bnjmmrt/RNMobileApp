import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import { Event } from 'src/types';
import { CustomText } from '../CustomText';

interface EventOverviewProps {
  item: Event; // Extend this type with actual item properties for better type safety.
}

const MAX_LINES = 4;

const EventOverview: React.FC<EventOverviewProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const [fullTextHeight, setFullTextHeight] = useState(0);
  const [truncatedTextHeight, setTruncatedTextHeight] = useState(0);

  const handleToggle = () => setExpanded(prev => !prev);
  const title = LABLE.ABOUT_THE_EVENT;
  const subTitle = item?.description;

  const onFullTextLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setFullTextHeight(height);
  };

  const onTruncatedTextLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setTruncatedTextHeight(height);
  };

  React.useEffect(() => {
    if (fullTextHeight > 0 && truncatedTextHeight > 0) {
      setShouldShowReadMore(fullTextHeight > truncatedTextHeight);
    }
  }, [fullTextHeight, truncatedTextHeight]);

  return (
    <View style={styles.container}>
      <View style={styles.hiddenContainer}>
        <CustomText
          style={[styles.subtitle, styles.hiddenText]}
          textProps={{ onLayout: onFullTextLayout }}>
          {subTitle}
        </CustomText>
        <CustomText
          style={[styles.subtitle, styles.hiddenText]}
          textProps={{
            numberOfLines: MAX_LINES,
            onLayout: onTruncatedTextLayout,
          }}>
          {subTitle}
        </CustomText>
      </View>

      <CustomText style={styles.title}>{title}</CustomText>

      <View style={styles.divider} />

      <CustomText
        style={styles.subtitle}
        textProps={{
          numberOfLines: expanded ? undefined : MAX_LINES,
        }}>
        {subTitle}
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
            style={expanded ? styles.toggleupIcon : styles.toggleIcon}
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
    borderRadius: 16,
    paddingVertical: 18,
    backgroundColor: COLORS.white,
  },
  hiddenContainer: {
    position: 'absolute',
    opacity: 0,
    top: -1000,
    left: 0,
    right: 0,
  },
  hiddenText: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: 16,
  },
  subtitle: {
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toggleText: {
    textDecorationLine: 'underline',
    marginRight: 5,
  },
  toggleIcon: {
    width: 10,
    height: 10,
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
  toggleupIcon: {
    width: 17,
    height: 17,
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
});

export default EventOverview;
