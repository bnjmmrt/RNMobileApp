/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useMemo } from 'react';
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
} from 'react-native';
import { COLORS } from '../../utils/constants';
import { fontFamily } from 'src/utils/functions';
import { fontScale, horizontalMarginScale } from 'src/utils/dimensions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import FastImage from '@d11/react-native-fast-image';
import { guestListMock, GuestItem } from './mocks/guestListMock';
import IMAGES from 'src/assets/images';
import SearchInput from 'src/component/SearchInput';
import { BottomSheetMethods } from 'src/component/BottomSheet/BottomSheet';
import {
  GuestListFilterSheet,
  GuestListSortSheet,
  filterOptions,
} from './Guest/GuestListSheets';
import ProgressBanner from 'src/component/ProgressBanner/ProgressBanner';
import GuestEmptyRecord from 'src/component/EmptyRecord/GuestEmptyRecord';
import StatusLabel from 'src/component/StatusLabel/StatusLabel';
import { ROUTES } from 'src/navigation/Route';
import { SafeAreaView } from 'react-native-safe-area-context';

interface EventGuestListProps extends NativeStackScreenProps<any, any> {}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const EventGuestList: React.FC<EventGuestListProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [expandedGuests, setExpandedGuests] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name_asc');
  const filtersSheetRef = useRef<BottomSheetMethods>(null);
  const sortSheetRef = useRef<BottomSheetMethods>(null);

  // Use mock data for now
  const guests = guestListMock;

  // Filter and sort guests
  const filteredAndSortedGuests = useMemo(() => {
    let result = [...guests];

    // Apply search filter
    if (searchText.trim()) {
      result = result.filter(guest =>
        guest.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply status filter
    if (selectedFilter !== 'all') {
      result = result.filter(
        guest => guest.status.toLowerCase() === selectedFilter,
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'party_size':
          const aSize = a.invitees?.length || 0;
          const bSize = b.invitees?.length || 0;
          return bSize - aSize;
        default:
          return 0;
      }
    });

    return result;
  }, [guests, searchText, selectedFilter, selectedSort]);

  // Add calculation for confirmed guests from filtered list
  const confirmedGuests = filteredAndSortedGuests.filter(
    guest => guest.status === 'Confirmed',
  ).length;
  const totalGuests = filteredAndSortedGuests.length;

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

  const renderInvitee = ({ item }: { item: GuestItem }) => (
    <View style={styles.inviteeItem}>
      <View style={styles.inviteeLeftContainer}>
        <Image source={IMAGES.nested_badge} style={[styles.nestedIcon]} />
        <View style={styles.leftContainer}>
          <FastImage
            source={{
              uri:
                item.avatar ||
                'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(item.name),
            }}
            style={styles.inviteeAvatar}
          />
          <View style={styles.guestInfo}>
            <Text style={[styles.guestName]}>{item.name}</Text>
          </View>
        </View>
      </View>

      {item.status === 'Confirmed' && (
        <Image
          source={IMAGES.confirmed_badge}
          style={[styles.confirmedBadge]}
        />
      )}

      <View style={styles.vipContainer}>
        <Text style={styles.vipText}>VIP</Text>
      </View>
    </View>
  );

  const renderGuestItem = ({ item }: { item: GuestItem }) => (
    <View>
      <TouchableOpacity
        style={styles.guestItem}
        onPress={() => {
          navigation.navigate(ROUTES.EventStack, {
            screen: ROUTES.GuestDetailScreen,
            params: {
              guest: item,
            },
          });
        }}>
        <View style={styles.leftContainer}>
          <FastImage
            source={{
              uri:
                item.avatar ||
                'https://ui-avatars.com/api/?name=' +
                  encodeURIComponent(item.name),
            }}
            style={styles.avatar}
          />
          <View style={styles.guestInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.guestName}>{item.name}</Text>
              {item.invitees && (
                <Text
                  style={
                    styles.inviteCount
                  }>{` +${item.invitees.length}`}</Text>
              )}
            </View>

            <StatusLabel status={item.status} />
          </View>
        </View>
        <View style={styles.rightContainer}>
          {item.status === 'Confirmed' && (
            <Image
              source={IMAGES.confirmed_badge}
              style={[styles.confirmedBadge]}
            />
          )}
          {item.isVip && (
            <View style={styles.vipContainer}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}
          {item.invitees && (
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
        {item.invitees?.map(invitee => renderInvitee({ item: invitee }))}
      </Animated.View>
    </View>
  );

  const renderContent = () => {
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
      />
    );
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
          <Text style={styles.title}>Guest List</Text>
          <TouchableOpacity>
            <View style={styles.iconButton}>
              <Image source={IMAGES.qr} style={styles.icon} />
            </View>
          </TouchableOpacity>
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
              sortSheetRef?.current?.open();
            }}
            mainContainerStyle={{ marginHorizontal: horizontalMarginScale(20) }}
          />
        </View>

        {renderContent()}
      </View>

      {confirmedGuests > 0 && selectedFilter === 'Confirmed' && (
        <ProgressBanner confirmed={confirmedGuests} total={totalGuests} />
      )}

      <GuestListFilterSheet
        ref={filtersSheetRef}
        onSelect={handleFilterSelect}
        selectedValue={selectedFilter}
        showBottomSafeAreaView={false}
      />

      <GuestListSortSheet
        ref={sortSheetRef}
        onSelect={handleSortSelect}
        selectedValue={selectedSort}
        showBottomSafeAreaView={false}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
  },

  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  inviteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 40,
    paddingVertical: 8,
  },
  inviteeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  inviteeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 16,
  },
  guestInfo: {
    gap: 4,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: COLORS.bgBlue,
    borderRadius: 12,
    maxWidth: 32,
  },
  vipText: {
    fontSize: fontScale(12),
    lineHeight: fontScale(14),
    color: COLORS.blueDark,
    fontWeight: '500',
  },
  expandButton: {
    width: 32,
    height: 32,
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: COLORS.lighter_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    tintColor: COLORS.black,
  },
  confirmedBadge: {
    width: 18,
    height: 18,
    marginRight: 4,
  },
  nestedIcon: {
    marginRight: 8,
  },
  inviteesContainer: {
    marginTop: 4,
    overflow: 'hidden',
  },
  filterDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    height: 48,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  dropdownLeft: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  filterButton: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: COLORS.neutral_surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.black,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
});

export default EventGuestList;
