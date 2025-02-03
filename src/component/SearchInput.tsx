import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../assets/images';
import { COLORS } from '../utils/constants';
import { fontFamily } from '../utils/functions';

// Define the props for SearchInput
interface SearchInputProps extends TextInputProps {
    onSearchTextChange?: (text: string) => void;
    placeholder?: string
}

const SearchInput = forwardRef(({ onSearchTextChange, placeholder }: SearchInputProps, ref) => {
    const [searchText, setSearchText] = useState('');

    // Expose handleNextPress to the parent
    useImperativeHandle(ref, () => ({
        handleNextPress,
    }));

    // Handle the "Next" button press
    const handleNextPress = () => {
        // Placeholder for any actions
    };

    const handleTextChange = (text: string) => {
        setSearchText(text);
        if (onSearchTextChange) {
            onSearchTextChange(text); // Notify parent component
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.inputWrapper]}>
                <Image source={IMAGES.search} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder ? placeholder : "Search for an event.."}
                    value={searchText}
                    onChangeText={handleTextChange}
                />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
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

