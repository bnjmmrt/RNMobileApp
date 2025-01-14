import { Platform, StyleSheet, } from 'react-native';
import { Wp, Hp } from '../../../utils/dimensions';
import { fontFamily } from '../../../utils/functions';
import { COLORS } from '../../../utils/constants';

const EnterEmailStyles = () => {

    return  StyleSheet.create({
        container: {
            flex:1,
            backgroundColor: COLORS.white,
            
        },
    
        btnStyle:{
            width: Wp(85),
            borderRadius: 100,
            // justifyContent:"flex-end"
        },
        
        contentContainer: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 20,
       
        },
        title: {
            color: COLORS.black,
            fontSize: 32,
            fontFamily:fontFamily.RomieTrial_Bold,
        },
        subtitle: {
            color: COLORS.light_gray,
            fontSize: 13,
            fontFamily:fontFamily.ABCDiatype_Regular,
            marginVertical: Hp(2),
        },
        spacer: {
            flex: 1,
        },
    });
    
};

export default EnterEmailStyles;
