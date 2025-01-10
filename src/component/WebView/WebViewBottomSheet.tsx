import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
interface WebViewBottomSheetProps {
    url: string; // URL to be passed from the parent
    onChange?: (index: number) => void; // Callback function to be called when the bottom sheet changes
}

const WebViewBottomSheet = ({ url, onChange }: WebViewBottomSheetProps) => {
    const bottomSheetRef = useRef(null);

    return (

        <BottomSheetComponent
            ref={bottomSheetRef}
            snapPoints={['95%']} // Adjustable snap points
            onClose={() => console.log('Bottom sheet closed')}
            onChange={onChange}
            children={
                <WebView
                    source={{ uri: url }}
                    style={styles.webView}
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    webView: {
        flex: 1,
        height : Hp(100),
        backgroundColor: COLORS.black,
    },
});

export default WebViewBottomSheet;
