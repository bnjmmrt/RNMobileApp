import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { COLORS, LABLE } from 'src/utils/constants';
import Header from 'src/component/Header/Header';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import AvatarInitials from 'src/component/AvatarInitials';

const initialNotifications = [
    { id: '1', title: 'Revolve just published a new event', event: 'Coachella 2025', time: '10m', avatar: 'https://via.placeholder.com/50', read: false },
    { id: '2', title: 'Coachella 2025 was just published in Los Angeles', time: '33m', avatar: 'https://via.placeholder.com/50', read: false },
    { id: '3', title: 'Revolve approved your request to attend', event: 'Coachella 2025', time: '1h', avatar: 'https://via.placeholder.com/50', read: false },
    { id: '4', title: 'Revolve declined your request to attend', event: 'Coachella 2025', time: '2h', avatar: 'https://via.placeholder.com/50', read: false },
    { id: '5', title: 'Revolve invited you to attend', event: 'Coachella 2025', time: '6h', avatar: 'https://via.placeholder.com/50', read: true },
    { id: '6', title: 'Revolve posted a new announcement', event: 'Coachella 2025', time: '23h', avatar: 'https://via.placeholder.com/50', read: true },
    { id: '7', title: 'Revolve canceled Coachella 2025', time: '12/24/25', avatar: 'https://via.placeholder.com/50', read: true },
    { id: '8', title: 'Bessie Cooper has requested your referral to become a Rumor mem...', time: '12/23/25', avatar: 'https://via.placeholder.com/50', read: false },
    { id: '9', title: 'Michael Fox has requested for you to vouch for them.', time: '12/22/25', avatar: 'https://via.placeholder.com/50', read: true }
  ];
interface NotificationsScreenProps extends NativeStackScreenProps<any, any> {}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {

    const [notifications, setNotifications] = useState(initialNotifications);
    const [page, setPage] = useState(1);
    const pageSize = 5; // Number of items per page
  
    // Mark notification as read
    const markAsRead = (id) => {
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
    };
  
    // Pagination logic
    const loadMore = () => {
      setPage((prev) => prev + 1);
    };
  
    // Paginate notifications
    const displayedNotifications = notifications.slice(0, page * pageSize);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );
  const handleBackPress = () => navigation.goBack();
  return (
    <View style={styles.container}>
      <Header headerTitle={LABLE.NOTIFICATIONS} onPress={handleBackPress} showProgressBar={false} />
      <View style={styles.contentContainer}>
      <FlatList
        data={displayedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.notification, !item.read && styles.unread]} 
            onPress={() => markAsRead(item.id)}
          >
            <AvatarInitials  size={48}/>
            {/* <Image source={{ uri: item.avatar }} style={styles.avatar} /> */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                <Text style={styles.bold}>{item.title}</Text>
                {item.event && ` ${item.event}`}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    padding: verticalMarginScale(16),
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between',
    backgroundColor: COLORS.white,
    padding: verticalMarginScale(16),
    marginBottom: verticalMarginScale(4),
    borderRadius: 10,
    borderWidth:1,
    borderColor:COLORS.borderGray
  },
  unread: {
    backgroundColor: '#EDEDED' // Highlight unread notifications
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15
  },
  textContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    color: '#333'
  },
  bold: {
    fontWeight: 'bold'
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 5
  }
});

export default NotificationsScreen;
