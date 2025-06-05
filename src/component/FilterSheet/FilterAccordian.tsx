import { BottomSheetView } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import React, { useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { CustomText } from 'src/component/CustomText';
import { verticalMarginScale } from 'src/utils/dimensions';
import { styles } from './style';

const FilterAccordian = ({
  children,
  title,
  onOpen,
  defaultOpen = false,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onOpen?: () => void;
  onClose?: () => void;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  return (
    <BottomSheetView
      style={[
        styles.accordianContainer,
        isOpen
          ? { paddingBottom: verticalMarginScale(16) }
          : { paddingBottom: 0 },
      ]}>
      <TouchableOpacity
        style={styles.accordianTitleContainer}
        onPress={() => {
          setIsOpen(!isOpen);
          if (!isOpen && onOpen) {
            onOpen();
          } else {
            if (onClose) onClose();
          }
        }}>
        <CustomText style={styles.accordianTitle}>{title}</CustomText>
        <View style={styles.accordianArrowContainer}>
          <Image
            source={IMAGES.arrowRight}
            resizeMode="contain"
            style={{ transform: [{ rotate: isOpen ? '270deg' : '90deg' }] }}
          />
        </View>
      </TouchableOpacity>
      {isOpen ? children : null}
    </BottomSheetView>
  );
};

export default FilterAccordian;
