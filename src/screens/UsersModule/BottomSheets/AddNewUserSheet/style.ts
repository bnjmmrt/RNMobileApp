import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  Wp,
} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

export const styles = StyleSheet.create({
  container: {
    paddingTop: verticalMarginScale(16),
    marginHorizontal: Wp(5),
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(16),
    marginBottom: verticalMarginScale(8),
  },
  cta: {
    borderRadius: radiusScale(99),
    marginTop: verticalMarginScale(24),
  },

  userPreviewContainer: {
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    borderRadius: radiusScale(16),
    backgroundColor: COLORS.lighter_gray,
    padding: horizontalMarginScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(9),
    marginTop: verticalMarginScale(16),
  },
  userName: {
    color: COLORS.black,
  },
  alreadyPresent: {
    fontSize: fontScale(12),
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(4),
  },
});
