import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import EmptyRecordComponent from 'src/component/EmptyRecord/EmptyRecordComponent';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Header from 'src/component/Header/Header';
import { navigateToScreen } from 'src/component/PushNotification';
import SwapToDeleteComponent from 'src/component/SwappableItem/SwapToDeleteComponent';
import {
  useDeleteNotificationMutation,
  useFetchNotificationDetailQuery,
  useFetchNotificationQuery,
} from 'src/redux/actions/usersApiAction';
import { COLORS, LABLE } from 'src/utils/constants';
import { timeAgo } from 'src/utils/dateFunctions';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {
  ApiErrorInterface,
  changeSafeAreaViewConfig,
  getErrorMessage,
} from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { RootState } from 'src/redux/slices';

interface NotificationsScreenProps extends NativeStackScreenProps<any, any> { }

// Define the notification type to fix the linter error
interface Notification {
  id: string;
  title: string;
  message: string;
  image?: string;
  isSeen: boolean;
  createdDate: string;
  body: any
}

const NotificationItemSkeleton = () => {
  return (
    <View style={skeletonStyles.container}>
      <SkeletonPlaceholder
        backgroundColor={COLORS.lighter_gray}
        highlightColor={COLORS.white}
        speed={1200}
        borderRadius={radiusScale(16)}>
        <View style={skeletonStyles.content}>
          <SkeletonPlaceholder.Item width={48} height={48} borderRadius={24} />
          <View style={skeletonStyles.textContainer}>
            <SkeletonPlaceholder.Item
              width="80%"
              height={fontScale(14)}
              borderRadius={radiusScale(4)}
              marginBottom={verticalMarginScale(4)}
            />
            <SkeletonPlaceholder.Item
              width="60%"
              height={fontScale(14)}
              borderRadius={radiusScale(4)}
            />
          </View>
          <SkeletonPlaceholder.Item
            width="20%"
            height={fontScale(11)}
            borderRadius={radiusScale(4)}
          />
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);
  const role = useSelector((state: RootState) => state.auth.role);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const queryArgs = {
    take: 10,
    skip: (currentPage - 1) * 10,
    role: role,
    id: userId
  };

  const { data, isLoading, refetch } = useFetchNotificationQuery(queryArgs);

  const [isRendering, setRendring] = useState(false);
  const [cancelledEvents, setCancelledEvents] = useState([]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isLoading) {
      setRendring(true); // immediately show skeleton loader
    } else {
      // Delay turning off the rendering state to avoid flicker
      timeoutId = setTimeout(() => {
        setRendring(false);
      }, 500); // you can tweak this delay
    }

    return () => {
      clearTimeout(timeoutId); // clean up if component unmounts or re-runs
    };
  }, [isLoading]);

  useEffect(() => {
    if (
      data &&
      data?.data &&
      data?.data?.result &&
      data?.data?.result?.length > 0
    ) {
      setNotifications(prev =>
        currentPage === 1
          ? data?.data?.result
          : [...prev, ...data?.data?.result],
      );
      setCancelledEvents(data?.data?.result
        ?.filter((event: any) => event.type === 'eventCancelled')
        ?.map((event: any) => event?.body?.eventId));
      setIsDataLoading(false);
    } else {
      setIsDataLoading(false);
    }
  }, [data]);

  console.log('cancelled Notifications:', cancelledEvents);

  const handleRefresh = () => {
    setCurrentPage(1);
    refetch();
  };

  const detailQueryArgs = selectedNotification
    ? { notificationId: String(selectedNotification.id), id: userId }
    : undefined;
  const { data: notiDetail } = useFetchNotificationDetailQuery(
    detailQueryArgs as { notificationId: string },
    { skip: !selectedNotification },
  );
  const [deleteNotification] = useDeleteNotificationMutation();

  const markAsRead = (noti: Notification) => {
    console.log('Mark as read:', noti);
    if (selectedNotification?.id === noti?.id) {
      console.log('Mark as read: if',);

      checkEventStatus(noti);
    } else {
      console.log('Mark as read: else',);

      checkEventStatus(noti);
      setSelectedNotification(noti);
    }
  };
  const checkEventStatus = (noti: Notification) => {
    const eventID = noti?.body?.eventId;
    if (cancelledEvents.includes(eventID)) {
      FlashMessageComponent.show('info', 'This event has been cancelled and it is no longer accessible.');
      return;
    }
    else {
      navigateToScreen(noti, 'in-app');
    }
  };
  const loadMore = () => {
    if (notifications?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
      refetch();
    }, []),
  );
  const handleBackPress = () => navigation.goBack();

  const handleDelete = async (id: string) => {
    console.log('Delete item:', id);
    try {
      const response = await deleteNotification({
        notificationId: id || '',
        id: userId,
      }).unwrap();
      if (response.success == true) {
        FlashMessageComponent.show('success', response?.data?.message);
        refetch();
      } else {
        const typedError = response as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    }
  };

  const renderItem = (item: Notification) => {
    return (
      <TouchableOpacity
        style={[styles.notification, !item.isSeen && styles.unread]}
        onPress={() => markAsRead(item)}>
        <AvatarInitials
          name={item?.title}
          imgUrl={item?.image}
          size={48}
          textColor="white"
        />
        <Text numberOfLines={2} style={styles.textContainer}>
          <Text style={[styles.title, styles.bold]}>{item?.message}</Text>
        </Text>
        <Text style={styles.time}>{timeAgo(item.createdDate)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        headerTitle={LABLE.NOTIFICATIONS}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      {isRendering && !notifications?.length && (
        <View style={styles.contentContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[1, 2, 3, 4, 5]} // Show 5 skeleton items
            keyExtractor={item => `skeleton-${item}`}
            renderItem={() => <NotificationItemSkeleton />}
          />
        </View>
      )}

      {Boolean(
        !(isRendering && !notifications?.length) && notifications?.length,
      ) && (
          <View style={styles.contentContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={notifications || []}
              keyExtractor={item => item?.id}
              renderItem={({ item }) => (
                <SwapToDeleteComponent
                  item={item}
                  renderItem={item => renderItem(item)}
                  onDelete={handleDelete}
                />
              )}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                notifications?.length > 0 ? (
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
                  />
                ) : undefined
              }
            />
          </View>
        )}

      {!isRendering && !notifications?.length && !isDataLoading && (
        <EmptyRecordComponent
          title={LABLE.NO_NOTIFICATIONS_YET}
          subTitle={LABLE.NOTIFICATIONS_SUB_TITLE}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    padding: verticalMarginScale(16),
  },
  notification: {
    height: verticalScale(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: verticalMarginScale(16),
    marginBottom: verticalMarginScale(4),
    borderRadius: radiusScale(16),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  unread: {
    backgroundColor: COLORS.lighter_gray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: radiusScale(25),
    marginRight: verticalMarginScale(15),
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: horizontalMarginScale(12),
    flexWrap: 'wrap',
  },
  title: {
    fontSize: fontScale(14),
    color: COLORS.black,
  },
  bold: {
    fontWeight: '600',
  },
  time: {
    fontSize: fontScale(11),
    color: COLORS.light_gray,
  },
});

const skeletonStyles = StyleSheet.create({
  container: {
    height: verticalScale(80),
    marginBottom: verticalMarginScale(4),
    borderRadius: radiusScale(16),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: verticalMarginScale(16),
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: horizontalMarginScale(12),
  },
});

export default NotificationsScreen;
