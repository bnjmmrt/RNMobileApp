import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-animatable';
import IMAGES from '../../../assets/images';
import { COLORS, PROFILE } from '../../../utils/constants';
import { fontFamily } from '../../../utils/functions';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../../navigation/Route';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';

interface AccountItemProps {
    item: {
        id: string;
        title: string;
        image: string;
    };
    setItem:(item:any)=>void
}


const AccountItem: React.FC<AccountItemProps> = ({ item ,setItem}) => {


    const handleItemClick = (item: any) => {
          setItem(item)
      };
      

     
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.inputWrapper]} onPress= {()=>handleItemClick(item)}>
                <Image source={item.image} style={styles.icon} />
                <Text style={[styles.input, {color: item.image ? COLORS.black : COLORS.errorText }]}>{item.title}</Text>
                {item.image && <Image source={IMAGES.arrowRight} />}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal:horizontalMarginScale(10),
        backgroundColor: COLORS.white,
        marginBottom:verticalMarginScale(5)
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height:verticalScale(55),
        borderWidth:verticalScale(1),
        flex: 1,
        borderColor: COLORS.borderGray,
        borderRadius:radiusScale(10),
        backgroundColor: COLORS.white,
        paddingHorizontal:horizontalMarginScale(20),
    },
    errorInputWrapper: {
        borderColor: COLORS.borderRed,
        backgroundColor: COLORS.bgRed,
    },
    icon: {
        marginRight:horizontalMarginScale(10),
        width:horizontalMarginScale(20),
        height:verticalMarginScale(20)
    },
    input: {
        flex: 1,
        fontSize:fontScale(14),
        color: COLORS.black,
        fontFamily: fontFamily.ABCDiatype_Regular
    },
    errorText: {
        fontSize:fontScale(12),
        marginTop:verticalScale(5),
        color: COLORS.errorText,
    },
});

export default AccountItem;
