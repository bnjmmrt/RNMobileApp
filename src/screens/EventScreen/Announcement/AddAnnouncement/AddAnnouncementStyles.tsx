import { StyleSheet } from "react-native"
import { COLORS } from "src/utils/constants"
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from "src/utils/dimensions"
import { fontFamily } from "src/utils/functions"

const AddAnnouncementStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
      // paddingBottom: 20
    },
    btnStyle: {
      marginTop: verticalMarginScale(35),
      borderRadius: radiusScale(100),
      bottom: verticalMarginScale(2),
    },
    cancelbtnStyle: {
      marginTop: verticalMarginScale(10),
      borderRadius: radiusScale(100),
      bottom: verticalMarginScale(2),
    },
    clearButton: {
      borderWidth: horizontalScale(2),
      backgroundColor: COLORS.white,
      borderColor: COLORS.black,
    },
    Detailcontainer: {
      marginHorizontal: horizontalMarginScale(1),
      marginVertical: verticalMarginScale(10),
      padding: horizontalMarginScale(16),
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: radiusScale(16),
    },
    lineView: {
      marginVertical: verticalMarginScale(10),
      borderWidth: 0.8,
      borderColor: COLORS.borderGray,
    },
    contentContainer: {
      flex: 1,
      // paddingVertical: verticalMarginScale(10),
      paddingHorizontal: horizontalMarginScale(20),
    },
    scrollContainer: { paddingBottom: verticalMarginScale(40) },
    label: {
      // paddingVertical: horizontalMarginScale(2),
      fontSize: fontScale(12),
      paddingTop: verticalMarginScale(20),
      color: COLORS.black,
      fontWeight: '500',
      lineHeight: 16,
    },
    attachDescription: {
      flex: 1,
      fontSize: fontScale(12),
      color: COLORS.light_text,
      fontWeight: '500',
      fontFamily: fontFamily.ABCDiatype_Bold,
    },
    attachDes: {
      fontSize: fontScale(12),
      color: COLORS.light_text,
      fontWeight: '500',
      left: -11,
      fontFamily: fontFamily.ABCDiatype_Bold,
    },
    inputStyle:{
      fontSize: fontScale(14),
      color: COLORS.light_text,
      fontWeight: '500',
      left: -11,
      fontFamily: fontFamily.ABCDiatype_Bold,
    },
    bottomSheetContent: { paddingHorizontal: horizontalScale(16) },
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
    guestButtonText: { fontSize: fontScale(14), color: COLORS.black, fontFamily: fontFamily.ABCDiatype_Medium },
    iconWrapper: {
      width: verticalScale(24),
      height: verticalScale(24),
      borderRadius: radiusScale(24),
      backgroundColor: COLORS.tabBorderColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    recipintWrapper: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: radiusScale(24),
      backgroundColor: COLORS.tabBorderColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    receipientImg :{ borderRadius: 20, borderWidth: 3, borderColor: COLORS.white},
    attachWrapper: {
      width: verticalScale(96),
      height: verticalScale(96),
      borderRadius: radiusScale(8),
      marginVertical: verticalMarginScale(5),
      backgroundColor: COLORS.lighter_gray,
      justifyContent: 'center',
      alignItems: 'center',
    },
    attachImgWrapper:{
      width: verticalScale(96),
      height: verticalScale(96),
      borderRadius: radiusScale(8),
      marginVertical: verticalMarginScale(5),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: verticalMarginScale(5)
    },
    countWrapper: {
      paddingHorizontal: horizontalScale(10),
      paddingVertical: verticalScale(3),
      borderRadius: radiusScale(128),
      borderWidth:1,
      borderColor:COLORS.tabBorderColor,
      backgroundColor: COLORS.tabBorderColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      width: verticalScale(16),
      height: verticalScale(16),
    },
    arrowicon: {
      width: verticalScale(10),
      height: verticalScale(7),
    },
    headerTitle: {
      fontSize: fontScale(18),
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Bold,
      textAlign: 'center',
      fontWeight: '700'
    },
    headerDes: {
      fontSize: fontScale(14),
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
      fontWeight: '500',
      marginVertical: horizontalMarginScale(8),
    },
    inputContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: COLORS.borderGray,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalMarginScale(16),
      height: verticalScale(50),
      marginTop: verticalMarginScale(5),
    },
    errorContainer:{
      flex: 1,
      borderWidth: 1,
      borderColor: COLORS.borderRed,
      backgroundColor: COLORS.bgRed,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: horizontalMarginScale(16),
      height: verticalScale(50),
      marginTop: verticalMarginScale(5),
    },
    userInfoContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      // gap: horizontalMarginScale(12),
    },
    username: {
      textAlign: 'center',
      color: COLORS.black,
      fontFamily: fontFamily.ABCDiatype_Medium,
    },
    title: {
      fontSize: fontScale(24),
      fontFamily: fontFamily.RomieTrial_Bold,
      textAlign: 'left',
    },
    errorText: {
      fontSize: fontScale(12),
      marginTop: verticalMarginScale(5),
      color: COLORS.errorText,
    },
    recipientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
  })
}

export default AddAnnouncementStyles;