import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
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
} from './Components/GuestListSheets';

interface EventGuestListProps extends NativeStackScreenProps<any, any> {}

const EventGuestList: React.FC<EventGuestListProps> = ({ navigation }) => {
//   const [searchText, setSearchText] = useState('');
  const [expandedGuests, setExpandedGuests] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('name_asc');
  const filtersSheetRef = useRef<BottomSheetMethods>(null);
  const sortSheetRef = useRef<BottomSheetMethods>(null);

  // Use mock data for now
  const guests = guestListMock;

  const toggleExpand = (guestId: string) => {
    setExpandedGuests(prev => ({
      ...prev,
      [guestId]: !prev[guestId],
    }));
  };

  const handleSearchTextChange = () => {
    // setSearchText(text);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
  };

  const renderInvitee = ({ item }: { item: GuestItem }) => (
    <View style={styles.inviteeItem}>
      <View style={styles.inviteeLeftContainer}>
        <View style={styles.inviteeConnector} />
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
            <Text style={styles.guestName}>{item.name}</Text>
            <Text
              style={[
                styles.guestStatus,
                {
                  color:
                    item.status === 'Confirmed'
                      ? COLORS.success
                      : item.status === 'Declined'
                      ? COLORS.errorText
                      : COLORS.black2,
                },
              ]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
      {item.isVip && (
        <View style={styles.vipContainer}>
          <Text style={styles.vipText}>VIP</Text>
        </View>
      )}
    </View>
  );

  const renderGuestItem = ({ item }: { item: GuestItem }) => (
    <View>
      <TouchableOpacity
        style={styles.guestItem}
        onPress={() => item.invitees && toggleExpand(item.id)}>
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
              {item.inviteCount ? (
                <Text
                  style={styles.inviteCount}>{` +${item.inviteCount}`}</Text>
              ) : null}
            </View>
            <Text
              style={[
                styles.guestStatus,
                {
                  color:
                    item.status === 'Confirmed'
                      ? COLORS.success
                      : item.status === 'Declined'
                      ? COLORS.errorText
                      : COLORS.black2,
                },
              ]}>
              {item.status}
            </Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
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
      {expandedGuests[item.id] && item.invitees && (
        <View style={styles.inviteesContainer}>
          {item.invitees.map(invitee => renderInvitee({ item: invitee }))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
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
            <View style={styles.dropdownTextContainer}>
              <Text style={styles.dropdownText}>
                {filterOptions.find(option => option.id === selectedFilter)
                  ?.label || 'All'}
              </Text>
            </View>
            <Image source={IMAGES.downArrow} />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => filtersSheetRef?.current?.open()}>
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
      </View>

      <FlatList
        data={guests}
        renderItem={renderGuestItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
    </View>
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
    padding: 20,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 15,
  },
  inviteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
  },
  inviteeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteeConnector: {
    width: 20,
    height: 2,
    backgroundColor: COLORS.borderGray,
    marginRight: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  guestInfo: {
    gap: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guestName: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black,
  },
  inviteCount: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black2,
  },
  guestStatus: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  vipContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.success,
    borderRadius: 12,
  },
  vipText: {
    fontSize: fontScale(12),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.white,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.lighter_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.black,
  },
  arrowIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  inviteesContainer: {
    marginTop: -5,
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
  dropdownTextContainer: {
    borderRadius: 128,
    backgroundColor: COLORS.lighter_gray,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdownText: {
    fontSize: fontScale(12),
    lineHeight: fontScale(14),
    fontWeight: 500,
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.neutral_disabled,
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
});

export default EventGuestList;
