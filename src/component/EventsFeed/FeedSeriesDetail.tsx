import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, ScrollView} from 'react-native';
import {Image} from 'react-native-animatable';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import {Wp, Hp} from '../../utils/dimensions';
import IMAGES from '../../assets/images';
import type {EventItem, SeriesItem} from './EventsFeed';
import CollapsibleView from '../CollapsibleView';
import {format} from 'date-fns';
import FeedDetail from './FeedDetail';

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
              <Image
                source={series.image || IMAGES.eventCoverPlaceholders1}
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
                <Text style={styles.revolve}>REVOLVE</Text>
                <View style={styles.hostContainer}>
                  <Text style={styles.hostName}>Revolve</Text>
                  <Text style={styles.hostRole}>Host</Text>
                </View>
                <Text style={styles.followButton}>Follow</Text>
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

      <FeedDetail detail={detail} setDetail={setDetail} />
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
      <Image
        source={
          event.image ? {uri: event.image} : IMAGES.eventCoverPlaceholders1
        }
        style={styles.eventImage}
        alt="event"
      />
      <View style={styles.eventBody}>
        <Text style={styles.title}>{event.title}</Text>
        <Text>{formatEventDate(event.startDate)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    height: '100%',
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  seriesImage: {
    height: Hp(33),
    width: Wp(97),
    borderRadius: 24,
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  revolveFollow: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: '#E1E1E1',
    borderWidth: 1,
    padding: 8,
    gap: 8,
    borderRadius: 100,
    width: '70%',
    marginVertical: 16,
    alignItems: 'center',
  },
  revolve: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    fontSize: 7,
    paddingTop: 12,
    borderRadius: 100,
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
  },
  readMoreCard: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopColor: '#E1E1E1',
    borderTopWidth: 1,
  },
  hostContainer: {
    flex: 1,
  },
  hostName: {
    color: 'black',
  },
  hostRole: {
    color: 'gray',
  },
  followButton: {
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
    backgroundColor: 'black',
    color: 'white',
  },
  leftArrowBtn: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 100,
  },
  seriesBox: {
    borderWidth: 1,
    borderRadius: 16,
    borderColor: '#E1E1E1',
  },
  label: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  description: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  fullDescription: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 4,
  },
  readMore: {
    textDecorationLine: 'underline',
  },
  arrow: {
    height: 16,
    width: 16,
    marginLeft: 8,
  },
  eventContainer: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
  },
  eventImage: {
    height: Hp(25),
    width: Wp(25),
    borderRadius: 12,
  },
  eventBody: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 16,
  },
});

export default FeedSeriesDetail;
