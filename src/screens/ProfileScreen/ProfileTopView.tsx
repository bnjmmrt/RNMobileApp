import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../../assets/images';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Wp, Hp } from '../../utils/dimensions';
import ButtonSmall from '../../component/ButtonSmall';

interface ProfileTopViewProps {
    item: {
        id: string;
        title: string;
        date: string;
        type: string;
        location: string;
        image: string;
    };
}
const ProfileTopView: React.FC<ProfileTopViewProps> = ({ item }) => {


    // Handle the "Next" button press
    const handlEventPress = () => {

    };

    return (
        <View style={styles.container}>
            <View style={[styles.imageContainer]}>
                <Image source={IMAGES.rumorLogoDark} style={styles.icon} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.titleStyle}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.date}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    btnStyle: {
        borderRadius: 100,
        paddingHorizontal: 10,
        marginTop: 20,
        paddingVertical: 7
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        flex: 1,
        width: Wp(90),
        // height: Hp(25),
        backgroundColor: COLORS.white,
        borderColor: COLORS.borderGray,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: 'center',
        // height: 100,
    },
    contentContainer: {
        flexDirection: 'column',
        padding: 10,
        flex: 1,
        backgroundColor: COLORS.white,
    },
    errorInputWrapper: {
        borderColor: COLORS.borderRed,
        backgroundColor: COLORS.bgRed,
    },
    icon: {
        // marginRight: 10,
        height: Hp(20),
        width: Wp(30),
    },
    titleStyle: {
        fontSize: 22,
        fontFamily: fontFamily.RomieTrial_Bold,
        marginBottom: 5
    },
    subtitle: {
        color: COLORS.light_gray,
        fontSize: 12,
        fontFamily: fontFamily.ABCDiatype_Regular,
        marginTop: 1,
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
        color: COLORS.errorText,
    },
});

export default ProfileTopView;
