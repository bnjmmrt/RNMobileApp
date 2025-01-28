import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import ButtonSmall from 'src/component/ButtonSmall';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import { ROUTES } from 'src/navigation/Route';
import {
  useFetchHostListQuery,
  useFollowHostMutation,
  useUnfollowHostMutation,
} from 'src/redux/actions/referralApiAction';
import { COLORS, PROFILE } from 'src/utils/constants';
import { Hp } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

const FollowingScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {navigate,goBack}=useNavigation();
  const [pagination, setPagination] = useState({ take: 12, skip: 0 });
  const [hostList, setHostList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [followHost] = useFollowHostMutation();
  const [unfollowHost] = useUnfollowHostMutation();

  const { data={
    data:{
      hosts:[{firstName:'This is a really long name for a Host',companyName:'Revolve',companyLogo:'https://i.imgur.com/Lrupihs.png'}]
    }
  }, error, isLoading, isFetching, refetch } = useFetchHostListQuery({
    id: '12345', // Replace with dynamic user ID
    take: pagination.take,
    skip: pagination.skip,
  });

  useEffect(() => {
    if (data?.data?.hosts) {
      const newHosts = data.data.hosts.map((host) => ({
        ...host,
        isFollowing: true,
      }));
      if (newHosts.length < pagination.take) {
        setHasMore(false); // No more data to load
      }
      setHostList((prev) => [...prev, ...newHosts]);
    } else {
      setHasMore(false); // No data
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPagination({ take: 12, skip: 0 });
    setHostList([]);
    setHasMore(true);
    refetch().finally(() => setIsRefreshing(false));
  };

  const loadMoreHosts = () => {
    if (!isFetching && hasMore) {
      setPagination((prev) => ({
        ...prev,
        skip: prev.skip + prev.take,
      }));
    }
  };

  const handleFollow = async (hostId: string, isFollowing: boolean) => {
    try {
      if (isFollowing) {
        // await unfollowHost({ hostId, userId: '12345' }).unwrap();
        setHostList((prev) =>
          prev.map((host) =>
            host.id === hostId ? { ...host, isFollowing: false } : host
          )
        );
      } else {
        // await followHost({ hostId, userId: '12345' }).unwrap();
        setHostList((prev) =>
          prev.map((host) =>
            host.id === hostId ? { ...host, isFollowing: true } : host
          )
        );
      }
    } catch (error) {
      console.error('Error handling follow/unfollow:', error);
    }
  };

  const filteredHosts = hostList.filter((host) =>
    host.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && hostList.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:COLORS.white }}>
    <Header headerTitle={PROFILE.FOLLOWING} showProgressBar={false} onPress={goBack} />
            <SearchInput
            onSearchTextChange={handleSearch}
            placeholder="Search Hosts.."
              value={searchQuery}
            />
      <FlatList
        data={filteredHosts}
        ListEmptyComponent={
          !isLoading && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: Hp(60),
                flexDirection: 'row',
              }}
            >
              <EventEmptyRecord
                title="No Following"
                subTitle="You are not following any hosts."
              />
            </View>
          )
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <AvatarInitials onPress={()=>navigate(ROUTES.HostProfileScreen,{hostId:'dsk'})} imgUrl={item.companyLogo} size={48} />
            <Text style={styles.itemName}>{item.companyName}</Text>
            <ButtonSmall
              style={styles.smallBtnStyle}
              title={item.isFollowing ? 'Following' : 'Follow'}
              colorTheme={item.isFollowing ? 'dark' : 'dark'}
              leftIcon={item.isFollowing?IMAGES.check:null}
              borderType={item.isFollowing?"STRIPE":"SOLID"}
              onPress={() => handleFollow(item.id, item.isFollowing)}
            />
          </View>
        )}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{paddingHorizontal:20,marginTop:12}}
        // onEndReached={hasMore ? loadMoreHosts : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && hasMore && <ActivityIndicator size="small" />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    height:48,
    marginBottom:12,
    borderColor: COLORS.borderGray,
    borderRadius: 8,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginHorizontal:20
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
