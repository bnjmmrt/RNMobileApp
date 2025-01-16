import { Platform, StyleSheet, } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';

const EventScreenStyle = () => {

    return StyleSheet.create({
     
        container: {
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center',
            backgroundColor: COLORS.black
        },
        contentContainer: {
            flex: 1,
            flexDirection:'column',
        },
        btnStyle: {
            width: Wp(85),
            borderRadius: 100,
        },
        logoContainer: {
            alignItems: 'center', marginTop: 10, marginBottom: 10
        },
        logoImgStyle: {
            width: 100,
            height: 50,
            resizeMode: 'center',
        },
        textBelowStyle: {
            color: COLORS.light_gray,
            fontSize: 12,
            textAlign:'center',
            fontFamily: fontFamily.ABCDiatype_Regular,
            marginVertical: Hp(1),
        },
    });
};

export default EventScreenStyle;
