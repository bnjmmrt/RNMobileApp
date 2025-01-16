import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, ImageStyle, StyleProp } from 'react-native';
import { Hp, Wp } from '../utils/dimensions';
import IMAGES from '../assets/images';
import { COLORS } from '../utils/constants';
import AvatarInitials from './AvatarInitials';

interface HeaderComponentProps {
    rightImageStyle?: StyleProp<ImageStyle>;
    isDarkTheme: boolean
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ rightImageStyle, isDarkTheme }) => {
    const backgroundColor = isDarkTheme ? COLORS.black : COLORS.white;
    const tintColor = isDarkTheme ? COLORS.white : COLORS.black;
    const backgroundColorNotification = isDarkTheme ? COLORS.dark_gray : COLORS.tabBorderColor;


    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.logoContainer}>
                <Image
                    style={[styles.imgStyle, rightImageStyle]}
                    source={IMAGES.rumorLogoDark}
                    tintColor={tintColor}
                />
            </View>
            <View style={[styles.iconsWrapper]}>
                <TouchableOpacity style={[styles.iconButton, { backgroundColor: backgroundColorNotification }]}>
                    <Image
                        style={[styles.imgStyle, rightImageStyle]}
                        source={IMAGES.bell}
                        tintColor={tintColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileButton}>
                    <AvatarInitials name={"Bessie Cooper"} size={48} />

                    {/* <Image
                        style={[styles.imgStyle, rightImageStyle]}
                        source={IMAGES.imageText}
                    /> */}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Wp(100),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    logoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconsWrapper: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        marginHorizontal: 5,
        backgroundColor: COLORS.tabBorderColor,
    },
    profileButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 24,
        marginHorizontal: 5,
        backgroundColor: COLORS.tabBorderColor,
    },
    imgStyle: {
        resizeMode: 'contain',
    },
});

export default HeaderComponent;
