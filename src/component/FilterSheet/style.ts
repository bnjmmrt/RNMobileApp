import { Platform, StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginHorizontal: horizontalMarginScale(12),
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
  },

  //arrordian
  accordianContainer: { flex: 1 },
  accordianTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalMarginScale(16),
  },
  accordianArrowContainer: {
    height: verticalScale(32),
    width: verticalScale(32),
    borderRadius: radiusScale(32),
    backgroundColor: COLORS.lighter_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordianTitle: {
    fontSize: fontScale(18),
  },

  //options
  optionAgeContainer: {
    flexDirection: 'row',
    gap: horizontalMarginScale(8),
  },

  //actions
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: verticalMarginScale(30),
    paddingHorizontal: horizontalMarginScale(8),
    gap: horizontalMarginScale(4),
    paddingTop: verticalMarginScale(8),
    borderWidth: 1,
    borderColor: COLORS.bgBackArrow,
    borderTopRightRadius: radiusScale(32),
    borderTopLeftRadius: radiusScale(32),
    backgroundColor: COLORS.white,
    ...(Platform.OS === 'android'
      ? { elevation: 100 }
      : {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 15,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
        }),
  },
  clearAllCta: {
    flex: 0.3,
    minWidth: 'auto',
    maxWidth: "auto",
    paddingHorizontal: horizontalMarginScale(12),
    borderWidth: verticalScale(2),
    borderColor: COLORS.black,
  },
  applyCta: {
    flex: 1,
    paddingHorizontal: horizontalMarginScale(12),
  },

  //date range
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalMarginScale(20),
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(20),
  },
  inputValueWithLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  datePicker: {
    borderRadius: radiusScale(12),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(6),
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: horizontalMarginScale(12),
  },
  icon: {
    width: verticalScale(10),
    height: verticalScale(10),
    marginRight: horizontalMarginScale(6),
  },
  input: {
    flex: 1,
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  dayContainerStyle: {
    width: 40,
    height: 40,
    marginHorizontal: 'auto',
  },
  alert: {
    color: COLORS.red,
  },
  headerButtonStyle: {
    backgroundColor: COLORS.tabBorderColor,
    borderRadius: radiusScale(100),
    height: verticalScale(24),
    width: verticalScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
