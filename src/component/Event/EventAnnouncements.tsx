import React, { useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import AvatarInitials from '../AvatarInitials';
import { ANNOUNCCEMENTS_DATA, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import { fontFamily } from '../../utils/functions';
import { fontScale, horizontalScale, verticalScale, verticalMarginScale, horizontalMarginScale } from 'src/utils/dimensions';
import ImagePdfViewer from './ImagePdfViewer';

interface EventAnnouncementProps {
  talents: Event;
  handleAddPress: () => void
}


const EventAnnouncements: React.FC<EventAnnouncementProps> = ({ talents, handleAddPress }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [media, setMedia] = useState([]);

  const MediaItem = ({ item, media }: { item: any, media: any }) => (
    item.type === "image" ? (
      <TouchableOpacity onPress={() => {
        setMedia(media)
        setViewerVisible(true)
      }}>
        <FastImage source={{ uri: item.uri }} style={styles.mediaImage} />

      </TouchableOpacity>
    ) : (
      <View style={styles.pdfContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.pdfSize}>{item.size}</Text>
      </View>
    )
  );

  const EventItem = ({ item }: { item: any }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldShowReadMore = item?.description?.split(' ').length > 30;
    const displayedText = expanded || !shouldShowReadMore ? item.description : `${item.description.substring(0, 100)}...`;

    return (
      <View style={styles.talentItem}>
        {item.imageKeyUrl?.includes("http") ? (
          <FastImage source={{ uri: item.imageKeyUrl }} style={styles.icon} />
        ) : (
          <AvatarInitials name={item.name} size={48} />
        )}
        <View style={styles.textContainer}>
          <Text numberOfLines={expanded ? undefined : 3} style={styles.name}>{displayedText}</Text>
          <Text style={styles.subtitle}>{item.date}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.media.slice(0, 3).map((mediaItem, index) => (
              <MediaItem key={index} item={mediaItem} media={item.media} />
            ))}
          </ScrollView>
          {!expanded && shouldShowReadMore && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>{LABLE.READ_MORE}</Text>
              <FastImage source={IMAGES.downArrow} style={styles.toggleIcon} />
            </TouchableOpacity>
          )}
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.heading}>{LABLE.EVENT_ANNOUNCEMENTS}</Text>
        <TouchableOpacity onPress={handleAddPress}>
          <Image source={IMAGES.calendarCircle} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <FlatList
        data={ANNOUNCCEMENTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventItem item={item} />}
        ListEmptyComponent={
          <View>
            <Text style={styles.heading}>{LABLE.NO_EVENT_ANNOUNCEMENTS}</Text>
          </View>
        }
      />
      {viewerVisible && <ImagePdfViewer
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        mediaItems={media}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    borderRadius: 15,
    paddingVertical: verticalMarginScale(20),
    paddingHorizontal: horizontalMarginScale(20),
    backgroundColor: COLORS.white,
  },
  heading: {
    color: COLORS.black2,
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingBottom: verticalMarginScale(5),
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: COLORS.borderGray,
  },
  textContainer: {
    flex: 1,
    marginStart: 10,
    gap: 5
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(12),
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: 10,
  },
  talentItem: {
    flexDirection: 'row',
    marginVertical: verticalMarginScale(10),
  },
  name: {
    color: COLORS.black2,
    fontSize: fontScale(14),
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    color: COLORS.black2,
    textDecorationLine: 'underline',
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginRight: 5,
  },
  toggleIcon: {
    width: 8,
    height: 8,
    tintColor: COLORS.borderGray,
  },
  mediaImage: {
    width: horizontalScale(90),
    height: verticalScale(128),
    borderRadius: 8,
    marginRight: 10,
  },
  pdfContainer: {
    width: horizontalScale(90),
    height: verticalScale(128),
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  pdfSize: {
    fontSize: 12,
    color: "gray",
  },
});

export default EventAnnouncements;
