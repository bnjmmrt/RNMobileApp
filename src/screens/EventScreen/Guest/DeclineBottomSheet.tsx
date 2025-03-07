import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
  horizontalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import BottomSheet, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';

interface DeclineBottomSheetProps {
  title: string;
  description: string;
  buttonText: string;
  onConfirm: () => void;
}

const DeclineBottomSheet = forwardRef<
  BottomSheetMethods,
  DeclineBottomSheetProps
>(({ title, description, buttonText, onConfirm }, ref) => {
  return (
    <BottomSheet ref={ref} snapPoints={['30%', '40%']}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.confirmButton}
            title={buttonText}
            colorTheme="dark"
            onPress={() => {
              onConfirm();
              if (ref && 'current' in ref && ref.current) {
                ref.current.close();
              }
            }}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(20),
    paddingVertical: verticalMarginScale(16),
  },
  title: {
    fontSize: fontScale(24),
    lineHeight: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  description: {
    fontSize: fontScale(14),
    lineHeight: fontScale(16),
    color: COLORS.light_gray,
    textAlign: 'center',
  },
  confirmButton: {
    borderRadius: radiusScale(100),
    backgroundColor: COLORS.errorText,
  },
  buttonContainer: {
    paddingHorizontal: horizontalMarginScale(20),
    paddingTop: verticalMarginScale(8),
  },
});

export default DeclineBottomSheet;
