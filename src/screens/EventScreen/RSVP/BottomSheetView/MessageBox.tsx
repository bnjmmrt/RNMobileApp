import IMAGES from '@images/index';
import React, { useRef, forwardRef } from 'react';
import { View, StyleSheet, Text, Image, Platform, ViewStyle } from 'react-native';
import Button from 'src/component/Button';
import { BUTTON_LABLE, COLORS, EVENT_STATUS } from 'src/utils/constants';
import { fontScale, horizontalScale, Hp, radiusScale, verticalMarginScale, verticalScale, Wp } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface ConfirmationBottomSheetProps {
    // onPress: () => void;
    snapPoints?: any[];
    logo?: any;
    title: string;
    subTitle?: string;
    btnLabel: string;
    status?: string;
    btnStyle?: any;
    isSuccess?: boolean;
    back?: () => void;
    onClose?: () => void;
}
const MessageBox = (props: ConfirmationBottomSheetProps) => {
    return (
        <View style={styles.container}>
            {props.logo && (
                <View style={styles.logoContainer}>
                    <Image source={props.logo} style={styles.logo} />
                </View>
            )}
            {props.title && <Text style={styles.title}>{props.title}</Text>}
            {props.btnLabel == BUTTON_LABLE.CLOSE ? null : props.isSuccess ? (
                <View
                    style={[
                        styles.statusBanner,
                        {
                            backgroundColor: COLORS.bgGreen,
                            borderColor: COLORS.borderGreen,
                            width: Wp('35%'),
                        },
                    ]}>
                    <Image source={IMAGES.tickGoing} />
                    <Text style={styles.statusText}> {'You are going'}</Text>
                </View>
            ) : (
                <View style={styles.statusBanner}>
                    <Image source={IMAGES.tickDeclined} />
                    <Text style={styles.statusText}>
                        {' '}
                        {EVENT_STATUS.DECLINED_BY_YOU}
                    </Text>
                </View>
            )}
            {props.subTitle && (
                <Text style={[styles.subTitle]}>{props.subTitle}</Text>
            )}
            <Button
                disabled={false}
                style={props.btnStyle ? props.btnStyle : styles.btnStyle}
                title={props.btnLabel}
                colorTheme={props.btnStyle ? 'white' : 'dark'}
                onPress={props.onClose}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: verticalMarginScale(20),
        gap: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: horizontalScale(96),
        height: verticalScale(96),
        borderRadius: radiusScale(50),
        backgroundColor: COLORS.lighter_gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: horizontalScale(30),
        height: verticalScale(30),
    },
    btnStyle: {
        borderRadius: radiusScale(100),
    },
    title: {
        fontSize: fontScale(32),
        fontFamily: fontFamily.RomieTrial_Bold,
        textAlign: 'center',
    },
    subTitle: {
        color: COLORS.light_gray,
        fontSize: fontScale(14),
        fontFamily: fontFamily.ABCDiatype_Regular,
        marginVertical: Hp(1),
        textAlign: 'center',
    },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.bgRed,
        paddingVertical: verticalMarginScale(6),
        paddingHorizontal: verticalMarginScale(8),
        borderRadius: radiusScale(8),
        borderWidth: 1,
        borderColor: COLORS.borderRed,
        width: '70%',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: fontScale(14),
        color: COLORS.black,
        marginLeft: verticalScale(5),
        flex: 1,
    },
});
export default MessageBox;
