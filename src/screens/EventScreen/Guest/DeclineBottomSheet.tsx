import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomSheet, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface DeclineBottomSheetProps {
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  onConfirm: () => void;
}

const DeclineBottomSheet = forwardRef<
  BottomSheetMethods,
  DeclineBottomSheetProps
>(({ title, description, buttonText, onConfirm, buttonColor }, ref) => {
  return (
    <BottomSheet
      ref={ref}
      snapPoints={['35%', '40%', '45%']}
      enableDynamicSizing={false}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            style={[
              styles.confirmButton,
              buttonColor && { backgroundColor: buttonColor },
            ]}
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
