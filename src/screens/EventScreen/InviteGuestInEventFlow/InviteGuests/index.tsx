import IMAGES from '@images/index';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {BottomSheetMethods} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FiltersSheet from 'src/component/FilterSheet';
import Header from 'src/component/Header/Header';
import {InputRefMethods} from 'src/component/Input/Input';
import SearchInput from 'src/component/SearchInput';
import {EventStackParamList} from 'src/navigation/EventStack';
import {useFetchAllUsersQuery} from 'src/redux/actions/usersApiAction';
import UserListItem, {
  UserItemInterface,
} from 'src/screens/UsersModule/UsersListItem';
import {COLORS} from 'src/utils/constants';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import createStyles from './styles';
import {ROUTES} from 'src/navigation/Route';
import {useDispatch} from 'react-redux';
import {setSelectedUsersToInvite} from 'src/redux/slices/inviteGuestsFlowSlice';

interface InviteGuestsProps
  extends NativeStackScreenProps<EventStackParamList, 'InviteGuestsScreen'> {}

const InviteGuests: React.FC<InviteGuestsProps> = ({}) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();

  const searchInputRef = useRef<InputRefMethods>(null);
  const filtersSheetRef = useRef<BottomSheetMethods>(null);

  const [allUsers, setAllUsers] = useState<{
    users: UserItemInterface[];
    totalCount: number;
  }>({totalCount: 0, users: []});
  const [selectedUsers, setSelectedUsers] = useState<UserItemInterface[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const {data, isLoading, error, isError, refetch} = useFetchAllUsersQuery({
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
      selectedUser => selectedUser.id === user.id,
    );
    if (isSelected) {
      const newArray = selectedUsers.filter(u => u.id !== user.id);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user];
      setSelectedUsers(newArray);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setCurrentPage(1);
    setSearchText(text);
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

  const onPressNext = () => {
    dispatch(setSelectedUsersToInvite(selectedUsers));
    navigation.navigate(ROUTES.ManageGuestsScreen);
  };

  const renderItem = useCallback(
    ({item}: {item: UserItemInterface}) => {
      const isSelected = selectedUsers.some(user => user.id === item.id);
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
      setAllUsers({totalCount: 0, users: []});
    }
  }, [isError]);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
      });
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle="Invite Guests"
        showProgressBar={false}
        rightIconWrapperStyle={{backgroundColor: COLORS.black}}
      />
      <CustomText style={styles.messageText}>
        {
          "Invite guests to your event. Only users who haven't been invited or assigned a status are shown."
        }
      </CustomText>

      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchTextChange}
        placeholder="Search..."
        rightIcon={IMAGES.filter_lines}
        onPressRightIcon={() => {
          filtersSheetRef?.current?.open();
        }}
        rightIconText={String(filterNumber || '') || ''}
        mainContainerStyle={{marginHorizontal: horizontalMarginScale(20)}}
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
        contentContainerStyle={{gap: verticalMarginScale(16)}}
        ListFooterComponent={
          <View style={{marginBottom: verticalMarginScale(150)}} />
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
              subTitle="This users is not in our system or already has a status on the guest list. Tap “+” to add a new guest"
              isLoading={isLoading}
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

      <Button
        title={`${
          selectedUsers.length > 0 ? `${selectedUsers.length} Selected - ` : ''
        }Next`}
        onPress={onPressNext}
        colorTheme="dark"
        style={{position: 'absolute', bottom: verticalScale(8)}}
        disabled={selectedUsers.length === 0}
      />

      <FiltersSheet
        ref={filtersSheetRef}
        from="allUsersList"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        showBottomSafeAreaView={false}
      />
    </View>
  );
};

export default InviteGuests;
