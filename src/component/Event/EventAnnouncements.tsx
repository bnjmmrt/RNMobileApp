import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ScrollView, Image } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import AvatarInitials from '../AvatarInitials';
import { ANNOUNCCEMENTS_DATA, COLORS, LABLE } from '../../utils/constants';
import IMAGES from '@images/index';
import { dateFormat, fontFamily } from '../../utils/functions';
import { fontScale, horizontalScale, verticalScale, verticalMarginScale, horizontalMarginScale, Wp, radiusScale } from 'src/utils/dimensions';
import ImagePdfViewer from './ImagePdfViewer';
import { useFetchHostEventsAnnouncementQuery } from 'src/redux/actions/eventApiAction';

interface EventAnnouncementProps {
  announcementData?: any,
  eventId: string;
  handleAddPress: () => void,
  handleViewAll: () => void
}


const EventAnnouncements: React.FC<EventAnnouncementProps> = ({ eventId, handleAddPress, handleViewAll, announcementData }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [media, setMedia] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [announcementListData, setannouncementListData] = useState([]);

  console.log("announcementData", announcementData?.data)

  useEffect(() => {
    if (announcementData != undefined) {
      setannouncementListData(announcementData?.data);
      setShowAll(announcementData?.data?.length > 2)
    }
  }, [announcementData]);

  const MediaItem = ({ item, media }: { item: any, media: any }) => (
    item.mediaType === "image" ? (
      <TouchableOpacity onPress={() => {
        setMedia(media)
        setViewerVisible(true)
      }}>
        <FastImage source={{ uri: item?.media }} style={styles.mediaImage} />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => {
        setMedia(media)
        setViewerVisible(true)
      }} style={styles.pdfContainer}>
        <Image source={IMAGES.pdf} style={styles.pdfIcon} resizeMode='contain' />
        <Text style={styles.title} numberOfLines={2}>{item?.mediaName}</Text>
        {/* <Text style={styles.pdfSize}>{item.size}</Text> */}
      </TouchableOpacity>
    )
  );

  const EventItem = ({ item }: { item: any }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldShowReadMore = item?.announcement?.split(' ').length > 25;
    const displayedText = expanded || !shouldShowReadMore ? item?.announcement : `${item?.announcement.substring(0, 100)}...`;
    const date = dateFormat(item?.createdAt, 'DD/MM/YYYY')
    const imageKeyUrl = item?.user?.additionalHostInformation?.companyLogo
    const name = item?.user?.additionalHostInformation?.firstName + ' ' + item?.user?.additionalHostInformation?.lastName
    return (
      <View style={styles.talentItem}>
        {imageKeyUrl?.includes("http") ? (
          <FastImage source={{ uri: imageKeyUrl }} style={styles.icon} />
        ) : (
          <AvatarInitials name={name} size={48} />
        )}
        <View style={styles.textContainer}>
          <Text numberOfLines={expanded ? undefined : 3} style={styles.name}>{displayedText}</Text>
          <Text style={styles.subtitle}>{date}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 5 }}>
            {item?.attachments?.map((mediaItem: string, index: number) => (
              <MediaItem key={index} item={mediaItem} media={item.attachments} />
            ))}
          </ScrollView>
          {!expanded && shouldShowReadMore && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>{LABLE.READ_MORE}</Text>
              <Image source={IMAGES.downArrow} style={styles.toggleIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  const viewerClose = () => {
    setViewerVisible(false)
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.heading}>{LABLE.EVENT_ANNOUNCEMENTS}</Text>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleAddPress}>
          <Image source={IMAGES.plus} tintColor={'black'} style={styles.addicon} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <FlatList
        data={announcementListData.slice(0, 3)}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => <EventItem item={item} />}
        ListEmptyComponent={
          <View>
            <Text style={styles.heading}>{LABLE.NO_EVENT_ANNOUNCEMENTS}</Text>
          </View>
        }
      />

      {announcementListData.length != 0 && (
        <View style={{ paddingVertical: 5 }}>
          <View style={styles.divider} />
          <TouchableOpacity onPress={handleViewAll} style={[styles.toggleContainer, { marginTop: 5 }]}>
            <Text style={styles.toggleText}>{LABLE.VIEW_ALL}</Text>
            <Image source={IMAGES.downArrow} style={styles.toggleIcon} />
          </TouchableOpacity>
        </View>
      )}
      {viewerVisible &&
        <ImagePdfViewer
          visible={viewerVisible}
          onClose={viewerClose}
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
  addicon: {
    width: verticalScale(16),
    height: verticalScale(16),
  },
  iconWrapper: {
    width: verticalScale(24),
    height: verticalScale(24),
    borderRadius: radiusScale(24),
    backgroundColor: COLORS.tabBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginStart: 10,
    gap: 5
  },
  pdfIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginVertical: 5
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(12),
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  divider: {
    height: 1,
    width: Wp(92),
    alignSelf: 'center',
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
    width: 10,
    height: 7,
    tintColor: COLORS.tabBorderColor,
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
