import React from 'react';
import { StyleSheet, Image, View, Text, StyleProp, TextStyle, ViewStyle, ImageStyle, ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { Hp, Wp } from '../../utils/dimensions';
import { Images } from '../../utils/Images';

interface CustomDropdownProps {
    title: string;
    titleTextStyle?: StyleProp<TextStyle>;
    options: string[] | { key: string; value: string }[];
    renderRow?: (option: string | { key: string; value: string }, index: string, isSelected: boolean) => React.ReactNode;
    onSelect: (index: string, value: string | { key: string; value: string }) => void;
    selectedValue?: string;
    modalDropStyle?: StyleProp<ViewStyle>;
    dropDonwViewStyle?: StyleProp<ViewStyle>;
    languageImage?: any; // Image source
    downArrowStyle?: StyleProp<ImageStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    title,
    titleTextStyle,
    options,
    renderRow,
    onSelect,
    selectedValue,
    modalDropStyle,
    dropDonwViewStyle,
    languageImage,
    downArrowStyle,
    selectedTextStyle,
    disabled = false,
}) => {
    return (
        <View style={defaultStyle.padding20}>
            <Text style={[defaultStyle.titleStyle, titleTextStyle]}>{title}</Text>
            <ModalDropdown
                saveScrollPosition={false}
                disabled={disabled}
                style={[defaultStyle.modalDropMainStyle, modalDropStyle]}
                showsVerticalScrollIndicator={true}
                options={options}
                renderRow={renderRow}
                onSelect={(index, value) => onSelect(index, value)}
                dropdownStyle={[defaultStyle.dropDownStyle, dropDonwViewStyle]}
                // renderScrollComponent={(props:any) => (
                //     <ScrollView {...props} showsVerticalScrollIndicator={true} />
                // )}
                >
                <View style={defaultStyle.textDownImgMainView}>
                    <View style={defaultStyle.justifyCenter}>
                        <Text allowFontScaling={false} style={[selectedTextStyle]}>
                            {selectedValue ? selectedValue : 'Select'}
                        </Text>
                    </View>
                    <View style={defaultStyle.justifyCenter}>
                        <Image source={languageImage || Images.downArrowImg} style={[downArrowStyle]} />
                    </View>
                </View>
            </ModalDropdown>
        </View>
    );
};

export default CustomDropdown;

const defaultStyle = StyleSheet.create({
    modalDropMainStyle: {
        height: Hp(6),
        width: Wp(75),
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EADECF',
        marginTop: Hp(1),
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    dropDownStyle: {
        width: Wp(80),
        overflow: 'hidden',
    },
    titleStyle: {
        fontSize: 13,
        color: '#000',
    },
    justifyCenter: {
        justifyContent: 'center',
    },
    textDownImgMainView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    padding20: {
        // paddingHorizontal: 20,
    },
});
