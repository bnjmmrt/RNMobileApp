
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'react-native-animatable';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { Wp, Hp } from '../../utils/dimensions';

interface FeedItemProps {
    item: {
        id: string;
        title: string;
        date: string;
        type: string;
        location: string;
        image: string;
    };
    isFeatured?: boolean
}
const FeedItem: React.FC<FeedItemProps> = ({ item, isFeatured }) => {


    // Handle the "Next" button press
    const handlEventPress = () => {

    };

    return (
        <View style={styles.container} onTouchEnd={() => console.log("~~~~~touched~~~~")}>
            <View style={[styles.imageContainer]}>
                <Image source={item.image} style={styles.icon} />
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.titleStyle}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.date.split("–")[0]}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        padding: 10,
        paddingHorizontal: 11,
        width: Wp(48),
        // height: Hp(25),
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center'
        // height: 100,
    },
    contentContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    icon: {
        // marginRight: 10,
        height: Hp(33),
        width: Wp(41),
        borderRadius: 10
    },
    titleStyle: {
        fontSize: 18,
        fontFamily: fontFamily.RomieTrial_Bold,
        color: COLORS.black,
    },
    subtitle: {
        color: COLORS.light_gray,
        fontSize: 12,
        fontFamily: fontFamily.ABCDiatype_Regular,
        marginTop: 1,
    }
});

export default FeedItem;