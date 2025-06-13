import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import ImagePdfViewer from 'src/component/Event/ImagePdfViewer';
import AnnouncementItemSkeleton from 'src/component/Event/AnnouncementItemSkeleton';
import Header from 'src/component/Header/Header';
import { ROUTES } from 'src/navigation/Route';
import { useFetchHostEventsAnnouncementQuery } from 'src/redux/actions/eventApiAction';
import { RootState } from 'src/redux/slices';
import { ANNOUNCEMENT, COLORS, LABLE, ROLE } from 'src/utils/constants';
import { formatViewAnnouncementDate } from 'src/utils/dateFunctions';
import { verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import AnnouncementStyles from './styles';
import { CustomText } from 'src/component/CustomText';
import FileDetails from 'src/component/FileDetails';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { getCachedFileDetails } from 'src/utils/cache.utils';
import { FileDetailsCache } from 'types/cache.types';
import CustomPDFView from 'src/component/CustomPDFView';

interface AnnouncementProps extends NativeStackScreenProps<any, any> {}
type RouteParams = {
  params: any;
};

// Move MediaItem component outside of Announcement
const MediaItem = ({
  item,
  media,
  name,
  image,
  index,
  onPress,
}: {
  item: any;
  media: any;
  name: any;
  image: any;
  index: number;
  onPress: (media: any, name: string, image: string, index: number) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [cacheDetails, setCachedDetails] = useState<FileDetailsCache | null>(
    null,
  );

  const calcImageWidth = (width?: number, height?: number) => {
    if (!width || !height) {
      return 95; // Default width if dimensions are not available
    }
    const calculatedWidth = (width / height) * 128; // Maintain aspect ratio
    return calculatedWidth;
  };

  useEffect(() => {
    const fetchCachedDetails = async () => {
      try {
        setLoading(true);
        const details = await getCachedFileDetails(item?.media, {
          isPDF: item?.mediaType === 'pdf',
        });
        setCachedDetails(details);
      } catch (e) {
        console.log('Error fetching cached details:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchCachedDetails();
  }, [item]);

  return (
    <SkeletonPlaceholder enabled={loading}>
      {item.mediaType === 'image' ? (
        <TouchableOpacity
          onPress={() => onPress(media, name, image, index)}
          style={[
            AnnouncementStyles().mediaContainer,
            {
              width: cacheDetails?.dimensions
                ? calcImageWidth(
                    cacheDetails?.dimensions?.width,
                    cacheDetails?.dimensions.height,
                  )
                : 95,
            },
          ]}>
          <FastImage
            source={{ uri: item?.media }}
            style={AnnouncementStyles().mediaImage}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => onPress(media, name, image, index)}
          style={AnnouncementStyles().pdfContainer}>
          {item.media ? (
            <CustomPDFView
              uri={item.media}
              singlePage
              style={AnnouncementStyles().pdfDisplay}
            />
          ) : null}
          <FileDetails
            title={item?.mediaName}
            type={item?.mediaType}
            size={cacheDetails?.size || '0'}
          />
        </TouchableOpacity>
      )}
    </SkeletonPlaceholder>
  );
};

// Move AnnouncementItem component outside of Announcement
const AnnouncementItem = ({
  item,
  navigation,
  eventData,
  role,
}: {
  item: any;
  navigation: any;
  eventData: any;
  role: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const styles = AnnouncementStyles();
  const shouldShowReadMore = item?.announcement?.split(' ')?.length > 25;
  const displayedText =
    expanded || !shouldShowReadMore
      ? item?.announcement
      : `${item?.announcement.substring(0, 100)}...`;
  const date = formatViewAnnouncementDate(item?.createdAt);
  const imageKeyUrl = item?.user?.additionalHostInformation?.companyLogo;
  const name = item?.user?.firstName + ' ' + item?.user?.lastName;

  return (
    <View style={styles.Detailcontainer}>
      <View
        style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
        <View style={styles.userInfoRow}>
          <AvatarInitials
            name={name}
            imgUrl={imageKeyUrl}
            size={36}
            textColor="white"
          />

          <View style={styles.userInfoContent}>
            <Text style={styles.headerTitle}>{name}</Text>
            <Text style={styles.subtitle}>{date}</Text>
          </View>

          {role === ROLE.HOST && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('EventStack', {
                  screen: 'AddAnnouncementScreen',
                  params: { eventData, announcementId: item?.id },
                });
              }}
              style={[styles.iconWrapper]}>
              <Image source={IMAGES.pencil} style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.lineView} />
      <View style={styles.textContainer}>
        <Text numberOfLines={expanded ? undefined : 3} style={styles.name}>
          {displayedText}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item?.attachments?.map((mediaItem: string, index: number) => (
            <MediaItem
              key={index}
              index={index}
              item={mediaItem}
              media={item.attachments}
              name={name}
              image={imageKeyUrl}
              onPress={(media, name, image, index) => {
                console.log('Media item pressed', {
                  media,
                  name,
                  image,
                  index,
                });
              }}
            />
          ))}
        </ScrollView>
        {!expanded && shouldShowReadMore ? (
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.toggleContainer}>
            <Text style={styles.toggleText}>{ANNOUNCEMENT.READ_MORE}</Text>
            <FastImage source={IMAGES.downArrow} style={styles.toggleIcon} />
          </TouchableOpacity>
        ) : (
          shouldShowReadMore && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              style={styles.toggleContainer}>
              <Text style={styles.toggleText}>{ANNOUNCEMENT.READ_LESS}</Text>
              <FastImage source={IMAGES.downArrow} style={styles.toggleIcon} />
            </TouchableOpacity>
          )
        )}
      </View>
      <View style={styles.lineView} />
      <View style={styles.recipientHeader}>
        <Text style={styles.headerDes}>{ANNOUNCEMENT.Send_to}</Text>
        <View style={styles.countWrapper}>
          <Text style={styles.label}>
            {item?.recipientCount} {ANNOUNCEMENT.Recipients}
          </Text>
        </View>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{ marginVertical: verticalMarginScale(10) }}>
        {item?.ticketType.map((item: any) => {
          return (
            <View style={[styles.countWrapper, styles.recipientItem]}>
              <Text style={styles.label}>{item?.name}</Text>
            </View>
          );
        })}
        {item?.addedBy.map((item: any) => {
          let selectedName =
            item?.firstName == 'NA'
              ? ' -- '
              : item?.firstName + ' ' + item?.lastName;
          return (
            <View style={[styles.countWrapper, styles.recipientItem]}>
              <Text style={styles.label}>{selectedName} </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const Announcement: React.FC<AnnouncementProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<RouteParams>>();
  const eventData = route?.params;
  const styles = AnnouncementStyles();
  const [announcementData, setannouncementData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [media, setMedia] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const role = useSelector((state: RootState) => state.auth.role);
  const [currentIndex, setCurrentIndex] = useState(0);

  const queryArgs = {
    eventId: eventData?.id,
    take: 10,
    skip: (currentPage - 1) * 10,
  };
  const { data, isLoading, refetch } =
    useFetchHostEventsAnnouncementQuery(queryArgs);
  useEffect(() => {
    if (data) {
      setannouncementData(prev =>
        currentPage === 1
          ? data?.data?.result
          : [...prev, ...data?.data?.result],
      );
      setIsDataLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setRefreshing(isLoading);
  }, [isLoading]);

  const handleRefresh = () => {
    setCurrentPage(1);
  };

  const loadMore = () => {
    if (data?.currentPage < data?.totalPages && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [data]),
  );

  const AnnouncementItem = ({ item }: { item: any }) => {
    const [expanded, setExpanded] = useState(false);
    const shouldShowReadMore = item?.announcement?.split(' ')?.length > 25;
    const displayedText =
      expanded || !shouldShowReadMore
        ? item?.announcement
        : `${item?.announcement.substring(0, 100)}...`;
    const date = formatViewAnnouncementDate(item?.createdAt);
    const imageKeyUrl = item?.user?.additionalHostInformation?.companyLogo;
    const name = item?.user?.firstName + ' ' + item?.user?.lastName;

    return (
      <View style={styles.Detailcontainer}>
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <AvatarInitials
              name={name}
              imgUrl={imageKeyUrl}
              size={36}
              textColor="white"
            />

            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <Text style={styles.headerTitle}>{name}</Text>
              <Text style={styles.subtitle}>{date}</Text>
            </View>

            {role === ROLE.HOST && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EventStack', {
                    screen: 'AddAnnouncementScreen',
                    params: { eventData, announcementId: item?.id }, // Wrap in params
                  });
                }}
                style={[styles.iconWrapper]}>
                <Image source={IMAGES.pencil} style={styles.icon} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.lineView} />
        <View style={styles.textContainer}>
          <Text numberOfLines={expanded ? undefined : 3} style={styles.name}>
            {displayedText}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item?.attachments?.map((mediaItem: string, index: number) => (
              <MediaItem
                key={index}
                index={index}
                item={mediaItem}
                media={item.attachments}
                name={name}
                image={imageKeyUrl}
                onPress={(media, name, image, index) => {
                  setMedia(media);
                  setCompanyName(name);
                  setCompanyLogo(image);
                  setCurrentIndex(index);
                  setViewerVisible(true);
                }}
              />
            ))}
          </ScrollView>
          {shouldShowReadMore && (
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              style={styles.toggleContainer}>
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
        <View style={styles.lineView} />
        <View style={styles.recipientHeader}>
          <Text style={styles.headerDes}>{ANNOUNCEMENT.Send_to}</Text>
          <View style={styles.countWrapper}>
            <Text style={styles.label}>
              {item?.recipientCount} {ANNOUNCEMENT.Recipients}
            </Text>
          </View>
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{ marginVertical: verticalMarginScale(10) }}>
          {item?.ticketType.map((item: any) => {
            return (
              <View
                style={[
                  styles.countWrapper,
                  {
                    marginHorizontal: 3,
                    backgroundColor: 'transparant',
                    paddingVertical: verticalScale(5),
                  },
                ]}>
                <Text style={styles.label}>{item?.name}</Text>
              </View>
            );
          })}
          {item?.addedBy.map((item: any) => {
            let selectedName =
              item?.additionalHostInformation?.companyName == 'NA'
                ? ' -- '
                : item?.additionalHostInformation?.companyName;
            return (
              <View
                style={[
                  styles.countWrapper,
                  {
                    marginHorizontal: 3,
                    backgroundColor: 'transparant',
                    paddingVertical: verticalScale(5),
                  },
                ]}>
                <Text style={styles.label}>{selectedName} </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const onClose = () => {
    setViewerVisible(false);
  };
  return (
    <View style={styles.container}>
      <Header
        headerTitle={ANNOUNCEMENT.Announcement}
        onPress={handleBackPress}
        rightIcon={role === ROLE.HOST ? IMAGES.plus : null}
        onPressRightIcon={() => {
          navigation.navigate(ROUTES.EventStack, {
            screen: ROUTES.AddAnnouncementScreen,
            params: { eventData, announcementId: null },
          });
        }}
        showProgressBar={false}
        rightIconWrapperStyle={{ backgroundColor: COLORS.black }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {isDataLoading && (
            <FlatList
              data={[1, 2, 3]} // Show 3 skeleton items
              style={styles.flatListContainer}
              keyExtractor={item => `skeleton-${item}`}
              renderItem={() => <AnnouncementItemSkeleton />}
            />
          )}

          {!isDataLoading && (
            <FlatList
              data={announcementData}
              style={styles.flatListContainer}
              renderItem={({ item }) => (
                <AnnouncementItem
                  item={item}
                  navigation={navigation}
                  eventData={eventData}
                  role={role}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <EventEmptyRecord
                    title={LABLE.NO_EVENT_ANNOUNCEMENTS}
                    subTitle=""
                    isLoading={isLoading}
                  />
                </View>
              }
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              refreshControl={
                announcementData?.length > 0 ? (
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
                  />
                ) : undefined
              }
            />
          )}
        </View>
      </ScrollView>
      {viewerVisible && (
        <ImagePdfViewer
          visible={true}
          onClose={() => onClose()}
          mediaItems={media}
          index={currentIndex}
          name={companyName}
          logo={companyLogo}
        />
      )}
    </View>
  );
};

export default Announcement;
