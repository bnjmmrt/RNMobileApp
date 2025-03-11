import IMAGES from '@images/index';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FiltersSheet, { SelectedFilters } from 'src/component/FilterSheet';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import { AppStackParamList } from 'src/navigation/AppStack';
import { useFetchCustomListUsersQuery } from 'src/redux/actions/listsApiAction';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import DeleteListUsersSheet from '../BottomSheets/DeleteListUsersSheet';
import ListActionsSheet, {
  listActionCurrentPageType,
} from '../BottomSheets/ListActionsSheet';
import UserListItem, { UserItemInterface } from '../UsersListItem';
import createStyle from './style';

interface ListDetailsProps
  extends NativeStackScreenProps<AppStackParamList, 'ListDetail'> {}

const ListDetails: React.FC<ListDetailsProps> = ({ route }) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const searchInputRef = useRef<any>(null);
  const deleteListUsersSheetRef = useRef<BottomSheetMethods>(null);
  const listActionSheetRef = useRef<BottomSheetMethods>(null);
  const filtersSheetRef = useRef<BottomSheetMethods>(null);

  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<listActionCurrentPageType>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [allUsers, setAllUsers] = useState<{
    result: UserItemInterface[];
    totalCount: number;
    name: string;
    id: string;
  }>({ totalCount: 0, result: [], id: '', name: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const { data, isLoading, refetch } = useFetchCustomListUsersQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
    listId: route.params.list,
    searchValue: searchText,
    listType: route.params.listType || 'custom',
    queryString: filterQuery,
  });

  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        setAllUsers(data?.data);
      } else {
        setAllUsers(prev => ({
          ...prev,
          totalCount: data.data.totalCount,
          users: [...prev?.result, ...data?.data?.result],
        }));
      }
    }
  }, [data]);

  const loadMore = () => {
    if (allUsers?.result?.length < data?.data?.totalCount) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const onSelectUser = (user: UserItemInterface) => {
    const isSelected = selectedUsers.some(
      selectedUser => selectedUser === user.listMappingId,
    );
    if (isSelected) {
      const newArray = selectedUsers.filter(u => u !== user.listMappingId);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user.listMappingId];
      setSelectedUsers(newArray);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const onApplyFilter = (
    queryString: string,
    numberOfFiltersApplied: number,
    selectedFilters?: SelectedFilters,
  ) => {
    setCurrentPage(1);
    setFilterQuery(queryString);
    setFilterNumber(numberOfFiltersApplied);

    if (selectedFilters) {
      setSelectedFilters(selectedFilters);
    }
  };

  const onClearFilter = () => {
    setCurrentPage(1);
    setFilterQuery('');
    setFilterNumber(0);
    setSelectedFilters({});
  };

  const onListActionSheetSuccess = () => {
    if (selectedActionSheetAction === 'deleteList') {
      navigation.goBack();
    } else if (selectedActionSheetAction === 'duplicateList') {
      navigation.goBack();
    } else {
      setCurrentPage(1);
      refetch();
    }
    // setSelectedActionSheetAction('');
  };

  const getEmptyStateMessage = () => {
    if (filterNumber > 0 && searchText) {
      return 'Please refine your search.';
    } else if (filterNumber > 0) {
      return 'Remove filters to expand your search';
    } else if (searchText) {
      return 'Please refine your search.';
    } else {
      if (route.params.listType === 'custom') {
        return 'Start building your list by adding users.\nClick the button below to begin.';
      } else if (route.params.listType === 'favorite') {
        return 'Users you’ve favorited will appear here.';
      } else if (route.params.listType === 'follower') {
        return 'Users who follow you will appear here.';
      } else {
        return '';
      }
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
      return 'Your List is Empty';
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: UserItemInterface }) => {
      const isSelected = selectedUsers.some(
        user => user === item.listMappingId,
      );
      return (
        <UserListItem
          item={item}
          onSelectUser={onSelectUser}
          isSelected={isSelected}
          showCheckbox={route.params.listType === 'custom'}
        />
      );
    },
    [selectedUsers],
  );

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle={
          route.params.listType === 'favorite'
            ? 'My Favorites'
            : route.params.listType === 'follower'
            ? 'My Followers'
            : allUsers.name
        }
        showProgressBar={false}
        rightIcon={IMAGES.dots}
        onPressRightIcon={() => {
          setSelectedActionSheetAction('');
          listActionSheetRef?.current?.open();
        }}
        showBackButton={true}
      />
      <View style={{ marginHorizontal: horizontalMarginScale(20), flex: 1 }}>
        <SearchInput
          ref={searchInputRef}
          onSearchTextChange={handleSearchTextChange}
          placeholder="Search..."
          rightIcon={IMAGES.filter_lines}
          onPressRightIcon={() => {
            filtersSheetRef?.current?.open();
          }}
          mainContainerStyle={{ marginHorizontal: 0 }}
        />

        <FlatList
          data={allUsers.result || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: verticalMarginScale(16) }}
          ListHeaderComponent={<View />}
          ListFooterComponent={<View />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
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
                isLoading={isLoading}
                footerContent={
                  !isLoading && (
                    <>
                      {filterNumber > 0 ? (
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
                      ) : (
                        <>
                          {route.params.listType === 'custom' ? (
                            <Button
                              title={'Add Users'}
                              imageSource={IMAGES.plus}
                              leftImageStyle={{
                                height: verticalScale(16),
                                width: verticalScale(16),
                              }}
                              onPress={() => {
                                setSelectedActionSheetAction('addUsers');
                                listActionSheetRef?.current?.open();
                              }}
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
                          ) : null}
                        </>
                      )}
                    </>
                  )
                }
              />
            </View>
          }
        />
      </View>
      {selectedUsers.length > 0 ? (
        <Button
          title="Remove from List"
          onPress={() => {
            deleteListUsersSheetRef?.current?.open();
          }}
          colorTheme="dark"
          style={styles.removeCta}
        />
      ) : null}

      <DeleteListUsersSheet
        ref={deleteListUsersSheetRef}
        selectedUsers={selectedUsers}
        listId={allUsers.id}
        listName={allUsers.name}
        onSuccess={() => {
          setCurrentPage(1);
          setSelectedUsers([]);
          refetch();
        }}
      />
      <ListActionsSheet
        ref={listActionSheetRef}
        from="listDetail"
        selectedAction={selectedActionSheetAction}
        setSelectedAction={setSelectedActionSheetAction}
        selectedListId={allUsers.id || ''}
        selectedListName={allUsers.name || ''}
        onSuccess={onListActionSheetSuccess}
        listType={route.params.listType}
        listUserCount={allUsers.result.length}
        selectedUsers={allUsers.result.map(item => item.id) || []}
      />

      <FiltersSheet
        ref={filtersSheetRef}
        from="listDetail"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        selectedFiltersInParent={selectedFilters}
      />
    </View>
  );
};

export default ListDetails;
