import { Platform, StyleSheet, } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import WebView from 'react-native-webview';

const LandingStyles = () => {

    return StyleSheet.create({

        buttonWrapper: {
            bottom: 30, position: 'absolute'
        },
        webViewStyle:{
            flex: 1,
            backgroundColor: COLORS.white,
            width: '100%',
            height: '100%',
        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:COLORS.black
        },
        contentContainer:{
            flex: 1,
            paddingHorizontal: 10,
        },
        overlayContainer: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.transperantBackground, // Semi-transparent overlay
        },
        btnStyle: {
            width: Wp(85),
            borderRadius: 100,
        },
        logoImgStyle:{
            width: Wp(20),
            height : Hp(20),
            resizeMode: 'contain',  
        }
    });
};  

export default LandingStyles;
