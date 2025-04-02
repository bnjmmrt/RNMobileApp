import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from '../../utils/dimensions';
import { CustomText } from '../CustomText';
import IMAGES from '@images/index';

interface ChipProps {
  id: string;
  title: string;
  isSelected: boolean;
  showCross?: boolean;
  onPress: (id: string) => void;
}

const Chip: React.FC<ChipProps> = ({
  id,
  title,
  onPress,
  isSelected,
  showCross,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      activeOpacity={showCross ? 1 : 0}
      onPress={() => {
        if (!showCross) {
          onPress(id);
        }
      }}>
      <CustomText style={isSelected ? styles.selectedTitle : {}}>
        {title}
      </CustomText>
      {showCross ? (
        <TouchableOpacity onPress={() => onPress(id)}>
          <Image
            source={IMAGES.filterClose}
            style={{ tintColor: COLORS.white }}
          />
        </TouchableOpacity>
      ) : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(6),
  },
  selectedContainer: {
    backgroundColor: COLORS.black,
  },
  selectedTitle: { color: COLORS.white },
});

export default Chip;
