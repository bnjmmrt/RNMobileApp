import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS } from 'src/utils/constants';
import {
    fontScale,
    horizontalScale,
    radiusScale,
    verticalScale,
} from 'src/utils/dimensions';
import { fontFamily, getRoleRole } from 'src/utils/functions';
import IMAGES from '@images/index';
import { addListener } from 'react-native-screenshot-prevent';
import FastImage from '@d11/react-native-fast-image';
import { BlurView } from '@react-native-community/blur';
import { environment } from 'environments/environment';
import { environment as environmentProd } from 'environments/environment.prod';
import store from 'src/redux/store';
import { setNotificationAlert } from 'src/redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

const NotificationDialog: React.FC = () => {
    const dispatch = useDispatch();
    const role = useSelector((state: RootState) => state.auth.role);
    const notificationAlert = useSelector((state: RootState) => state.auth.notificationAlert);
    const handleNotificationAlert = () => {
        dispatch(setNotificationAlert(false));
    };
    if (!notificationAlert) {
        return null
    }
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={() => handleNotificationAlert()}>
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={10}
            />
            <View style={styles.content}>
                <FastImage
                    source={IMAGES.rumorLogo}
                    style={styles.rumorLogo}
                    tintColor={COLORS.black}
                />
                <View style={styles.logoContainer}>
                    <Image
                        source={IMAGES.alert_triangle_filled}
                        style={styles.screenshotblocked}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.description}>
                    You are not authorized to view this notification because you are logged in a {getRoleRole(role)}. If you would like to view this notification, please switch your profile.
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        paddingHorizontal: horizontalScale(16),
    },
    rumorLogo: {
        height: verticalScale(25),
        width: verticalScale(130),
        zIndex: 1000000,
        marginBottom: verticalScale(40),
    },
    content: {
        paddingHorizontal: horizontalScale(24),
        paddingBottom: verticalScale(82),
        paddingTop: verticalScale(82),
        alignItems: 'center',
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: radiusScale(32),
    },
    closeButton: {
        position: 'absolute',
        top: verticalScale(24),
        right: verticalScale(24),
        padding: verticalScale(8),
        zIndex: 1,
    },
    closeIcon: {
        width: verticalScale(20),
        height: verticalScale(20),
        tintColor: COLORS.black,
    },
    logoContainer: {
        width: verticalScale(128),
        height: verticalScale(128),
        backgroundColor: COLORS.bgRed,
        borderRadius: verticalScale(300),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    screenshotblocked: {
        width: verticalScale(52),
        height: verticalScale(52),
    },
    title: {
        fontFamily: fontFamily.RomieTrial_Bold,
        fontSize: fontScale(18),
        color: COLORS.black,
        marginBottom: verticalScale(0),
        textAlign: 'center',
    },
    description: {
        fontFamily: fontFamily.ABCDiatype_Regular,
        fontSize: fontScale(18),
        color: COLORS.light_gray,
        textAlign: 'center',
        lineHeight: verticalScale(20),
    },
});

export default NotificationDialog;
