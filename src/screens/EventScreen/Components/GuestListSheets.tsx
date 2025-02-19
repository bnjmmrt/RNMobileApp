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
  onSelect: (value: string) => void;
  selectedValue: string;
  showBottomSafeAreaView?: boolean;
}

interface OptionType {
  id: string;
  label: string;
}

export const filterOptions: OptionType[] = [
  { id: 'all', label: 'All' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'invited', label: 'Invited' },
  { id: 'requests', label: 'Requested' },
  { id: 'drafts', label: 'Drafts' },
  { id: 'declined', label: 'Declined' },
];

export const sortOptions: OptionType[] = [
  { id: 'name_asc', label: 'Name Ascending' },
  { id: 'name_desc', label: 'Name Descending' },
  { id: 'party_size', label: 'Party Size' },
];

export const GuestListFilterSheet = forwardRef<BottomSheetMethods, SheetProps>(
  ({ onSelect, selectedValue, showBottomSafeAreaView = true }, ref) => {
    const bottomSheetRef = ref as MutableRefObject<BottomSheetMethods>;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={['43%', '65%']}
        showBottomSafeAreaView={showBottomSafeAreaView}
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

export const GuestListSortSheet = forwardRef<BottomSheetMethods, SheetProps>(
  ({ onSelect, selectedValue, showBottomSafeAreaView = true }, ref) => {
    const bottomSheetRef = ref as MutableRefObject<BottomSheetMethods>;

    return (
      <BottomSheet
        ref={ref}
        snapPoints={['30%', '50%', '75%']}
        showBottomSafeAreaView={showBottomSafeAreaView}>
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
  },
);

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
