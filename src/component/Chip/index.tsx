import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../utils/constants';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import {CustomText} from '../CustomText';

interface ChipProps {
  id: string;
  title: string;
  isSelected: boolean;
  onPress: (id: string) => void;
}

const Chip: React.FC<ChipProps> = ({id, title, onPress, isSelected}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress(id)}>
      <CustomText style={isSelected ? styles.selectedTitle : {}}>
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    borderRadius: radiusScale(99),
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    backgroundColor: COLORS.lighter_gray,
  },
  selectedContainer: {
    backgroundColor: COLORS.black,
  },
  selectedTitle: {color: COLORS.white},
});

export default Chip;
