import IMAGES from '@images/index';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { EndPoint } from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import AvatarInitials from 'src/component/AvatarInitials';
import ButtonSmall from 'src/component/ButtonSmall';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FollowButton from 'src/component/FollowButton/FollowButton';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import { ROUTES } from 'src/navigation/Route';
import { RootState } from 'src/redux/slices';
import { setRefresh } from 'src/redux/slices/rspvSlice';
import { COLORS, PROFILE } from 'src/utils/constants';
import { Hp } from 'src/utils/dimensions';
import { fontFamily, removeSignature } from 'src/utils/functions';

const FollowingScreen: React.FC = () => {
  const { apiRequest, loading } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const { setParams, navigate, goBack } = useNavigation<any>();
  const [pagination, setPagination] = useState({ take: 12, skip: 0 });
  const [hostList, setHostList] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const refresh = useSelector((state: RootState) => state.rspv.refresh);
  const routes = useRoute();
  const dispatch = useDispatch()

  const getFollowings = useCallback(async () => {
    dispatch(setRefresh(false));
    setIsRefreshing(true);
    try {
      const response = await apiRequest(
        'get',
        `${EndPoint.hosts_followed}${userId}?take=${pagination.take}&skip=${pagination.skip}`
      );

      if (response?.data?.hosts?.length || refresh) {
        const newHosts = response?.data.hosts.map(host => ({
          ...host,
          isFollowing: true,
        }));
        setHostList(prev => (pagination.skip === 0 ? newHosts : [...prev, ...newHosts]));
        setHasMore(newHosts.length >= pagination.take);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching followings:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [pagination, userId, refresh]);

  useEffect(() => {
    getFollowings();
  }, [pagination, refresh]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPagination({ take: 12, skip: 0 });
    setHostList([]);
    setHasMore(true);
  };

  const loadMoreHosts = () => {
    if (!loading && hasMore) {
      setPagination(prev => ({ ...prev, skip: prev.skip + prev.take }));
    }
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };


  const filteredHosts = hostList.filter(host =>
    host.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading && hostList.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isRefreshing) {
    return null
  }
  console.log(filteredHosts[0])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header
        headerTitle={PROFILE.FOLLOWING}
        showProgressBar={false}
        onPress={goBack}
      />
      <FlatList
        data={filteredHosts}
        ListEmptyComponent={
          !loading ? searchQuery == "" ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Hp(60),
                flexDirection: 'row',
              }}>
              <EventEmptyRecord
                title="No Following"
                subTitle="You are not following any hosts."
              />
            </View>
          ) : <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Hp(60),
              flexDirection: 'row',
            }}>
            <EventEmptyRecord
              title="No Results"
              subTitle="Please refine your search."
            />
          </View> : null
        }
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <SearchInput
              onSearchTextChange={handleSearch}
              placeholder="Search Hosts.."
              value={searchQuery}
              mainContainerStyle={{ marginHorizontal: 0 }}
            />
          </View>
        }
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <AvatarInitials
              onPress={() =>
                navigate(ROUTES.HostProfileScreen, { hostId: item.id })
              }
              imgUrl={removeSignature(item?.companyLogo)}
              size={48}
            />
            <Text style={styles.itemName}>{item?.companyName}</Text>
            <FollowButton
              isFollowing={item?.isFollowing}
              id={item?.id}
            />
          </View>
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        // onEndReached={hasMore ? loadMoreHosts : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && hasMore && <ActivityIndicator size="small" />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    height: 48,
    marginBottom: 12,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginHorizontal: 20,
  },
  itemContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black,
  },
  smallBtnStyle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FollowingScreen;
