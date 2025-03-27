import { StyleSheet } from "react-native"
import { COLORS } from "src/utils/constants"
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, screenHeight, verticalMarginScale, verticalScale } from "src/utils/dimensions"
import { fontFamily } from "src/utils/functions"

const AnnouncementStyles = () => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.white,
            // paddingBottom: 20
        },
        mediaImage: {
            width: horizontalScale(95),
            height: verticalScale(128),
            borderRadius: 8,
            marginRight: 10,
            backgroundColor: '#f0f0f0',
        },
        pdfIcon: {
            width: 30,
            height: 30,
            marginBottom: 10,
        },
        pdfContainer: {
            width: horizontalScale(95),
            height: verticalScale(128),
            marginRight: 10,
            backgroundColor: "#f0f0f0",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
        },
        pdfSize: {
            fontSize: 12,
            color: "gray",
        },
        talentItem: {
            flexDirection: 'row',
            marginVertical: verticalMarginScale(10),
        },
        textContainer: {
            flex: 1,
            marginStart: 10,
            gap: 5
        },
        name: {
            color: COLORS.black2,
            fontSize: fontScale(16),
            flex: 1,
            fontWeight: '400',
            fontFamily: fontFamily.ABCDiatype_Medium,
            marginVertical: verticalMarginScale(10)
        },
        toggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: verticalMarginScale(5)
        },
        toggleText: {
            color: COLORS.black2,
            textDecorationLine: 'underline',
            fontFamily: fontFamily.ABCDiatype_Regular,
            marginRight: 5,
        },
        toggleIcon: {
            width: 8,
            height: 8,
            tintColor: COLORS.borderGray,
        },
        subtitle: {
            color: COLORS.black,
            fontSize: fontScale(12),
            fontFamily: fontFamily.ABCDiatype_Regular,
            marginTop: 5,
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
            marginVertical: verticalMarginScale(1),
            paddingHorizontal: horizontalMarginScale(15),
            paddingVertical: horizontalMarginScale(10),
            borderWidth: 1,
            borderColor: COLORS.borderGray,
            borderRadius: radiusScale(16),
        },
        lineView: {
            width: screenHeight,
            alignSelf: 'center',
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
            fontSize: fontScale(12),
            color: COLORS.black,
            fontWeight: '500',
            lineHeight: 14,
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
            width: verticalScale(32),
            height: verticalScale(32),
            borderRadius: radiusScale(24),
            backgroundColor: COLORS.tabBorderColor,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            left: 10,
            right: 10,
        },
        recipintWrapper: {
            width: verticalScale(40),
            height: verticalScale(40),
            borderRadius: radiusScale(24),
            backgroundColor: COLORS.tabBorderColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        receipientImg: { borderRadius: 20, borderWidth: 3, borderColor: COLORS.white },
        attachWrapper: {
            width: verticalScale(96),
            height: verticalScale(96),
            borderRadius: radiusScale(8),
            marginVertical: verticalMarginScale(5),
            backgroundColor: COLORS.lighter_gray,
            justifyContent: 'center',
            alignItems: 'center',
        },
        attachImgWrapper: {
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
            borderWidth: 1,
            borderColor: COLORS.tabBorderColor,
            backgroundColor: COLORS.tabBorderColor,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            width: verticalScale(16),
            height: verticalScale(16),
            tintColor: COLORS.black
        },
        headerTitle: {
            fontSize: fontScale(18),
            color: COLORS.black,
            fontFamily: fontFamily.ABCDiatype_Regular,
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
            color: COLORS.black2,
            fontSize: fontScale(12),
            textAlign: 'center',
            fontFamily: fontFamily.ABCDiatype_Medium,
        },
        recipientHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
    })
}

export default AnnouncementStyles;