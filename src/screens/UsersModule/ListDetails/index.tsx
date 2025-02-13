import IMAGES from '@images/index';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import Button from 'src/component/Button';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
} from 'src/utils/dimensions';
import DeleteListUsersSheet from '../BottomSheets/DeleteListUsersSheet';
import ListActionsSheet, {
  listActionCurrentPageType,
} from '../BottomSheets/ListActionsSheet';
import UserListItem, {UserItemInterface} from '../UsersListItem';
import createStyle from './style';
import {AppStackParamList} from 'src/navigation/AppStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFetchCustomListUsersQuery} from 'src/redux/actions/listsApiAction';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import {COLORS} from 'src/utils/constants';

interface ListDetailsProps
  extends NativeStackScreenProps<AppStackParamList, 'ListDetail'> {}

const ListDetails: React.FC<ListDetailsProps> = ({route}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const searchInputRef = useRef<any>(null);
  const deleteListUsersSheetRef = useRef<BottomSheetMethods>(null);
  const listActionSheetRef = useRef<BottomSheetMethods>(null);

  const [selectedActionSheetAction, setSelectedActionSheetAction] =
    useState<listActionCurrentPageType>('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [allUsers, setAllUsers] = useState<{
    users: UserItemInterface[];
    count: number;
    name: string;
    id: string;
  }>({count: 0, users: [], id: '', name: ''});
  const [currentPage, setCurrentPage] = useState(1);

  const {data, isLoading, refetch} = useFetchCustomListUsersQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
    listId: route.params.list,
    searchValue: searchText,
    listType: route.params.listType || 'custom',
  });

  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        setAllUsers(data?.data);
      } else {
        setAllUsers(prev => ({
          ...prev,
          count: data.data.count,
          users: [...prev?.users, ...data?.data?.users],
        }));
      }
    }
  }, [data]);

  const loadMore = () => {
    if (allUsers?.users?.length < data?.data?.count) {
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

  const renderItem = useCallback(
    ({item}: {item: UserItemInterface}) => {
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
      <View style={{marginHorizontal: horizontalMarginScale(20), flex: 1}}>
        <SearchInput
          ref={searchInputRef}
          onSearchTextChange={handleSearchTextChange}
          placeholder="Search..."
          // rightIcon={IMAGES.filter_lines}
          mainContainerStyle={{marginHorizontal: 0}}
        />
        {isLoading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator color={COLORS.black} />
          </View>
        ) : null}

        <FlatList
          data={allUsers.users || []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{gap: verticalMarginScale(16)}}
          ListHeaderComponent={<View />}
          ListFooterComponent={<View />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <>
              {!isLoading ? (
                <View
                  style={{
                    height: Hp(55),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <EventEmptyRecord
                    title="Your List is Empty"
                    subTitle={`Start building your list by adding users.\nClick the button below to begin.`}
                    isLoading={false}
                  />
                </View>
              ) : null}
            </>
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
      />
    </View>
  );
};

export default ListDetails;
