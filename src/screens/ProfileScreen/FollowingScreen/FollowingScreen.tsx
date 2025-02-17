import IMAGES from '@images/index';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {EndPoint} from 'src/ApiManager/config';
import useApi from 'src/axios/useApi';
import AvatarInitials from 'src/component/AvatarInitials';
import ButtonSmall from 'src/component/ButtonSmall';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import {ROUTES} from 'src/navigation/Route';
import {RootState} from 'src/redux/slices';
import {COLORS, PROFILE} from 'src/utils/constants';
import {Hp} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

const FollowingScreen: React.FC = () => {
  const {apiRequest, loading} = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const {navigate, goBack} = useNavigation();
  const [pagination, setPagination] = useState({take: 12, skip: 0});
  const [hostList, setHostList] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const getFollowings = async () => {
    const response: any = await apiRequest(
      'get',
      `${EndPoint.hosts_followed}${userId}?take=${pagination.take}&skip=${pagination.skip}`,
    );
    if (response.status === 200) {
      const hostsData = response?.data.hosts;
      if (hostsData?.length) {
        const newHosts = hostsData.map((host: any) => ({
          ...host,
          isFollowing: true,
        }));
        if (newHosts.length < pagination.take) {
          setHasMore(false); // No more data to load
        }
        setHostList(prev => [...prev, ...newHosts]);
      } else {
        setHasMore(false);
      }
    }
  };

  const followUnfollow = async (hostId: string) => {
    const response: any = await apiRequest(
      'post',
      `v1/auth/host/${hostId}/follow`, { userId: userId },
    );
    return response?.status;
  };
  
  useEffect(() => {
    getFollowings();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPagination({take: 12, skip: 0});
    setHostList([]);
    setHasMore(true);
    getFollowings().finally(() => setIsRefreshing(false));
  };

  const loadMoreHosts = () => {
    if (!loading && hasMore) {
      setPagination(prev => ({
        ...prev,
        skip: prev.skip + prev.take,
      }));
    }
  };

  const handleFollow = async (hostId: string, isFollowing: boolean) => {
        const status = await followUnfollow(hostId);
        if (status === 200) {
          setHostList(prev =>
            prev.map(host =>
              host.id === hostId ? {...host, isFollowing: !isFollowing} : host,
            ),
          );
        }
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <Header
        headerTitle={PROFILE.FOLLOWING}
        showProgressBar={false}
        onPress={goBack}
      />
      <FlatList
        data={filteredHosts}
        ListEmptyComponent={
          !loading && (
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
          )
        }
        ListHeaderComponent={
          <View style={{marginBottom: 16}}>
            <SearchInput
              onSearchTextChange={handleSearch}
              placeholder="Search Hosts.."
              value={searchQuery}
              mainContainerStyle={{ marginHorizontal: 0}}
            />
          </View>
        }
        keyExtractor={(item: any) => item.id}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <AvatarInitials
              onPress={() =>
                navigate(ROUTES.HostProfileScreen, {hostId: 'dsk'})
              }
              imgUrl={item?.companyLogo}
              size={48}
            />
            <Text style={styles.itemName}>{item?.companyName}</Text>
            <ButtonSmall
              style={styles.smallBtnStyle}
              title={item?.isFollowing ? 'Following' : 'Follow'}
              colorTheme={item?.isFollowing ? 'dark' : 'dark'}
              leftIcon={item?.isFollowing ? IMAGES.check : null}
              borderType={item?.isFollowing ? 'STRIPE' : 'SOLID'}
              onPress={() => handleFollow(item?.id, item?.isFollowing)}
            />
          </View>
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{paddingHorizontal: 20}}
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
