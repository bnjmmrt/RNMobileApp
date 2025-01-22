import React, { forwardRef, useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
interface WebViewBottomSheetProps {
    url: string; // URL to be passed from the parent
    onChange?: (index: number) => void; // Callback function to be called when the bottom sheet changes
}

// const WebViewBottomSheet = ({ url, onChange }: WebViewBottomSheetProps) => {
const WebViewBottomSheet = forwardRef((props, ref) => {

    // const bottomSheetRef = useRef(null);
    console.log("url", props.url)

    return (

        <BottomSheetComponent
            ref={ref}
            snapPoints={['95%']} // Adjustable snap points
            onClose={() => console.log('Bottom sheet closed')}
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
        backgroundColor: COLORS.black,
    },
});

export default WebViewBottomSheet;
