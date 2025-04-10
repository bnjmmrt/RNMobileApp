import React, { forwardRef, MutableRefObject } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BottomSheet, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

interface SheetProps {
  onSelect: (
    value: 'INVITED' | 'APPLIED' | 'CONFIRMED' | 'DECLINED' | 'DRAFT' | '',
  ) => void;
  selectedValue: string;
}
interface SortSheetProps {
  onSelect: (value: 'ASC' | 'DESC') => void;
  selectedValue: string;
}

interface OptionType {
  id: 'INVITED' | 'APPLIED' | 'CONFIRMED' | 'DECLINED' | 'DRAFT' | '';
  label: string;
}
interface SortingOptionType {
  id: 'ASC' | 'DESC';
  label: string;
}

export const filterOptions: OptionType[] = [
  { id: '', label: 'All' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'INVITED', label: 'Invited' },
  { id: 'APPLIED', label: 'Requested' },
  { id: 'DRAFT', label: 'Drafts' },
  { id: 'DECLINED', label: 'Declined' },
];

export const sortOptions: SortingOptionType[] = [
  { id: 'ASC', label: 'Name Ascending' },
  { id: 'DESC', label: 'Name Descending' },
  // { id: 'party_size', label: 'Party Size' },
];

export const GuestListFilterSheet = forwardRef<BottomSheetMethods, SheetProps>(
  ({ onSelect, selectedValue }, ref) => {
    const bottomSheetRef = ref as MutableRefObject<BottomSheetMethods>;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={['43%', '65%']}
        enableDynamicSizing={false}>
        <View style={styles.container}>
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedValue === option.id && styles.selectedOption,
              ]}
              onPress={() => {
                onSelect(option.id);
                bottomSheetRef?.current?.close();
              }}>
              <Text style={[styles.optionText]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    );
  },
);

export const GuestListSortSheet = forwardRef<
  BottomSheetMethods,
  SortSheetProps
>(({ onSelect, selectedValue }, ref) => {
  const bottomSheetRef = ref as MutableRefObject<BottomSheetMethods>;

  return (
    <BottomSheet ref={ref} snapPoints={['20%']}>
      <View style={styles.container}>
        {sortOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedValue === option.id && styles.selectedOption,
            ]}
            onPress={() => {
              onSelect(option.id);
              bottomSheetRef?.current?.close();
            }}>
            <Text style={[styles.optionText]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomIndicator} />
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(20),
    paddingTop: verticalScale(8),
  },
  optionButton: {
    height: verticalScale(40),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginBottom: verticalScale(4),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
  },
  selectedOption: {
    borderColor: COLORS.black,
    borderWidth: 1,
  },
  optionText: {
    fontSize: fontScale(14),
    fontWeight: '500',
    lineHeight: fontScale(16),
    // fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black,
    textAlign: 'center',
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: COLORS.black,
    borderRadius: 100,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
  },
});
