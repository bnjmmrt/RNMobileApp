import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import SearchInput from 'src/component/SearchInput';
import { AppStackParamList } from 'src/navigation/AppStack';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
} from 'src/utils/dimensions';
import UserListItem from '../UsersListItem';
import createStyle from './style';
import { useFetchAllUsersQuery } from 'src/redux/actions/usersApiAction';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

interface AllUserProps { }

const AllUsers: React.FC<AllUserProps> = ({ }) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const searchInputRef = useRef<any>(null);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useFetchAllUsersQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
    searchValue: searchText,
  });

  useEffect(() => {
    if (data) {
      setAllUsers(prev =>
        currentPage === 1 ? data.data : [...prev, ...data.data],
      );
    }
  }, [data]);

  const loadMore = () => {
    if (data?.totalCount < data?.users?.length && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const onSelectUser = (user: number) => {
    if (selectedUsers.includes(user)) {
      const newArray = selectedUsers.filter(u => u !== user);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user];
      setSelectedUsers(newArray);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const renderItem = useCallback(
    ({ item }: { item: number }) => {
      const isSelected = selectedUsers.includes(item);
      return (
        <UserListItem
          item={item}
          onSelectUser={onSelectUser}
          isSelected={isSelected}
        />
      );
    },
    [selectedUsers],
  );

  return (
    <View
      style={{
        marginTop: verticalMarginScale(8),
      }}>
      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchTextChange}
        placeholder="Search..."
        rightIcon={IMAGES.filter_lines}
        onPressRightIcon={() => { }}
        rightIconText=""
      />

      <FlatList
        data={allUsers?.users || []}
        style={{ marginHorizontal: horizontalMarginScale(20), marginTop: verticalMarginScale(10) }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalMarginScale(16) }}
        ListHeaderComponent={<View />}
        ListFooterComponent={<View />}
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="No Users"
              subTitle="Please refine your search"
              isLoading
            />
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default AllUsers;
