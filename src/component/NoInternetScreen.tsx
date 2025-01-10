import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Wp, Hp } from '../utils/dimensions';
import IMAGES from '../assets/images/index';
import Button from './Button';

const NoInternetScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Image source={IMAGES.downTime} style={styles.imageStyle} />
            <View style={styles.btnView}>
                <Button
                    disabled={false}
                    style={styles.btnStyle} 
                    title='Report an issue'
                    textStyle={styles.btnTextStyle}
                    imageSource={IMAGES.plus}
                    leftImageStyle={styles.leftImgStyle}
                    onPress={() => console.log("ngf")}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F4EC',
    },
    imageStyle: {
        width: Wp(80),
        height: Hp(25),
        resizeMode: 'contain'
    },
    btnStyle: {
        width: Wp(50),
        borderRadius: 100,
        marginTop: Hp(5),
    },
    btnTextStyle: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500'
    },
    leftImgStyle: {
        tintColor: '#fff'
    },
    btnView: {
        position: 'absolute',
        bottom: Hp(5)
    }
});

export default NoInternetScreen;
