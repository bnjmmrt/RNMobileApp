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
}

const GuestEmptyRecord: React.FC<GuestEmptyRecordProps> = ({
  onAddGuest,
  isSearchResult = false,
  onResetFilters,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={IMAGES.noRecord} style={styles.image} />
        <Text style={styles.title}>
          {isSearchResult ? 'No Users found' : 'No guests'}
        </Text>
        <Text style={styles.subtitle}>
          {isSearchResult
            ? 'Remove filters to expand your search'
            : 'Expand your search or invite a new guest'}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={isSearchResult ? onAddGuest : onResetFilters}>
          <Image
            source={isSearchResult ? IMAGES.plus : IMAGES.refresh}
            style={styles.plusIcon}
          />
          <Text style={styles.buttonText}>
            {isSearchResult ? 'New Guests' : 'Reset Filters'}
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
  },
  subtitle: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.light_gray,
    marginBottom: 24,
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
