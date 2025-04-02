import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

interface NotificationsScreenProps extends NativeStackScreenProps<any, any> { }

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const queryArgs = {
    take: 10,
    skip: (currentPage - 1) * 10,
  };

  const { data, isLoading, refetch } = useFetchNotificationQuery(queryArgs);

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
    }
    else {
      setNotifications([]);
    }
  }, [data]);

  const handleRefresh = () => {
    setCurrentPage(1);
    refetch();
  };

  const detailQueryArgs = selectedNotification
    ? { notificationId: String(selectedNotification.id) }
    : undefined;
  const { data: notiDetail } = useFetchNotificationDetailQuery(
    detailQueryArgs as { notificationId: string },
    { skip: !selectedNotification },
  );
  const [
    deleteNotification,
    {
      isLoading: deleteLoading,
      isError: deleteError,
      isSuccess: deleteSuccess,
    },
  ] = useDeleteNotificationMutation();

  const markAsRead = (noti: any) => {
    console.log('Mark as read:', noti);
    if (selectedNotification?.id === noti?.id) {
      navigateToScreen(noti, 'in-app');
    }
    else {
      navigateToScreen(noti, 'in-app');
      setSelectedNotification(noti);
    }
  };
  const loadMore = () => {
    if (notifications?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
      refetch();

    }, []),
  );
  const handleBackPress = () => navigation.goBack();

  const handleDelete = async (id: string) => {
    console.log('Delete item:', id);
    try {
      const response = await deleteNotification({
        notificationId: id || '',
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

  const renderItem = (item: any) => {
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
      {notifications?.length ? (
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
                <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
              ) : undefined
            }
          />
        </View>
      ) : (
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

export default NotificationsScreen;
