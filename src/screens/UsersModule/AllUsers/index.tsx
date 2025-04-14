import IMAGES from '@images/index';
import { useScrollToTop } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FiltersSheet, { SelectedFilters } from 'src/component/FilterSheet';
import { InputRefMethods } from 'src/component/Input/Input';
import SearchInput from 'src/component/SearchInput';
import { useFetchAllUsersQuery } from 'src/redux/actions/usersApiAction';
import { changeBottomTabsVisibility } from 'src/redux/slices/bottomTabsConfigSlice';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import UserActionsSheet, {
  UserActionCurrentPageType,
} from '../BottomSheets/UserActionsSheet';
import UserListItem, { UserItemInterface } from '../UsersListItem';
import { COLORS } from 'src/utils/constants';
import { BOTTOM_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { RootState } from 'src/redux/slices';
import { setUsersTabAllUsersRefresh, setUsersTabAllUsersSkip } from 'src/redux/slices/listSkipSlice';

interface AllUserProps { }

const AllUsers: React.FC<AllUserProps> = ({ }) => {
  const dispatch = useDispatch();
  const searchInputRef = useRef<InputRefMethods>(null);
  const actionSheetRef = useRef<BottomSheetMethods>(null);
  const filtersSheetRef = useRef<BottomSheetMethods>(null);
  const scrollToTopRef = useRef(null);
  useScrollToTop(scrollToTopRef);

  const listTakeCount = 20;

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<UserActionCurrentPageType>('');

  const { usersTabAllUsersSkipCount, usersTabAllUsersRefresh } = useSelector((state: RootState) => {
    return {
      usersTabAllUsersSkipCount: state?.listSkip?.usersTabAllUsersSkipCount,
      usersTabAllUsersRefresh: state?.listSkip?.usersTabAllUsersRefresh,

    };
  }, shallowEqual);

  const { data, isLoading, error, isError, refetch, isFetching } =
    useFetchAllUsersQuery({
      take: listTakeCount,
      skip: usersTabAllUsersSkipCount,
      searchValue: searchText,
      queryString: filterQuery,
    });

  const onRefreshPage = () => {
    dispatch(setUsersTabAllUsersRefresh());
  };

  useEffect(() => {
    dispatch(setUsersTabAllUsersSkip(0));
    refetch()
  }, [searchText, filterQuery, filterNumber, usersTabAllUsersRefresh])

  const loadMore = () => {
    if (
      !isLoading && !isFetching && data?.data?.totalCount > 0 &&
      usersTabAllUsersSkipCount + listTakeCount < data?.data?.totalCount
    ) {
      dispatch(
        setUsersTabAllUsersSkip(usersTabAllUsersSkipCount + listTakeCount),
      );
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
    setSearchText(text);
  };

  const onAddUserToListSuccess = () => {
    setSelectedUsers([]);
  };

  const onApplyFilter = (
    queryString: string,
    numberOfFiltersApplied: number,
    selectedFilters?: SelectedFilters,
  ) => {
    setFilterQuery(queryString);
    setFilterNumber(numberOfFiltersApplied);
    if (selectedFilters) {
      setSelectedFilters(selectedFilters);
    }
  };

  const onClearFilter = () => {
    setFilterQuery('');
    setFilterNumber(0);
    setSelectedFilters({});
  };

  const [isRendering, setRendring] = useState(false);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isFetching) {
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
  }, [isFetching]);

  const getEmptyStateMessage = () => {
    if (filterNumber > 0 && searchText) {
      return 'Please refine your search.';
    } else if (filterNumber > 0) {
      return 'Remove filters to expand your search';
    } else if (searchText) {
      return 'Please refine your search.';
    } else {
      return 'This users is not in our system or already has a status on the guest list. Tap "+" to add a new guest';
    }
  };
  const getEmptyStateTitle = () => {
    if (filterNumber > 0 && searchText) {
      return 'No results';
    } else if (filterNumber > 0) {
      return 'No users';
    } else if (searchText) {
      return 'No results';
    } else {
      return 'No users found!';
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

  const renderUserSkeletonItem = () => {
    return (
      <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingVertical={verticalMarginScale(8)}>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={40}
              height={40}
              borderRadius={20}
            />
            <SkeletonPlaceholder.Item
              marginLeft={horizontalMarginScale(12)}
              width={Wp(50)}
              height={18}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    );
  };

  const renderUserSkeletonList = () => {
    return (
      <View
        style={{
          marginTop: verticalMarginScale(16),
          marginHorizontal: horizontalMarginScale(20),
          flex: 1,
        }}>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <View key={index} style={{ marginBottom: verticalMarginScale(16) }}>
              {renderUserSkeletonItem()}
            </View>
          ))}
      </View>
    );
  };

  useEffect(() => {
    if (selectedUsers.length > 0) {
      dispatch(changeBottomTabsVisibility({ showBottomTabs: false }));
    } else {
      dispatch(changeBottomTabsVisibility({ showBottomTabs: true }));
    }
  }, [selectedUsers]);

  useEffect(() => {
    return () => {
      dispatch(setUsersTabAllUsersRefresh());
    };
  }, []);

  // useEffect(() => {
  //   if (data && data.data) {
  //     // setRendring(false);
  //     if (currentPage === 1) {
  //       setAllUsers(data.data);
  //     } else {
  //       setAllUsers(prev => ({
  //         totalCount: data.data.totalCount,
  //         result: [...prev.result, ...data.data.result],
  //       }));
  //     }
  //   }
  //   // else{
  //   //   setRendring(false);
  //   // }
  // }, [data]);

  // useEffect(() => {
  //   if (isError) {
  //     setAllUsers({ totalCount: 0, result: [] });
  //   }
  // }, [isError]);

  useEffect(() => {
    return () => {
      setSelectedUsers([]);
      dispatch(changeBottomTabsVisibility({ showBottomTabs: true }));
    };
  }, []);

  const isInitialLoading = isRendering && usersTabAllUsersSkipCount === 0;

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

      {isInitialLoading ? (
        renderUserSkeletonList()
      ) : (
        <FlatList
          ref={scrollToTopRef}
          data={data?.data?.result || []}
          style={{
            marginHorizontal: horizontalMarginScale(20),
            marginTop: verticalMarginScale(16),
          }}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: verticalMarginScale(16) }}
          ListFooterComponent={
            (isLoading || isFetching) && usersTabAllUsersSkipCount > 0 ? (
              <ActivityIndicator
                color={COLORS.black}
                style={{
                  marginTop: verticalScale(10),
                  marginBottom: verticalMarginScale(150),
                }}
              />
            ) : (
              <View style={{ marginBottom: verticalMarginScale(150) }} />
            )
          }
          ListEmptyComponent={
            <View
              style={{
                height: Hp(55),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <EventEmptyRecord
                title={getEmptyStateTitle()}
                subTitle={getEmptyStateMessage()}
                isLoading={isRendering}
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
                        marginTop: verticalMarginScale(30),
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
            data?.data?.result?.length > 0 ? (
              <RefreshControl
                refreshing={isLoading}
                onRefresh={onRefreshPage}
              />
            ) : undefined
          }
        />
      )}

      {selectedUsers.length > 0 ? (
        <Button
          title="Add to List"
          onPress={() => {
            setSelectedActionSheetAction('addToList');
            actionSheetRef?.current?.open();
          }}
          colorTheme="dark"
          style={{ position: 'absolute', bottom: BOTTOM_SAFEAREA_SPACING }}
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
        selectedFiltersInParent={selectedFilters}
      />
    </View>
  );
};

export default AllUsers;
