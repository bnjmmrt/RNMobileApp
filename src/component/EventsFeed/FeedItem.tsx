
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'react-native-animatable';
import { format } from 'date-fns';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { Wp, Hp } from '../../utils/dimensions';
import IMAGES from '../../assets/images';

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
                <Image source={item.image !== "" ? { uri: item.image } : IMAGES.eventCoverPlaceholders1} style={styles.icon} />
            </View>
            <View style={styles.contentContainer}>
                <Text numberOfLines={1} style={styles.titleStyle}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                    {
                        item.date === 'Invalid Date' 
                            ? item.date 
                            : format(
                                new Date(`${item.date.slice(6, 10)}-${item.date.slice(0, 2)}-${item.date.slice(3, 5)}`), 
                                'MMM d, p'
                            )
                    }
                </Text>
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
        fontFamily: fontFamily.ABCDiatype_Medium,
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