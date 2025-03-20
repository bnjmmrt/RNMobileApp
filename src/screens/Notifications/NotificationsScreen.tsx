import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { COLORS, LABLE } from 'src/utils/constants';
import Header from 'src/component/Header/Header';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import AvatarInitials from 'src/component/AvatarInitials';
import SwapToDeleteComponent from 'src/component/SwappableItem/SwapToDeleteComponent';
import EmptyRecordComponent from 'src/component/EmptyRecord/EmptyRecordComponent';
import { useFetchNotificationDetailQuery, useFetchNotificationQuery } from 'src/redux/actions/usersApiAction';
import { navigateToScreen } from 'src/component/PushNotification';

const initialNotifications = [
  {
    id: '1',
    name: 'Revolve',
    message: 'just published a new event',
    address: 'Coachella 2025',
    time: '10m',
    avatar: 'https://via.placeholder.com/50',
    read: false,
  },
  {
    id: '2',
    name: 'Coachella 2025',
    message: 'was just published in Los Angeles',
    address: 'Los Angeles',
    time: '33m',
    avatar: 'https://via.placeholder.com/50',
    read: false,
  },
  {
    id: '3',
    name: 'Revolve',
    message: 'approved your request to attend',
    address: 'Coachella 2025',
    time: '1h',
    avatar: 'https://via.placeholder.com/50',
    read: false,
  },
  {
    id: '4',
    name: 'Revolve',
    message: 'declined your request to attend',
    address: 'Coachella 2025',
    time: '2h',
    avatar: 'https://via.placeholder.com/50',
    read: false,
  },
  {
    id: '5',
    name: 'Revolve',
    message: 'invited you to attend',
    address: 'Coachella 2025',
    time: '6h',
    avatar: 'https://via.placeholder.com/50',
    read: true,
  },
  {
    id: '6',
    name: 'Revolve',
    message: 'posted a new announcement',
    address: 'Coachella 2025',
    time: '23h',
    avatar: 'https://via.placeholder.com/50',
    read: true,
  },
  {
    id: '7',
    name: 'Revolve',
    message: 'canceled',
    address: 'Coachella 2025',
    time: '12/24/25',
    avatar: 'https://via.placeholder.com/50',
    read: true,
  },
  {
    id: '8',
    name: 'Bessie Cooper',
    message: 'has requested your referral to become a Rumor member',
    address: '',
    time: '12/23/25',
    avatar: 'https://via.placeholder.com/50',
    read: false,
  },
  {
    id: '9',
    name: 'Michael Fox',
    message: 'has requested for you to vouch for them.',
    address: '',
    time: '12/22/25',
    avatar: 'https://via.placeholder.com/50',
    read: true,
  },
];

interface NotificationsScreenProps extends NativeStackScreenProps<any, any> { }

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const queryArgs = ({
    take: 10,
    skip: (currentPage - 1) * 10
  })
  const { data, isLoading, refetch } = useFetchNotificationQuery(queryArgs);
  console.log("siya notifi", data)
  useEffect(() => {
    if (data?.notifications.length > 0) {
      setNotifications((prev) => (currentPage === 1 ? data?.notifications : [...prev, ...data?.notifications]));
    }
  }, [data]);

  useEffect(() => {
    setRefreshing(isLoading)
  }, [isLoading])

  const handleRefresh = () => {
    setCurrentPage(1)
  };

  const markAsRead = (id: string) => {
    const queryArgs = ({
      notificationId: id
    })
    const { data: notiDetail, isLoading, refetch } = useFetchNotificationDetailQuery(queryArgs);
    navigateToScreen(notiDetail)
  };

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
    // setNotifications([...notifications, ...notifications]);
  };


  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );
  const handleBackPress = () => navigation.goBack();
  const handleDelete = (id: string) => {
    console.log('Delete item:', id);
    // setNotifications(notifications.filter(notification => notification.id !== id))
  };

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        style={[styles.notification, !item.read && styles.unread]}
        onPress={() => markAsRead(item?.id)}>
        <AvatarInitials size={48} />
        {/* <Text numberOfLines={2} style={styles.textContainer}>
          <Text style={[styles.title, styles.bold]}>{item.name}</Text>
          <Text style={styles.title}>{` ${item.message} `}</Text>
          <Text style={[styles.title, styles.bold]}>{item.address}</Text>
        </Text>
        <Text style={styles.time}>{item.time}</Text> */}
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
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <SwapToDeleteComponent
                item={item}
                renderItem={item => renderItem(item)}
                onDelete={handleDelete}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
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
    fontWeight: '700',
  },
  time: {
    fontSize: fontScale(11),
    color: COLORS.light_gray,
  },
});

export default NotificationsScreen;
