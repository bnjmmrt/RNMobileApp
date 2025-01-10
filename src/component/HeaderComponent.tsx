import React from 'react';
import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageSourcePropType, Image, Platform, ImageStyle, View } from 'react-native';
import { Hp, Wp } from '../utils/dimensions';
import UserAvatar from 'react-native-user-avatar';
import { Images } from '../utils/Images';

interface HeaderComponentProps {
    title: string;
    rightImageSource?: ImageSourcePropType; // Optional image source
    rightImageStyle?: StyleProp<ImageStyle>;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    title,
    rightImageSource,
    rightImageStyle
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.rowCenterStyle}>
                <UserAvatar size={45} name={title} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.helloTextStyle}>Hello,</Text>
                    <Text style={styles.nameTextStyle}>{title}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.iconsContainer}>
                <Image style={[styles.notiImg, rightImageStyle]} source={Images.notificationImg}></Image>
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
        justifyContent: 'space-between',
        backgroundColor: '#F9F4EC',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    helloTextStyle: {
        color: '#1B1C34',
        fontWeight: '700',
        fontSize: 15
    },
    nameTextStyle: {
        color: '#1B1C34',
        fontWeight: '700',
        fontSize: 18
    },
    iconsContainer: {
        width: '15%',
        alignItems: 'center'
    },
    notiImg: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    rowCenterStyle:{
        flexDirection: 'row', 
        alignItems: 'center'
    }
});

export default HeaderComponent;
