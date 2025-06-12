import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { convertUTCToTimeZoneFormat } from 'src/utils/dateFunctions';
import { ANNOUNCEMENT, COLORS, LABLE, ROLE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import AvatarInitials from '../AvatarInitials';
import { CustomText } from '../CustomText';
import ImagePdfViewer from './ImagePdfViewer';
import Pdf from 'react-native-pdf';
import FileDetails from '../FileDetails';

interface EventAnnouncementProps {
  role?: string;
  announcementData?: any;
  eventId: string;
  handleAddPress: () => void;
  handleViewAll: () => void;
}

const EventAnnouncements: React.FC<EventAnnouncementProps> = ({
  eventId,
  handleAddPress,
  handleViewAll,
  announcementData,
  role,
}) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const [media, setMedia] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [announcementListData, setannouncementListData] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [viewAllLess, setviewAllLess] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // const queryArgs = ({ eventId: eventId, take: 50, skip: 0 })
  // console.log("queryArgs", queryArgs)
  // const { data, isLoading } = useFetchHostEventsAnnouncementQuery(queryArgs);

  useEffect(() => {
    if (announcementData != undefined) {
      setannouncementListData(announcementData?.data?.result);
      setShowAll(announcementData?.data?.length > 3);
    }
  }, [announcementData]);

  const MediaItem = ({
    key,
    item,
    media,
    name,
    image,
    index,
  }: {
    key: number;
    item: any;
    media: any;
    name: any;
    image: any;
    index: number;
  }) => {
    const [imageWidth, setImageWidth] = useState<number>(90);
    useEffect(() => {
      if (item.mediaType === 'image' && imageWidth === 90) {
        Image.getSize(
          item.media,
          (width, height) => {
            const calculatedWidth = (width / height) * 128; // Maintain aspect ratio
            setImageWidth(calculatedWidth);
          },
          error => {
            console.error('Error getting image size:', error);
          },
        );
      } else {
        setImageWidth(90); // Default width for non-image media
      }
    }, [item]);

    return item.mediaType === 'image' ? (
      <TouchableOpacity
        onPress={() => {
          setMedia(media);
          setViewerVisible(true);
          setCompanyName(name);
          setCompanyLogo(image);
          setCurrentIndex(index);
        }}
        style={[
          styles.mediaContainer,
          {
            minWidth: imageWidth,
          },
        ]}>
        <FastImage
          source={{ uri: item?.media }}
          style={styles.mediaImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          setMedia(media);
          setViewerVisible(true);
          setCompanyName(name);
          setCompanyLogo(image);
          setCurrentIndex(index);
        }}
        style={styles.pdfContainer}>
        {item.media ? (
          <Pdf
            source={{
              uri: item.media,
            }}
            renderActivityIndicator={() => <View />}
            singlePage
            style={styles.pdfDisplay}
          />
        ) : (
          <>
            <Image
              source={IMAGES.pdf}
              style={styles.pdfIcon}
              resizeMode="contain"
            />
            <Text style={styles.title} numberOfLines={2}>
              {item?.mediaName}
            </Text>
          </>
        )}

        <FileDetails
          title={item?.mediaName}
          type={item?.mediaType}
          fileUrl={item?.media}
        />
      </TouchableOpacity>
    );
  };

  const EventItem = ({ item }: { item: any }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldShowReadMore = item?.announcement?.split(' ').length > 25;
    const displayedText =
      expanded || !shouldShowReadMore
        ? item?.announcement
        : `${item?.announcement.substring(0, 100)}...`;
    const date = convertUTCToTimeZoneFormat(
      item?.createdAt,
      item?.timeZone,
      'MM/DD/YYYY',
    );
    const imageKeyUrl = item?.user?.additionalHostInformation?.companyLogo;
    const name =
      item?.user?.additionalHostInformation?.firstName +
      ' ' +
      item?.user?.additionalHostInformation?.lastName;
    const companyName = item?.user?.additionalHostInformation?.companyName;

    return (
      <View style={styles.talentItem}>
        {imageKeyUrl?.includes('https') ? (
          <FastImage source={{ uri: imageKeyUrl }} style={styles.icon} />
        ) : (
          <AvatarInitials name={name} size={48} />
        )}
        <View style={styles.textContainer}>
          <CustomText
            textProps={{
              numberOfLines: expanded ? undefined : 3,
            }}
            style={styles.name}>
            {displayedText}
          </CustomText>
          <CustomText style={styles.subtitle}>{date}</CustomText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 5 }}>
            {item?.attachments?.map((mediaItem: string, index: number) => {
              // console.log("Index:", index, "MediaItem:", mediaItem);
              return (
                <MediaItem
                  key={index}
                  index={index}
                  item={mediaItem}
                  media={item.attachments}
                  name={companyName}
                  image={imageKeyUrl}
                />
              );
            })}
          </ScrollView>
          {/* {!expanded && shouldShowReadMore && (
            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>{LABLE.READ_MORE}</Text>
              <Image source={IMAGES.downArrow} style={styles.toggleIcon} />
            </TouchableOpacity>
          )} */}
          {shouldShowReadMore && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              style={[
                styles.toggleContainer,
                {
                  marginTop: 10,
                },
              ]}>
              <CustomText style={styles.toggleText}>
                {!expanded ? ANNOUNCEMENT.READ_MORE : ANNOUNCEMENT.READ_LESS}
              </CustomText>
              <Image
                source={expanded ? IMAGES.upArrow : IMAGES.downArrow}
                style={expanded ? styles.toggleupIcon : styles.toggleIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  const viewerClose = () => {
    setViewerVisible(false);
  };

  const onClickViewAll = () => {
    console.log('role', role);
    if (role == ROLE.HOST) {
      handleViewAll;
    } else {
      viewAllLess ? setviewAllLess(false) : setviewAllLess(true);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}>
        <CustomText style={styles.heading}>
          {LABLE.EVENT_ANNOUNCEMENTS}
        </CustomText>
        {role === ROLE.HOST && (
          <TouchableOpacity style={styles.iconWrapper} onPress={handleAddPress}>
            <Image
              source={IMAGES.plus}
              tintColor={'black'}
              style={styles.addicon}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.divider} />
      <FlatList
        data={
          viewAllLess ? announcementListData?.slice(0, 3) : announcementListData
        }
        keyExtractor={(item: any) => item?.id}
        renderItem={({ item }) => <EventItem item={item} />}
        style={{
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={
          <CustomText style={{ marginVertical: 16 }}>
            {LABLE.NO_EVENT_ANNOUNCEMENTS}
          </CustomText>
        }
      />
      {announcementListData?.length > 0 && (
        <>
          <View style={[styles.divider, { marginBottom: 20 }]} />
          <View style={{ paddingBottom: 20, paddingHorizontal: 16 }}>
            {role == ROLE.HOST ? (
              <TouchableOpacity
                onPress={handleViewAll}
                style={[styles.toggleContainer]}>
                <CustomText style={styles.toggleText}>
                  {LABLE.VIEW_ALL}
                </CustomText>
                <Image source={IMAGES.downArrow} style={styles.toggleIcon} />
              </TouchableOpacity>
            ) : (
              <>
                {announcementListData?.length > 3 && (
                  <TouchableOpacity
                    onPress={() => setviewAllLess(!viewAllLess)}
                    style={[styles.toggleContainer]}>
                    <CustomText style={styles.toggleText}>
                      {viewAllLess ? LABLE.VIEW_ALL : LABLE.VIEW_LESS}
                    </CustomText>
                    <Image
                      source={IMAGES.downArrow}
                      style={styles.toggleIcon}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </>
      )}

      {viewerVisible && (
        <ImagePdfViewer
          visible={true}
          onClose={() => viewerClose()}
          index={currentIndex}
          mediaItems={media}
          name={companyName}
          logo={companyLogo}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    paddingTop: 12,
    backgroundColor: COLORS.white,
  },
  heading: {
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: COLORS.borderGray,
  },
  addicon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: COLORS.tabBorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginStart: 16,
  },
  pdfIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  pdfDisplay: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: 12,
    marginTop: 8,
  },
  title: {
    color: COLORS.black2,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  divider: {
    height: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: COLORS.borderGray,
  },
  talentItem: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  name: {
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    textDecorationLine: 'underline',
    marginRight: 5,
  },
  toggleIcon: {
    width: 10,
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
  toggleupIcon: {
    width: 17,
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
  mediaContainer: {
    minWidth: 90,
    height: 128,
    marginRight: 10,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    objectFit: 'contain',
  },
  pdfContainer: {
    width: 90.5,
    height: 128,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: COLORS.lighter_gray,
  },
  pdfSize: {
    fontSize: 12,
    color: 'gray',
  },
});

export default EventAnnouncements;
