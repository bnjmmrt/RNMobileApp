import IMAGES from '@images/index';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import {COLORS} from 'src/utils/constants';
import {Filter} from '../../BottomSheets/EventFilterSheet';
import createStyle from './style';

interface FilterBarProps {
  selectedFilter: Filter;
  onPressFilter: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedFilter,
  onPressFilter,
}) => {
  const styles = createStyle();

  const getChipColor = () => {
    switch (selectedFilter.value) {
      case 'UPCOMING':
        return {bg: COLORS.bgGreen, text: COLORS.success};
      case 'PAST':
        return {bg: COLORS.yellowLight, text: COLORS.yellowDark};
      case 'INVITED':
        return {bg: COLORS.bgBlue, text: COLORS.blueDark};
      case 'APPLIED':
        return {bg: COLORS.black, text: COLORS.white};
    }
  };

  return (
    <View style={styles.filterBarContainer}>
      <View
        style={[
          styles.filterBarSelectedSatusChip,
          {backgroundColor: getChipColor()?.bg},
        ]}>
        <CustomText
          style={[
            styles.filterBarSelectedSatusChipText,
            {color: getChipColor()?.text},
          ]}>
          {selectedFilter.label}
        </CustomText>
      </View>

      <TouchableOpacity
        style={styles.filterBarRightIconWrapper}
        onPress={onPressFilter}>
        <Image source={IMAGES.paragraph_spacing} />
      </TouchableOpacity>
    </View>
  );
};

export default FilterBar;
