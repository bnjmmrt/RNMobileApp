import React, { forwardRef, useCallback, useRef } from 'react';
import { StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import BottomSheetComponent, {
  BottomSheetMethods,
} from '../BottomSheet/BottomSheet';
import { Hp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

interface WebViewBottomSheetProps {
  url: string;
  isFromLanding?: boolean;
}

const WebViewBottomSheet = forwardRef<
  BottomSheetMethods,
  WebViewBottomSheetProps
>((props, ref) => {
  // const bottomSheetRef = useRef(null);
  const onClose = () => {

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
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['90%']} // Adjustable snap points
      backgroundColor={COLORS.webBlack}
      onClose={() => onClose()}>
      <WebView
        source={{ uri: props.url }}
        style={styles.webView}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP error: ', nativeEvent);
        }}
        onLoadProgress={({ nativeEvent }) =>
          console.log('WebView load progress:', nativeEvent.progress)
        }
      />
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.webBlack,
  },
});

export default WebViewBottomSheet;
