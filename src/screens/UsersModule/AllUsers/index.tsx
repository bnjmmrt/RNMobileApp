import IMAGES from '@images/index';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FiltersSheet from 'src/component/FilterSheet';
import { InputRefMethods } from 'src/component/Input/Input';
import SearchInput from 'src/component/SearchInput';
import { useFetchAllUsersQuery } from 'src/redux/actions/usersApiAction';
import { changeBottomTabsVisibility } from 'src/redux/slices/bottomTabsConfigSlice';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import UserActionsSheet, {
  UserActionCurrentPageType,
} from '../BottomSheets/UserActionsSheet';
import UserListItem, { UserItemInterface } from '../UsersListItem';

interface AllUserProps {}

const AllUsers: React.FC<AllUserProps> = ({}) => {
  const dispatch = useDispatch();
  const searchInputRef = useRef<InputRefMethods>(null);
  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const filtersSheetRef = useRef<BottomSheetMethods>(null);

  const [allUsers, setAllUsers] = useState<{
    users: UserItemInterface[];
    totalCount: number;
  }>({ totalCount: 0, users: [] });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<UserActionCurrentPageType>('');

  const { data, isLoading, error, isError, refetch } = useFetchAllUsersQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
    searchValue: searchText,
    queryString: filterQuery,
  });

  const onRefreshPage = () => {
    setCurrentPage(1);
    refetch();
  };

  const loadMore = () => {
    if (allUsers?.users?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const onSelectUser = (user: UserItemInterface) => {
    const isSelected = selectedUsers.some(
      selectedUser => selectedUser === user.id,
    );
    if (isSelected) {
      const newArray = selectedUsers.filter(u => u !== user.id);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user.id];
      setSelectedUsers(newArray);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setCurrentPage(1);
    setSearchText(text);
  };

  const onAddUserToListSuccess = () => {
    setSelectedUsers([]);
  };

  const onApplyFilter = (
    queryString: string,
    numberOfFiltersApplied: number,
  ) => {
    setCurrentPage(1);
    setFilterQuery(queryString);
    setFilterNumber(numberOfFiltersApplied);
  };

  const onClearFilter = () => {
    setCurrentPage(1);
    setFilterQuery('');
    setFilterNumber(0);
  };

  const getEmptyStateMessage = () => {
    if (filterNumber > 0 && searchText) {
      return 'Please refine your search.';
    } else if (filterNumber > 0) {
      return 'Remove filters to expand your search';
    } else if (searchText) {
      return 'Please refine your search.';
    } else {
      return 'This users is not in our system or already has a status on the guest list. Tap “+” to add a new guest';
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: UserItemInterface }) => {
      const isSelected = selectedUsers.some(user => user === item.id);
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

  useEffect(() => {
    if (selectedUsers.length > 0) {
      dispatch(changeBottomTabsVisibility({ showBottomTabs: false }));
    } else {
      dispatch(changeBottomTabsVisibility({ showBottomTabs: true }));
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (data && data.data) {
      if (currentPage === 1) {
        setAllUsers(data.data);
      } else {
        setAllUsers(prev => ({
          totalCount: data.data.totalCount,
          users: [...prev.users, ...data.data.users],
        }));
      }
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      setAllUsers({ totalCount: 0, users: [] });
    }
  }, [isError]);

  return (
    <View style={{ marginTop: verticalMarginScale(8), flex: 1 }}>
      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchTextChange}
        placeholder="Search..."
        rightIcon={IMAGES.filter_lines}
        onPressRightIcon={() => {
          filtersSheetRef?.current?.open();
        }}
        rightIconText={String(filterNumber || '') || ''}
        mainContainerStyle={{ marginHorizontal: horizontalMarginScale(20) }}
        defaultValue={searchText}
      />
      <FlatList
        data={allUsers?.users || []}
        style={{
          marginHorizontal: horizontalMarginScale(20),
          marginTop: verticalMarginScale(16),
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalMarginScale(16) }}
        ListFooterComponent={
          <View style={{ marginBottom: verticalMarginScale(150) }} />
        }
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="User not found"
              subTitle={getEmptyStateMessage()}
              isLoading={isLoading}
              footerContent={
                !isLoading && filterNumber > 0 ? (
                  <Button
                    title={'Reset Filters'}
                    imageSource={IMAGES.refresh}
                    leftImageStyle={{
                      height: verticalScale(16),
                      width: verticalScale(16),
                    }}
                    onPress={onClearFilter}
                    colorTheme="dark"
                    textStyle={{ marginHorizontal: 0 }}
                    style={{
                      alignSelf: 'center',
                      width: undefined,
                      height: undefined,
                      paddingHorizontal: horizontalMarginScale(12),
                      paddingVertical: verticalMarginScale(12),
                      gap: horizontalMarginScale(6),
                    }}
                  />
                ) : null
              }
            />
          </View>
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        refreshControl={
          allUsers?.users?.length > 0 ? (
            <RefreshControl refreshing={isLoading} onRefresh={onRefreshPage} />
          ) : undefined
        }
      />
      {selectedUsers.length > 0 ? (
        <Button
          title="Add to List"
          onPress={() => {
            setSelectedActionSheetAction('addToList');
            actionSheetRef?.current?.open();
          }}
          colorTheme="dark"
          style={{ position: 'absolute', bottom: verticalScale(30) }}
        />
      ) : null}
      <UserActionsSheet
        ref={actionSheetRef}
        from="usersList"
        selectedUsers={selectedUsers}
        onSuccess={onAddUserToListSuccess}
        selectedAction={selectedActionSheetAction}
        setSelectedAction={setSelectedActionSheetAction}
      />
      <FiltersSheet
        ref={filtersSheetRef}
        from="allUsersList"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
      />
    </View>
  );
};

export default AllUsers;
