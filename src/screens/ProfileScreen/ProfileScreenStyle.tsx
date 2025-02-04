import { Platform, StyleSheet, } from 'react-native';
import { Wp, Hp, fontScale, radiusScale, verticalMarginScale, horizontalMarginScale } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';

const ProfileScreenStyle = () => {

    return StyleSheet.create({
     
        container: {
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'center',
            backgroundColor: COLORS.white
        },
        contentContainer: {
            flex: 1,
        },
        btnStyle: {
            width: Wp(85),
            borderRadius:radiusScale(100),
        },
        logoContainer: {
            alignItems: 'center', marginVertical:verticalMarginScale(10)
        },
        logoImgStyle: {
            width:horizontalMarginScale(100),
            height:verticalMarginScale(50),
            resizeMode: 'center',
        },
        textBelowStyle: {
            color: COLORS.light_gray,
            fontSize:fontScale(14),
            textAlign:'center',
            fontFamily: fontFamily.ABCDiatype_Regular,
            marginBottom: verticalMarginScale(100)
        },
    });
};

export default ProfileScreenStyle;
