import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../assets/images';
import { COLORS, LABLE } from '../utils/constants';
import { fontFamily } from '../utils/functions';

const SearchInput = forwardRef((_, ref) => {
    const [searchText, setsearchText] = useState('');

    // Expose handleNextPress to the parent
    useImperativeHandle(ref, () => ({
        handleNextPress,
    }));

 

    // Handle the "Next" button press
    const handleNextPress = () => {
    
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputWrapper]}>
                <Image source={IMAGES.search} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search for an event.."
                    keyboardType="email-address"
                    value={searchText}
                    onChangeText={(text) => {
                        setsearchText(text);
                    }}
                />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal:20,
        backgroundColor:COLORS.white
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        flex:1,
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

export default SearchInput;
