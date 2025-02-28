/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import { COLORS, LABLE } from '../../../utils/constants';
import { fontFamily } from 'src/utils/functions';
import {
  fontScale,
  horizontalMarginScale,
  verticalMarginScale,
  horizontalScale,
  verticalScale,
  radiusScale,
} from 'src/utils/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventGuest } from '../types';
import IMAGES from 'src/assets/images';
import SearchInput from 'src/component/SearchInput';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import {
  GuestListFilterSheet,
  GuestListSortSheet,
  filterOptions,
} from '../Guest/GuestListSheets';
import ProgressBanner from 'src/component/ProgressBanner/ProgressBanner';
import GuestEmptyRecord from 'src/component/EmptyRecord/GuestEmptyRecord';
import StatusLabel from 'src/component/StatusLabel/StatusLabel';
import { ROUTES } from 'src/navigation/Route';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetGuestsQuery } from 'src/redux/actions/eventApiAction';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { RootState } from 'src/redux/slices';
import { useDispatch, useSelector } from 'react-redux';
import { setEventId } from 'src/redux/slices/eventSlice';
import FiltersSheet from 'src/component/FilterSheet';
import AvatarInitials from 'src/component/AvatarInitials';

interface EventGuestListProps extends NativeStackScreenProps<any, any> {
  eventId?: string;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const EventGuestList: React.FC<EventGuestListProps> = ({
  navigation,
  route,
}) => {
  const eventId = route?.params?.eventId;

  const [searchText, setSearchText] = useState('');
  const [expandedGuests, setExpandedGuests] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name_asc');
  const filtersSheetRef = useRef<BottomSheetMethods>(null);
  const sortSheetRef = useRef<BottomSheetMethods>(null);
  const searchFilterRef = useRef<BottomSheetMethods>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const dispatch = useDispatch();

  const selectedEvent = useSelector(
    (state: RootState) => state.inviteGuestsFlow.selectedEvent,
  );

  const {
    data: guestsData,
    error: guestsError,
    isLoading: isLoadingGuests,
    isFetching: isFetchingGuests,
    refetch: refetchGuests,
  } = useGetGuestsQuery({ eventId, queryString: filterQuery });

  const guests: EventGuest[] = useMemo(() => {
    const apiGuests = guestsData?.data?.users || [];

    return apiGuests;
  }, [guestsData?.data?.users]);

  useEffect(() => {
    if (guestsError) {
      console.error('Error fetching guests:', guestsError);
      FlashMessageComponent.show('error', 'Failed to load guests');
    }
  }, [guestsError]);

  // Calculate total confirmed guests from entire list
  const totalConfirmedGuests = guests.filter(
    guest => guest.status === 'CONFIRMED',
  ).length;
  const totalGuestCount = guests.length;

  const filteredAndSortedGuests = useMemo(() => {
    let result = [...guests];

    if (searchText.trim()) {
      result = result.filter(guest =>
        guest.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (selectedFilter !== 'all') {
      result = result.filter(
        guest => guest.status.toLowerCase() === selectedFilter,
      );
    }

    result.sort((a, b) => {
      switch (selectedSort) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'party_size':
          const aSize = a.additionalGuests?.length || 0;
          const bSize = b.additionalGuests?.length || 0;
          return bSize - aSize;
        default:
          return 0;
      }
    });

    return result;
  }, [guests, searchText, selectedFilter, selectedSort]);

  const confirmedGuests = filteredAndSortedGuests.filter(
    guest => guest.status === 'CONFIRMED',
  ).length;

  const toggleExpand = (guestId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGuests(prev => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
  };

  const handleAddGuest = () => {
    // Navigate to add guest screen or open add guest modal
    navigation.navigate('AddGuestScreen');
  };

  const onApplyFilter = (
    queryString: string,
    numberOfFiltersApplied: number,
  ) => {
    setFilterQuery(queryString);
    setFilterNumber(numberOfFiltersApplied);
  };

  const onClearFilter = () => {
    setFilterQuery('');
    setFilterNumber(0);
  };

  const renderInvitee = (item: EventGuest) => (
    <TouchableOpacity
      style={styles.inviteeItem}
      onPress={() => {
        navigation.navigate(ROUTES.EventStack, {
          screen: ROUTES.GuestDetailScreen,
          params: {
            guestId: item.id,
            eventId,
          },
        });
      }}>
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
      {item.status === 'CONFIRMED' && (
        <Image
          source={IMAGES.confirmed_badge}
          style={[styles.confirmedBadge]}
        />
      )}
    </TouchableOpacity>
  );

  const renderGuestItem = ({ item }: { item: EventGuest }) => (
    <View>
      <TouchableOpacity
        style={styles.guestItem}
        onPress={() => {
          navigation.navigate(ROUTES.EventStack, {
            screen: ROUTES.GuestDetailScreen,
            params: {
              guestId: item.id,
              eventId,
            },
          });
        }}>
        <View style={styles.leftContainer}>
          <AvatarInitials
            name={item.name}
            imgUrl={item.profilePicture}
            size={40}
          />
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

            <StatusLabel status={item.status} />
          </View>
        </View>
        <View style={styles.rightContainer}>
          {item.status === 'CONFIRMED' && (
            <Image
              source={IMAGES.confirmed_badge}
              style={[styles.confirmedBadge]}
            />
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
          expandedGuests[item.id]
            ? { maxHeight: 1000 }
            : { maxHeight: 0, overflow: 'hidden' },
        ]}>
        {item.additionalGuests?.map(guest => {
          const inviteeGuest: EventGuest = {
            id: guest.guestId,
            name: `${guest.firstName} ${guest.lastName}`,
            status: item.status,
            userId: guest.id,
            profilePicture: undefined,
          };
          return renderInvitee(inviteeGuest);
        })}
      </Animated.View>
    </View>
  );

  const renderContent = () => {
    if (isLoadingGuests || isFetchingGuests) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blueDark} />
        </View>
      );
    }

    if (filteredAndSortedGuests.length === 0) {
      return (
        <View style={{ flex: 1 }}>
          <GuestEmptyRecord onAddGuest={handleAddGuest} />
        </View>
      );
    }

    return (
      <FlatList
        data={filteredAndSortedGuests}
        renderItem={renderGuestItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContainer, { paddingBottom: 60 }]}
        showsVerticalScrollIndicator={false}
        refreshing={isLoadingGuests}
        onRefresh={refetchGuests}
      />
    );
  };

  const onCheckInPress = async () => {
    dispatch(setEventId(eventId));
    navigation.navigate(ROUTES.QRCodeScanner);
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <Image source={IMAGES.downArrow} />
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

      {confirmedGuests > 0 && selectedFilter === 'confirmed' && (
        <ProgressBanner
          confirmed={totalConfirmedGuests}
          total={totalGuestCount}
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
        from="allUsersList"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestName: {
    fontSize: fontScale(14),
    lineHeight: fontScale(16),
    fontWeight: '500',
  },
  inviteCount: {
    fontSize: fontScale(14),
    lineHeight: fontScale(16),
    fontWeight: '700',
  },

  vipContainer: {
    paddingHorizontal: horizontalMarginScale(6),
    paddingVertical: verticalMarginScale(2),
    backgroundColor: COLORS.bgBlue,
    borderRadius: radiusScale(12),
    maxWidth: horizontalScale(32),
  },
  vipText: {
    fontSize: fontScale(12),
    lineHeight: fontScale(14),
    color: COLORS.blueDark,
    fontWeight: '500',
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
  },
  confirmedBadge: {
    width: horizontalScale(18),
    height: verticalScale(18),
    marginRight: horizontalMarginScale(4),
  },
  nestedIcon: {
    marginRight: horizontalMarginScale(8),
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
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventGuestList;
