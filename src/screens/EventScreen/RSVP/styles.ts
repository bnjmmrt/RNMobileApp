import { StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: verticalMarginScale(10) },
  bottomSheetContent: { paddingHorizontal: horizontalScale(12) },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    // marginHorizontal: horizontalMarginScale(12),
    padding: verticalMarginScale(10),
    borderRadius: radiusScale(10),
    borderWidth: horizontalScale(1),
    borderColor: COLORS.lighter_gray,
  },
  scrollContainer: {
    marginVertical: verticalMarginScale(16),
    paddingHorizontal: 16,
  },
  image: {
    width: horizontalScale(80),
    height: verticalScale(110),
    borderRadius: radiusScale(10),
    backgroundColor: COLORS.borderGray,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F1F5',
    padding: verticalMarginScale(12),
    borderRadius: radiusScale(8),
    marginVertical: verticalMarginScale(16),
    justifyContent: 'space-between',
    // marginHorizontal: horizontalMarginScale(12),
  },
  leaveContainer: {
    paddingHorizontal: horizontalScale(12),
    gap: verticalScale(8),
  },
  statusText: {
    fontSize: fontScale(14),
    color: COLORS.black,
    marginLeft: verticalScale(5),
    flex: 1,
  },
  info: {
    marginLeft: horizontalMarginScale(16),
    justifyContent: 'center',
    width: '73%',
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: verticalMarginScale(6),
  },
  details: {
    fontSize: fontScale(12),
    color: 'gray',
  },
  infoText: {
    marginTop: verticalScale(16),
    fontSize: fontScale(12),
    color: COLORS.light_gray,
    lineHeight: verticalScale(14),
  },
  bottomText: {
    paddingHorizontal: verticalMarginScale(12),
    textAlign: 'center',
  },
  label: {
    fontSize: fontScale(14),
    marginTop: verticalMarginScale(2),
  },
  btnStyle: {
    width: Wp(95),
    borderRadius: radiusScale(100),
    alignSelf: 'center',
    marginVertical: verticalMarginScale(10),
    marginTop: 'auto',
  },
  clearButton: {
    borderWidth: horizontalScale(1.5),
    backgroundColor: COLORS.white,
    borderColor: COLORS.lighter_gray,
    width: '48%',
    height: verticalScale(40),
  },
  btnBorder: {
    width: '100%',
    borderWidth: horizontalScale(1.5),
    borderColor: COLORS.black,
    marginTop: 8,
  },
  smallButton: {
    width: '48%',
    height: verticalScale(40),
  },
  rsvpButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalMarginScale(12),
  },
  toastWrapper: {
    position: 'absolute',
    bottom: verticalMarginScale(60),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  toastNoGuest: {
    marginTop: verticalMarginScale(20),
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgRed,
    borderRadius: 12,
  },
  customSelectText: {
    marginTop: verticalMarginScale(4),
    marginBottom: verticalMarginScale(8),
  },

  swapDeletecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    padding: verticalMarginScale(16),
    marginVertical: verticalMarginScale(8),
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    width: horizontalScale(40),
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    color: '#000', // Adjust for contrast
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    color: '#000',
  },
  redButton: {
    backgroundColor: COLORS.errorText,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radiusScale(1000),
    height: 48,
    marginTop: verticalScale(20),
  },
  optionText: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
  },
  cancelPopupContainer: { gap: verticalScale(8), marginTop: verticalScale(4) },
  eventTitle: {
    fontSize: fontScale(32),
    color: COLORS.black,
    alignSelf: 'center',
    fontFamily: fontFamily.RomieTrial_Bold,
    marginBottom: verticalScale(6),
  },
  descText: {
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  guestButton: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(25),
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginTop: verticalScale(5),
  },
  guestButtonText: {
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
    alignSelf: 'center',
  },
});
