import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { fontScale } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import IMAGES from '../../assets/images/index';
import { fontFamily } from '../../utils/functions';

interface GuestEmptyRecordProps {
  onAddGuest?: () => void;
  isSearchResult?: boolean;
  onResetFilters?: () => void;
  filterApplied?: boolean;
  statusFilter?: string;
}

const GuestEmptyRecord: React.FC<GuestEmptyRecordProps> = ({
  onAddGuest,
  isSearchResult = false,
  onResetFilters,
  filterApplied,
  statusFilter,
}) => {
  let title = 'No Guests Yet';
  let message =
    'Start by inviting guests to this event by clicking:\n“Invite Guests” below.';
  if (isSearchResult) {
    title = 'No users found';
    message = 'Expand your search or invite a new guest';
  } else {
    if (filterApplied) {
      title = 'No guests';
      message = 'Remove filters to expand your search';
    } else {
      if (statusFilter !== 'all') {
        title = 'No Guests Yet';
        message =
          'Start by inviting guests to this event by clicking:\n“Invite Guests” below.';
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={IMAGES.noRecord} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={filterApplied ? onResetFilters : onAddGuest}>
          <Image
            source={filterApplied ? IMAGES.refresh : IMAGES.plus}
            style={styles.plusIcon}
          />
          <Text style={styles.buttonText}>
            {filterApplied ? 'Reset Filters' : 'Invite Guests'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.light_gray,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
    gap: 8,
  },
  plusIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.white,
  },
  buttonText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.white,
    fontWeight: '500',
  },
});

export default GuestEmptyRecord;
