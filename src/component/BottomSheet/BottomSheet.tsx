import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BlurView } from '@react-native-community/blur';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  ColorValue,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { useDispatch } from 'react-redux';
import { changeTopSafeAreaViewColor } from 'src/redux/slices/safeAreaViewConfigSlice';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { COLORS } from '../../utils/constants';
import { Wp } from '../../utils/dimensions';
import {
  getFlashMessageBackgroundColor,
  MessageType,
} from '../FlashMessageComponent/FlashMessageComponent';

interface BottomSheetComponentProps {
  children: React.ReactNode;
  snapPoints?: string[]; // Allows customizable snap points
  onChange?: (index: number) => void;
  onClose?: () => void;
  ref: any;
  backColor?: string;
  footer?: any;
  backgroundColor?: string;
  enableDynamicSizing?: boolean;
  activeSafeAreaViewColor?: ColorValue;
  inActiveSafeAreaViewColor?: ColorValue;
}

export type BottomSheetMethods = {
  open: () => void;
  close: () => void;
  showFlashMessage: (type: MessageType, message: string) => void;
};

const BottomSheetComponent = forwardRef<
  BottomSheetMethods,
  BottomSheetComponentProps
>(
  (
    {
      children,
      snapPoints = ['40%'], // Default snap point
      onChange,
      onClose,
      footer,
      backgroundColor,
      enableDynamicSizing = false,
      activeSafeAreaViewColor = '#595959',
      inActiveSafeAreaViewColor = SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME
        .topSafeAreaViewColor,
    },
    ref,
  ) => {
    const flashMessageRef = useRef<FlashMessage | null>(null);
    const sheetRef = useRef<BottomSheetModal>(null);
    const dispatch = useDispatch();

    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => {
        sheetRef.current?.present();
      },
      close: () => {
        sheetRef.current?.dismiss();
      },
      showFlashMessage: showFlashMessage,
    }));

    const showFlashMessage = (type: MessageType, message: string) => {
      flashMessageRef?.current?.showMessage({
        message,
        type: 'default',
        backgroundColor: getFlashMessageBackgroundColor(type),
        color: '#fff',
      });
    };

    const handleSheetAnimationChange = useCallback((index: number) => {
      if (index === -1) {
        dispatch(changeTopSafeAreaViewColor(activeSafeAreaViewColor));
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor(activeSafeAreaViewColor, true);
        }
        StatusBar.setBarStyle('light-content', true);
      } else {
        dispatch(changeTopSafeAreaViewColor(inActiveSafeAreaViewColor));
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor(inActiveSafeAreaViewColor, true);
        }
        StatusBar.setBarStyle(
          SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME.statusBarStyle,
          true,
        );
      }

      setIsSheetOpen(index === -1);
    }, []);

    const handleSheetChange = useCallback(
      (index: number) => {
        onChange?.(index);
      },
      [onChange],
    );

    const handleClosePress = useCallback(() => {
      sheetRef.current?.dismiss();
      onClose?.();
    }, [onClose]);

    const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);
    const renderFooter = useCallback(
      (props: any) => (
        <BottomSheetFooter {...props} bottomInset={24}>
          {typeof footer === 'function' ? footer() : footer}
        </BottomSheetFooter>
      ),
      [footer],
    );

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isSheetOpen) {
            handleClosePress();
            return true;
          }
          return false;
        },
      );

      return () => backHandler.remove();
    }, [isSheetOpen]);

    return (
      <BottomSheetModal
        index={0}
        ref={sheetRef}
        snapPoints={snapPointsMemo}
        footerComponent={renderFooter}
        enableDynamicSizing={enableDynamicSizing}
        enableContentPanningGesture={false}
        enablePanDownToClose={true}
        backdropComponent={(props: BottomSheetBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={1}
            enableTouchThrough
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'transparent' },
            ]}
            children={
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={5}
              />
            }
          />
        )}
        handleIndicatorStyle={[
          styles.indicatorStyle,
          {
            backgroundColor: COLORS.tabBorderColor,
          },
        ]}
        onDismiss={handleClosePress}
        onChange={handleSheetChange}
        backgroundStyle={{
          backgroundColor: backgroundColor ? backgroundColor : COLORS.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'fillParent'}
        android_keyboardInputMode="adjustResize"
        keyboardBlurBehavior="restore"
        enableDismissOnClose={true}
        onAnimate={handleSheetAnimationChange}>
        {children}
        <FlashMessage ref={flashMessageRef} position={'top'} />
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    // justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Dimmed background
    opacity: 1,
  },
  indicatorStyle: {
    width: Wp(13),
    height: 5,
    borderRadius: 10,
  },
});

export default BottomSheetComponent;
