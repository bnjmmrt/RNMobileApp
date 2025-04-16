import IMAGES from '@images/index';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import FiltersSheet, { SelectedFilters } from 'src/component/FilterSheet';
import Header from 'src/component/Header/Header';
import { InputRefMethods } from 'src/component/Input/Input';
import SearchInput from 'src/component/SearchInput';
import { EventStackParamList } from 'src/navigation/EventStack';
import { ROUTES } from 'src/navigation/Route';
import { useFetchAllUsersQuery } from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import {
  removeSelectedUsersToInvite,
  setSelectedUsersToInvite,
} from 'src/redux/slices/inviteGuestsFlowSlice';
import UserListItem, {
  UserItemInterface,
} from 'src/screens/UsersModule/UsersListItem';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import createStyles from './styles';
import { setInviteGuestAllUsersRefresh, setInviteGuestAllUsersSkip } from 'src/redux/slices/listSkipSlice';

interface SelectGuestsToInviteProps
  extends NativeStackScreenProps<
    EventStackParamList,
    'SelectGuestsToInviteScreen'
  > { }

const SelectGuestsToInviteScreen: React.FC<
  SelectGuestsToInviteProps
> = ({ }) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();

  const searchInputRef = useRef<InputRefMethods>(null);
  const filtersSheetRef = useRef<BottomSheetMethods>(null);

  const listTakeCount = 10;

  const [searchText, setSearchText] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});

  const { selectedUsers, selectedEvent, inviteGuestUsersSkipCount, inviteGuestUsersRefresh } =
    useSelector(
      (state: RootState) => ({
        selectedUsers: state.inviteGuestsFlow.selectedUsers,
        selectedEvent: state.inviteGuestsFlow.selectedEvent,
        inviteGuestUsersSkipCount: state.listSkip.inviteGuestUsersSkipCount,
        inviteGuestUsersRefresh: state.listSkip.inviteGuestUsersRefresh,
      })
    );


  const { data, isLoading, isFetching, refetch } = useFetchAllUsersQuery({
    take: listTakeCount,
    skip: inviteGuestUsersSkipCount,
    searchValue: searchText,
    queryString: filterQuery,
    eventId: selectedEvent?.id,
  });

  // useFocusEffect(
  //   useCallback(() => {
  //     data && refetch()
  //   }, [data]),
  // );

  const onRefreshPage = () => {
    dispatch(setInviteGuestAllUsersRefresh());
  };

  const loadMore = () => {
    console.log('end');

    if (
      !isLoading &&
      !isFetching && data?.data?.totalCount > 0 &&
      inviteGuestUsersSkipCount + listTakeCount < data?.data?.totalCount
    ) {
      dispatch(
        setInviteGuestAllUsersSkip(inviteGuestUsersSkipCount + listTakeCount),
      );
    }
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

  const onSelectUser = (user: UserItemInterface) => {
    const isSelected = selectedUsers.some(
      selectedUser => selectedUser.id === user.id,
    );
    if (isSelected) {
      const newArray = selectedUsers.filter(u => u.id !== user.id);
      dispatch(setSelectedUsersToInvite(newArray));
    } else {
      const newArray = [...selectedUsers, user];
      dispatch(setSelectedUsersToInvite(newArray));
    }
  };

  useEffect(() => {
    dispatch(setInviteGuestAllUsersSkip(0));
    refetch()
  }, [filterQuery, searchText, inviteGuestUsersRefresh])


  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const onApplyFilter = (
    queryString: string,
    numberOfFiltersApplied: number,
    selectedFilters?: SelectedFilters,
  ) => {
    dispatch(setInviteGuestAllUsersSkip(0));
    setFilterQuery(queryString);
    setFilterNumber(numberOfFiltersApplied);
    if (selectedFilters) {
      setSelectedFilters(selectedFilters);
    }
  };

  const onClearFilter = () => {
    setFilterQuery('');
    setFilterNumber(0);
    setSelectedFilters({})
  };

  const onPressNext = () => {
    dispatch(setSelectedUsersToInvite(selectedUsers));
    navigation.navigate(ROUTES.InviteGuestScreen, {
      isManual: false,
      type: 'existing',
    });
  };

  const onPressInviteManually = async () => {
    navigation.navigate(ROUTES.InviteGuestsManuallyScreen);
  };

  const getEmptyStateMessage = () => {
    if (filterNumber > 0 && searchText) {
      return 'Please refine your search.';
    } else if (filterNumber > 0) {
      return 'Remove filters to expand your search';
    } else if (searchText) {
      return 'This users is not in our system or already has a status on the guest list. Tap "+" to add a new guest';
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
      return 'User not found';
    } else {
      return 'No users found!';
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: UserItemInterface }) => {
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
      <View style={styles.skeletonListContainer}>
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <View key={index} style={styles.skeletonItemContainer}>
              {renderUserSkeletonItem()}
            </View>
          ))}
      </View>
    );
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUsersToInvite([]));
      dispatch(removeSelectedUsersToInvite([]));
      dispatch(setInviteGuestAllUsersRefresh());
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
      });
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle="Invite Guests"
        showProgressBar={false}
        rightIconWrapperStyle={{ backgroundColor: COLORS.black }}
        rightIcon={IMAGES.plus}
        onPressRightIcon={onPressInviteManually}
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
        mainContainerStyle={styles.searchInputContainer}
        defaultValue={searchText}
      />

      {(isRendering || isFetching) && inviteGuestUsersSkipCount === 0 ? (
        renderUserSkeletonList()
      ) : (
        <FlatList
          data={data?.data?.result}
          style={styles.flatListContainer}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContentContainer}
          ListFooterComponent={
            (isLoading || isFetching) && inviteGuestUsersSkipCount > 0 ? (
              <ActivityIndicator
                color={COLORS.black}
                style={{
                  marginTop: verticalScale(10),
                  marginBottom: verticalMarginScale(150),
                }}
              />
            ) : (
              <View style={styles.flatListFooter} />
            )
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EventEmptyRecord
                title={getEmptyStateTitle()}
                subTitle={getEmptyStateMessage()}
                isLoading={isRendering}
                footerContent={
                  !isLoading && filterNumber > 0 ? (
                    <Button
                      title={'Reset Filters'}
                      imageSource={IMAGES.refresh}
                      leftImageStyle={styles.resetFiltersButtonImage}
                      onPress={onClearFilter}
                      colorTheme="dark"
                      textStyle={{ marginHorizontal: 0 }}
                      style={styles.resetFiltersButton}
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

      <Button
        title={`${selectedUsers.length > 0 ? `${selectedUsers.length} Selected - ` : ''
          }Next`}
        onPress={onPressNext}
        colorTheme="dark"
        style={styles.nextButton}
        disabled={selectedUsers.length === 0}
      />

      <FiltersSheet
        ref={filtersSheetRef}
        from="inviteGuests"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        selectedFiltersInParent={selectedFilters}
      />
    </View>
  );
};

export default SelectGuestsToInviteScreen;
