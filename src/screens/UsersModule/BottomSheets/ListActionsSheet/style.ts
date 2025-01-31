import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

export const styles = StyleSheet.create({
  actionButtonContainer: {
    gap: verticalMarginScale(4),
    paddingTop: verticalMarginScale(16),
  },
  actionButton: {
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: 99,
  },

  actionContentWrapper: {
    marginHorizontal: horizontalMarginScale(12),
  },
  actionCta: {
    borderRadius: 99,
  },

  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: verticalMarginScale(16),
  },

  //add to list
  listItem: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  createListCta: {
    borderWidth: 1,
    borderColor: COLORS.black,
    marginTop: verticalMarginScale(8),
  },

  //create list
  editListMessage: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginBottom: verticalMarginScale(32),
    marginTop: verticalMarginScale(16),
  },

  //deleteMessage
  deleteListMessage: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginBottom: verticalMarginScale(32),
    marginTop: verticalMarginScale(16),
  },
  deleteCta: {
    backgroundColor: COLORS.errorText,
  },

  // add users
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
    backgroundColor: COLORS.lighter_gray,
    borderRadius: radiusScale(8),
    marginHorizontal: horizontalMarginScale(12),
  },
  userInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(8),
  },
  username: {
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  userArrowWrapper: {
    backgroundColor: COLORS.tabBorderColor,
    padding: verticalMarginScale(6),
    borderRadius: radiusScale(99),
  },
  addUserTitle: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: verticalMarginScale(32),
    marginHorizontal: horizontalMarginScale(12),
  },
});
