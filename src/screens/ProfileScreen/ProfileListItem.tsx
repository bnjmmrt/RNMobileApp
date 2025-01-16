import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../../assets/images';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';

interface ListItemProps {
    item: {
        id: string;
        title: string;
        image: string
    };
}


const ProfileListItem: React.FC<ListItemProps> = ({ item }) => {

    // Handle the "Next" button press
    const handleNextPress = () => {

    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.inputWrapper]}>
                <Image source={item.image} style={styles.icon} />
                <Text style={[styles.input, {color: item.image ? COLORS.black : COLORS.errorText }]}>{item.title}</Text>
                {item.image && <Image source={IMAGES.arrowRight} />}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
        marginBottom: 5
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        borderWidth: 1,
        flex: 1,
        borderColor: COLORS.borderGray,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
    },
    errorInputWrapper: {
        borderColor: COLORS.borderRed,
        backgroundColor: COLORS.bgRed,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.black,
        fontFamily: fontFamily.ABCDiatype_Regular
    },
    errorText: {
        fontSize: 12,
        marginTop: 5,
        color: COLORS.errorText,
    },
});

export default ProfileListItem;
