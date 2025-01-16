import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, Image, ImageStyle, View } from 'react-native';
import { Hp, Wp } from '../utils/dimensions';
import IMAGES from '../assets/images';
import { COLORS } from '../utils/constants';

interface HeaderComponentProps {
    rightImageStyle?: StyleProp<ImageStyle>;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    rightImageStyle
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.rowCenterStyle}>
                <Image style={[styles.imgStyle, rightImageStyle]} source={IMAGES.rumorLogoDark}></Image>
            </View>

            <TouchableOpacity style={styles.iconsContainer}>
                <Image style={[styles.imgStyle, rightImageStyle]} source={IMAGES.bell}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconsContainerProfile}>
                <Image style={[styles.imgStyle, rightImageStyle]} source={IMAGES.imageText}></Image>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Wp(100),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    iconsContainer: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginHorizontal: 5,
        backgroundColor: COLORS.tabBorderColor
    },
    iconsContainerProfile: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        marginHorizontal: 5,
        backgroundColor: COLORS.tabBorderColor
    },
    imgStyle: {
        resizeMode: 'contain'
    },
    rowCenterStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    }
});

export default HeaderComponent;
