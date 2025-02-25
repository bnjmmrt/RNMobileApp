import React, { forwardRef, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

const WebViewBottomSheet = forwardRef((props, ref) => {

    // const bottomSheetRef = useRef(null);
    const onClose = () => {
        console.log("onclose", props.isFromLanding)

        if (props.isFromLanding) {
            changeSafeAreaViewConfig({
                ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
                showTopSafeAreaView: false,
                topSafeAreaViewColor: 'transparent',
                translucent: true,
                showBottomSafeAreaView: false,
                bottomSafeAreaViewColor: 'transparent',
            });
        }

    }

    console.log("url", props.url)

    return (

        <BottomSheetComponent
            ref={ref}
            snapPoints={['90%']} // Adjustable snap points
            backgroundColor={COLORS.webBlack}
            onClose={() => onClose()}
        >
            <WebView
                source={{ uri: props.url }}
                style={styles.webView}
            />
        </BottomSheetComponent>
    );
});

const styles = StyleSheet.create({
    webView: {
        flex: 1,
        height: Hp(100),
        backgroundColor: COLORS.webBlack,
    },
});

export default WebViewBottomSheet;
