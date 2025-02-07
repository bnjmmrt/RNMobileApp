import React from 'react';
import { Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Hp, Wp } from '../../utils/dimensions';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { Image } from 'react-native-animatable';
import IMAGES from '../../assets/images';

interface MiddleStaticComponentProps {
    style?: ViewStyle; // Added style prop
    titleTextstyle?: TextStyle; // Added style prop
    subTitleTextstyle?: TextStyle; // Added style prop
}

const MiddleStaticComponent: React.FC<MiddleStaticComponentProps> = ({
    style,
    titleTextstyle,
    subTitleTextstyle
}) => {
    const listItem = [LABLE.REQUEST_REFERRAL_FROM_RUMOR, LABLE.INVITE_YOUR_FRIEND, BUTTON_LABLE.ENTER_REFERRAL_CODE]


    return (
        <View style={[styles.contentContainer, style]}>
            <Text style={[styles.title, titleTextstyle]}>{LABLE.FASTRACK_YOUR_APPLICATION}</Text>
            {
                listItem.map((item, index) => {
                    return (
                        <View key={index} style={styles.listContainer}>
                            <Image source={IMAGES.checkCircleFilled} style={styles.icon} />
                            <Text style={[styles.subtitle, subTitleTextstyle]}>{item}</Text>
                        </View>
                    );
                })
            }
        </View>
    );

};
//  paddingHorizontal: 20, marginTop: 20 
const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontFamily: fontFamily.RomieTrial_Bold,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 15
    },
    icon: {
        marginRight: 5
    },
    subtitle: {
        color: COLORS.light_text,
        fontSize: 13,
        flex: 1,
        alignSelf: 'center',
        fontFamily: fontFamily.ABCDiatype_Regular,
    },
    contentContainer: {
        flexDirection: 'column',
        width: Wp(80),
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.dark_gray,
        backgroundColor: COLORS.black2
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginStart: 10,
        marginBottom: 10
    }
});

export default MiddleStaticComponent;
