import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, Modal, ScrollView} from 'react-native';
import {Image} from 'react-native-animatable';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import IMAGES from '../../assets/images';
import type {EventItem, SeriesItem} from './EventsFeed';
import {format} from 'date-fns';
import FeedDetail from './FeedDetail';
import FastImage from '@d11/react-native-fast-image';
import {
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  verticalScale,
  radiusScale,
  fontScale,
  Hp,
  Wp,
} from '../../utils/dimensions';

interface FeedSeriesDetailProps {
  series: SeriesItem | null;
  setSeries: React.Dispatch<React.SetStateAction<SeriesItem | null>>;
}

const FeedSeriesDetail: React.FC<FeedSeriesDetailProps> = ({
  series,
  setSeries,
}) => {
  const [detail, setDetail] = useState<EventItem | null>(null);
  const [readMore, setReadMore] = useState<number | undefined>(5);
  const [responseSubmitted, setResponseSubmitted] = useState<boolean>(false);

  const handleNotify = useCallback(() => {
    setResponseSubmitted(true);
    setTimeout(() => {
      setResponseSubmitted(false);
    }, 3000);
  }, [setResponseSubmitted]);

  if (!series) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={!!series}
      onRequestClose={() => setSeries(null)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View>
              <FastImage
                source={series.image || IMAGES.eventCoverPlaceholders1}
                resizeMode={FastImage.resizeMode.cover}
                defaultSource={IMAGES.eventCoverPlaceholders1}
                style={styles.seriesImage}
              />
              <View
                style={styles.leftArrowBtn}
                onTouchEnd={() => setSeries(null)}>
                <Image source={IMAGES.leftArrow} alt="left arrow" />
              </View>
            </View>
            <View style={styles.contentContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {series.title}
              </Text>
              <View style={styles.revolveFollow}>
                <View style={styles.revolve}>
                  <Text style={styles.revolveText}>REVOLVE</Text>
                </View>
                <View style={styles.hostContainer}>
                  <Text style={styles.hostName}>Revolve</Text>
                  <Text style={styles.hostRole}>Host</Text>
                </View>
                <View style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </View>
              </View>
              <View style={styles.seriesBox}>
                <Text style={styles.label}>About the Series</Text>
                <Text style={styles.description} numberOfLines={readMore}>
                  {series.about}
                </Text>
                <View
                  style={styles.readMoreCard}
                  onTouchEnd={() =>
                    setReadMore(prev => (prev ? undefined : 5))
                  }>
                  <Text style={styles.readMore}>Read More</Text>
                  <Image
                    source={readMore ? IMAGES.downArrow : IMAGES.upArrow}
                    style={styles.arrow}
                  />
                </View>
              </View>
              {series.events.map((event, index) => (
                <EventItem event={event} setDetail={setDetail} key={index} />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {responseSubmitted && (
        <View style={styles.responseSubmitted}>
          <Image source={IMAGES.check1} style={styles.check1} />
          <Text style={styles.responseSubmittedText}>Response Submitted</Text>
        </View>
      )}

      <FeedDetail
        detail={detail}
        setDetail={setDetail}
        handleNotify={handleNotify}
      />
    </Modal>
  );
};

interface EventItemProps {
  event: EventItem;
  setDetail: React.Dispatch<React.SetStateAction<EventItem | null>>;
}

const EventItem: React.FC<EventItemProps> = ({event, setDetail}) => {
  const formatEventDate = (dateString: string): string => {
    if (dateString === 'Invalid Date') return dateString;
    const [year, month, day] = [
      dateString.slice(6, 10),
      dateString.slice(0, 2),
      dateString.slice(3, 5),
    ];
    return format(new Date(`${month}-${day}-${year}`), 'MMM d, p');
  };

  return (
    <View style={styles.eventContainer} onTouchEnd={() => setDetail(event)}>
      <FastImage
        source={event.image ? {uri: event.image} : IMAGES.eventCoverPlaceholders1}
        resizeMode={FastImage.resizeMode.cover}
        defaultSource={IMAGES.eventCoverPlaceholders1}
        style={styles.icon}
      />
      <View style={styles.eventBody}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.content}>{formatEventDate(event.startDate)}</Text>
        <Text style={styles.content}>{event.location}</Text>
      </View>
      <Image source={IMAGES.arrowRight} alt="arrow-right" />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayMiddle,
  },
  modalContent: {
    width: Wp(100),
    backgroundColor: COLORS.white,
    paddingVertical: verticalMarginScale(32),
    height: Hp(100),
    paddingHorizontal: horizontalMarginScale(16),
  },
  scrollViewContent: {
    paddingVertical: verticalMarginScale(20),
  },
  seriesImage: {
    height: Hp(33),
    width: Wp(97),
    borderRadius: radiusScale(24),
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  revolveFollow: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
    gap: 8,
    borderRadius: radiusScale(100),
    width: Wp(70),
    marginVertical: verticalMarginScale(16),
    alignItems: 'center',
  },
  revolve: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: radiusScale(100),
    backgroundColor: COLORS.black,
  },
  revolveText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: fontScale(7),
  },
  readMoreCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(8),
    borderTopColor: COLORS.borderGray,
    borderTopWidth: 1,
  },
  hostContainer: {
    flex: 1,
  },
  hostName: {
    color: COLORS.black,
  },
  hostRole: {
    color: COLORS.light_gray,
  },
  followButton: {
    borderRadius: radiusScale(100),
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(16),
    marginLeft: horizontalMarginScale(8),
    backgroundColor: COLORS.black,
  },
  followButtonText: {
    color: COLORS.white,
  },
  leftArrowBtn: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(100),
  },
  seriesBox: {
    borderWidth: 1,
    borderRadius: radiusScale(16),
    borderColor: COLORS.borderGray,
  },
  label: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalMarginScale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGray,
  },
  description: {
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(16),
  },
  fullDescription: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    borderTopWidth: 1,
    borderTopColor: COLORS.borderGray,
  },
  title: {
    fontSize: fontScale(20),
    lineHeight: 24,
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(4),
  },
  content: {
    fontSize: fontScale(12),
    lineHeight: 14,
    fontWeight: '500',
  },
  readMore: {
    textDecorationLine: 'underline',
  },
  arrow: {
    height: verticalScale(16),
    width: horizontalScale(16),
    marginLeft: horizontalMarginScale(8),
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalMarginScale(12),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(12),
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(121),
    width: horizontalScale(82),
    borderRadius: radiusScale(12),
    backgroundColor: COLORS.borderGray,
    overflow: 'hidden',
  },
  eventBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: horizontalMarginScale(16),
  },
  responseSubmitted: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    gap: 6,
    left: 144,
    bottom: 56,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: 6,
    backgroundColor: COLORS.grayMiddle,
  },
  responseSubmittedText: {
    color: COLORS.white,
  },
  check1: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
});

export default FeedSeriesDetail;
