import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../assets/images';
import { COLORS } from '../utils/constants';
import { fontFamily } from '../utils/functions';

interface SearchInputProps {
    handleChange: (text: string) => void,
    
}

const SearchInput:React.FC<SearchInputProps> = ({ handleChange }) => {
    const [searchText, setSearchText] = useState('');

    const handleTextChange = (text: string) => {
        setSearchText(text);
        handleChange(text); // Call the parent handler with the new text
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputWrapper]}>
                <Image source={IMAGES.search} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search for an event.."
                    value={searchText}
                    onChangeText={handleTextChange}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        flex: 1,
        borderColor: COLORS.borderGray,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.black,
        fontFamily: fontFamily.ABCDiatype_Regular,
    },
});

export default SearchInput;

