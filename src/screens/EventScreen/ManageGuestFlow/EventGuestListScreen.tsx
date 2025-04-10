/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import IMAGES from 'src/assets/images';
import AvatarInitials from 'src/component/AvatarInitials';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import GuestEmptyRecord from 'src/component/EmptyRecord/GuestEmptyRecord';
import FiltersSheet from 'src/component/FilterSheet';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import ProgressBanner from 'src/component/ProgressBanner/ProgressBanner';
import SearchInput from 'src/component/SearchInput';
import StatusLabel from 'src/component/StatusLabel/StatusLabel';
import { TOP_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';
import { EventStackParamList } from 'src/navigation/EventStack';
import { ROUTES } from 'src/navigation/Route';
import { useGetGuestsQuery } from 'src/redux/actions/eventApiAction';
import { RootState } from 'src/redux/slices';
import { setEventId } from 'src/redux/slices/eventSlice';
import {
  Hp,
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { changeSafeAreaViewConfig, fontFamily } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { COLORS, LABLE } from '../../../utils/constants';
import {
  GuestListFilterSheet,
  GuestListSortSheet,
  filterOptions,
} from '../Guest/GuestListSheets';
import { EventGuest } from '../types';

export interface GuestCountInterface {
  data: {
    data: {
      confirmedCount: number;
      declinedCount: number;
      draftedCount: number;
      invitedCount: number;
      requestedCount: number;
      totalCount: number;
    };
  };
  status: number;
}

interface EventGuestListProps
  extends NativeStackScreenProps<EventStackParamList, 'EventGuestList'> {
  eventId?: string;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const GuestListSkeleton = () => (
  <FlatList
    data={[1, 2, 3, 4, 5]}
    renderItem={() => (
      <SkeletonPlaceholder backgroundColor={COLORS.lighter_gray}>
        <View style={[styles.guestItem, styles.skeletonGuestItem]}>
          <View style={styles.leftContainer}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.guestInfo}>
              <View style={styles.nameContainer}>
                <View style={styles.skeletonName} />
              </View>
              <View style={styles.skeletonStatus} />
            </View>
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.skeletonTicketType} />
            <View style={styles.skeletonExpandButton} />
          </View>
        </View>
      </SkeletonPlaceholder>
    )}
    keyExtractor={item => item.toString()}
    contentContainerStyle={styles.listContainer}
    showsVerticalScrollIndicator={false}
  />
);

const EventGuestList: React.FC<EventGuestListProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();

  const eventId = route?.params?.eventId;
  const listFilter = route?.params?.listFilter;

  const filtersSheetRef = useRef<BottomSheetMethods>(null);
  const sortSheetRef = useRef<BottomSheetMethods>(null);
  const searchFilterRef = useRef<BottomSheetMethods>(null);

  const [expandedGuests, setExpandedGuests] = useState<{
    [key: string]: boolean;
  }>({});

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<'ASC' | 'DESC'>('ASC');
  const [selectedFilter, setSelectedFilter] = useState<
    'INVITED' | 'APPLIED' | 'CONFIRMED' | 'DECLINED' | 'DRAFT' | ''
  >('');

  const [allGuests, setAllGuests] = useState<{
    result: EventGuest[];
    totalCount: number;
  }>({ totalCount: 0, result: [] });

  const selectedEvent = useSelector(
    (state: RootState) => state.inviteGuestsFlow.selectedEvent,
    shallowEqual,
  );

  const {
    data: guestsData,
    error: guestsError,
    isLoading: isLoadingGuests,
    isFetching: isFetchingGuests,
    refetch: refetchGuests,
  } = useGetGuestsQuery({
    eventId,
    queryString: filterQuery,
    take: 10,
    skip: (currentPage - 1) * 10,
    searchValue: searchText,
    guestStatus: selectedFilter,
    sortBy: 'name',
    sortDirection: selectedSort,
  });

  const loadMore = () => {
    if (
      allGuests?.result?.length < guestsData?.data?.totalCount &&
      !isLoadingGuests &&
      !isFetchingGuests
    ) {
      setCurrentPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (guestsError) {
      FlashMessageComponent.show('error', 'Failed to load guests');
    }
  }, [guestsError]);

  useEffect(() => {
    if (listFilter) {
      handleFilterSelect(listFilter);
    }
  }, [listFilter]);

  useEffect(() => {
    if (guestsData && guestsData.data) {
      if (currentPage === 1) {
        setAllGuests(guestsData.data);
      } else {
        setAllGuests(prev => ({
          totalCount: guestsData.data.totalCount,
          result: [...prev.result, ...guestsData.data.result],
        }));
      }
    }
  }, [guestsData]);

  useFocusEffect(
    useCallback(() => {
      // fetchEventGuests();
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
        showBottomSafeAreaView: false,
      });
    }, []),
  );

  const fetchEventGuests = () => {
    setCurrentPage(1);
    // refetchGuests();
  };

  const toggleExpand = (guestId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGuests(prev => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };

  const handleSearchTextChange = (text: string) => {
    setCurrentPage(1);
    setSearchText(text);
  };

  const handleFilterSelect = (
    filter: 'INVITED' | 'APPLIED' | 'CONFIRMED' | 'DECLINED' | 'DRAFT' | '',
  ) => {
    setCurrentPage(1);
    setSelectedFilter(filter);
  };

  const handleSortSelect = (sort: 'ASC' | 'DESC') => {
    setCurrentPage(1);
    setSelectedSort(sort);
  };

  const handleAddGuest = () => {
    navigation.navigate(ROUTES.SelectGuestsToInviteScreen);
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setFilterQuery('');
    setFilterNumber(0);
    setSelectedFilter('');
    setSelectedSort('ASC');
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
    setFilterQuery('');
    setFilterNumber(0);
    setCurrentPage(1);
  };

  const renderInvitee = (item: EventGuest, leadId: string, index: number) => (
    <TouchableOpacity
      style={styles.inviteeItem}
      onPress={() => {
        navigation.navigate(ROUTES.GuestDetailScreen, {
          guestId: leadId,
          eventId,
        });
      }}
      key={`lead_guest${leadId}_guest_${item.id}_${index}`}>
      <View style={styles.inviteeLeftContainer}>
        <Image source={IMAGES.nested_badge} style={[styles.nestedIcon]} />
        <View style={styles.leftContainer}>
          <AvatarInitials
            name={item.name}
            imgUrl={item.profilePicture}
            size={24}
          />
          <View style={styles.guestInfo}>
            <Text style={[styles.guestName]}>{item.name}</Text>
          </View>
        </View>
      </View>
      {item.checkIn && (
        <Image
          source={IMAGES.confirmed_badge}
          style={[styles.confirmedBadge]}
        />
      )}
    </TouchableOpacity>
  );

  const renderGuestItem = ({
    item,
    index,
  }: {
    item: EventGuest;
    index: number;
  }) => (
    <View>
      <TouchableOpacity
        style={styles.guestItem}
        onPress={() => {
          navigation.navigate(ROUTES.GuestDetailScreen, {
            guestId: item.id,
            eventId,
          });
        }}>
        <View style={styles.leftContainer}>
          <View>
            {selectedFilter === 'APPLIED' && Boolean(item.vouches?.length) && (
              <View style={styles.vouchIndicator} />
            )}
            <AvatarInitials
              name={item.name}
              imgUrl={item.profilePicture}
              size={40}
            />
          </View>
          <View style={styles.guestInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.guestName}>{item.name}</Text>

              {Boolean(item.additionalGuests?.length) && (
                <Text
                  style={
                    styles.inviteCount
                  }>{` +${item.additionalGuests?.length}`}</Text>
              )}
            </View>

            {selectedFilter === '' && <StatusLabel status={item.status} />}
          </View>
        </View>
        <View style={styles.rightContainer}>
          {item.checkIn && (
            <Image
              source={IMAGES.confirmed_badge}
              style={[styles.confirmedBadge]}
            />
          )}

          {item.ticketType && (
            <View style={styles.ticketTypeContainer}>
              <Text style={styles.ticketTypeText}>{item.ticketType}</Text>
            </View>
          )}

          {item.additionalGuests && item.additionalGuests.length > 0 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => toggleExpand(item.id)}>
              <Image
                source={IMAGES.downArrow}
                style={[
                  styles.arrowIcon,
                  expandedGuests[item.id] && styles.arrowIconRotated,
                ]}
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.inviteesContainer,
          expandedGuests[item.id] ? {} : { maxHeight: 0, overflow: 'hidden' },
        ]}>
        {item.additionalGuests?.map(guest => {
          const inviteeGuest: EventGuest = {
            id: guest.guestId,
            name: `${guest.firstName} ${guest.lastName}`,
            status: item.status,
            userId: guest.id,
            profilePicture: undefined,
            checkIn: guest.checkIn,
          };
          return renderInvitee(inviteeGuest, item.id, index);
        })}
      </Animated.View>
    </View>
  );

  const renderContent = () => {
    if ((isLoadingGuests || isFetchingGuests) && currentPage === 1) {
      return <GuestListSkeleton />;
    }

    return (
      <FlatList
        data={allGuests?.result || []}
        renderItem={renderGuestItem}
        keyExtractor={(item, index) => `lead_guest${item.id}_${index}`}
        contentContainerStyle={[
          styles.listContainer,
          styles.contentListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={fetchEventGuests}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {allGuests?.result.length === 0 &&
              !isLoadingGuests &&
              !isFetchingGuests && (
                <GuestEmptyRecord
                  onAddGuest={handleAddGuest}
                  isSearchResult={Boolean(searchText.trim())}
                  onResetFilters={handleResetFilters}
                  filterApplied={Boolean(filterNumber)}
                  statusFilter={selectedFilter}
                />
              )}
          </View>
        }
        ListFooterComponent={
          (isLoadingGuests || isFetchingGuests) && currentPage > 1 ? (
            <ActivityIndicator
              color={COLORS.black}
              style={{ marginTop: verticalScale(10) }}
            />
          ) : (
            <View style={{ height: verticalScale(50) }} />
          )
        }
      />
    );
  };

  const onCheckInPress = async () => {
    dispatch(setEventId(eventId));
    navigation.navigate(ROUTES.QRCodeScanner);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.iconButton}>
              <Image source={IMAGES.leftArrow} style={styles.icon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.title}>{LABLE.GUEST_LIST}</Text>

          {selectedEvent?.useQr ? (
            <TouchableOpacity onPress={onCheckInPress}>
              <View style={styles.iconButton}>
                <Image source={IMAGES.qr} style={styles.icon} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.phBTn} />
          )}
        </View>

        <TouchableOpacity
          style={styles.filterDropdown}
          onPress={() => filtersSheetRef?.current?.open()}>
          <View style={styles.dropdownLeft}>
            <StatusLabel
              status={
                filterOptions.find(option => option.id === selectedFilter)
                  ?.label || 'All'
              }
              isFilter={true}
            />
            <Image resizeMode="contain" source={IMAGES.downArrow} />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => sortSheetRef?.current?.open()}>
            <Image source={IMAGES.sort} style={styles.filterIcon} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View>
          <SearchInput
            onSearchTextChange={handleSearchTextChange}
            placeholder="Search for Event Guests..."
            rightIcon={IMAGES.filter_lines}
            onPressRightIcon={() => {
              searchFilterRef?.current?.open();
            }}
            rightIconText={String(filterNumber || '') || ''}
            mainContainerStyle={{ marginHorizontal: horizontalMarginScale(20) }}
          />
        </View>

        {renderContent()}
      </View>

      {allGuests?.totalCount > 0 && selectedFilter === 'CONFIRMED' && (
        <ProgressBanner
          confirmed={selectedEvent?.totalCheckedInGuests || 0}
          total={selectedEvent?.totalConfirmedGuests || 0}
        />
      )}

      <GuestListFilterSheet
        ref={filtersSheetRef}
        onSelect={handleFilterSelect}
        selectedValue={selectedFilter}
      />

      <GuestListSortSheet
        ref={sortSheetRef}
        onSelect={handleSortSelect}
        selectedValue={selectedSort}
      />

      <FiltersSheet
        ref={searchFilterRef}
        from="manageGuests"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: TOP_SAFEAREA_SPACING,
  },

  headerTop: {
    flexDirection: 'row',
    paddingHorizontal: horizontalMarginScale(20),
    paddingVertical: verticalMarginScale(16),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  phBTn: {
    width: verticalScale(40),
    height: verticalScale(40),
  },
  iconButton: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radiusScale(22),
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    resizeMode: 'contain',
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
  },

  listContainer: {
    paddingHorizontal: horizontalMarginScale(12),
    paddingBottom: verticalMarginScale(16),
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: verticalMarginScale(16),
  },
  inviteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: horizontalMarginScale(16),
    paddingRight: horizontalMarginScale(40),
    paddingVertical: verticalMarginScale(8),
  },
  inviteeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(10),
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIconRotated: {
    transform: [{ rotate: '180deg' }],
  },

  guestInfo: {
    gap: verticalMarginScale(4),
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestName: {
    fontSize: fontScale(14),
    lineHeight: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  inviteCount: {
    fontSize: fontScale(14),
    lineHeight: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },

  ticketTypeContainer: {
    paddingHorizontal: horizontalMarginScale(6),
    paddingVertical: verticalMarginScale(2),
    backgroundColor: COLORS.bgBlue,
    borderRadius: radiusScale(12),
  },
  ticketTypeText: {
    fontSize: fontScale(12),
    lineHeight: fontScale(14),
    color: COLORS.blueDark,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  expandButton: {
    width: verticalScale(32),
    height: verticalScale(32),
    marginLeft: horizontalMarginScale(8),
    borderRadius: radiusScale(16),
    backgroundColor: COLORS.lighter_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    tintColor: COLORS.black,
    resizeMode: 'contain',
  },
  confirmedBadge: {
    width: horizontalScale(18),
    height: verticalScale(18),
    marginRight: horizontalMarginScale(4),
    resizeMode: 'contain',
  },
  nestedIcon: {
    marginRight: horizontalMarginScale(8),
    resizeMode: 'contain',
  },
  inviteesContainer: {
    marginTop: verticalMarginScale(4),
    overflow: 'hidden',
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: horizontalMarginScale(10),
    height: verticalScale(48),
    paddingHorizontal: horizontalMarginScale(16),
    justifyContent: 'space-between',
    marginHorizontal: horizontalMarginScale(20),
    marginBottom: verticalMarginScale(12),
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(8),
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
  },
  dropdownLeft: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: horizontalMarginScale(8),
  },
  filterButton: {
    width: verticalScale(32),
    height: verticalScale(32),
    borderRadius: radiusScale(20),
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
    tintColor: COLORS.black,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  vouchIndicator: {
    width: horizontalScale(12),
    height: verticalScale(12),
    borderRadius: radiusScale(12),
    backgroundColor: COLORS.blueDark,
    position: 'absolute',
    right: -10,
    top: 0,
    zIndex: 1,
  },
  skeletonGuestItem: {
    paddingVertical: verticalMarginScale(12),
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  skeletonName: {
    width: 120,
    height: 16,
    borderRadius: 4,
  },
  skeletonStatus: {
    width: 80,
    height: 20,
    borderRadius: 12,
    marginTop: 4,
  },
  skeletonTicketType: {
    width: 60,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  skeletonExpandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lighter_gray,
  },
  contentListContainer: {
    paddingBottom: 60,
  },
  emptyContainer: {
    height: Hp(67),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventGuestList;
