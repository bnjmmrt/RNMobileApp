import { Platform, StyleSheet, } from 'react-native';
import { Wp, Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import { fontFamily } from '../../utils/functions';
import { TOP_SAFEAREA_SPACING } from 'src/component/Wrappers/SafeAreaViewWrapper';

const ChatScreenStyle = () => {

    return StyleSheet.create({

        container: {
            flex: 1,
            alignItems: 'center',
            paddingTop: TOP_SAFEAREA_SPACING,
            // justifyContent: 'center',
            backgroundColor: COLORS.black2
        },
        contentContainer: {
            flex: 1,
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
            textAlign: 'center',
            fontFamily: fontFamily.ABCDiatype_Regular,
            marginVertical: Hp(1),
        },
    });
};

export default ChatScreenStyle;
