import BottomSheet, {BottomSheetFooter} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {Hp, Wp} from '../../utils/dimensions';
import {COLORS} from '../../utils/constants';
import FlashMessage from 'react-native-flash-message';
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
    },
    ref,
  ) => {
    const flashMessageRef = useRef<FlashMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const sheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsVisible(true);
      },
      close: () => {
        sheetRef.current?.close();
        setIsVisible(false);
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

    const handleSheetChange = useCallback(
      (index: number) => {
        onChange?.(index);
      },
      [onChange],
    );

    const handleClosePress = useCallback(() => {
      setIsVisible(false);
      onClose?.();
    }, [onClose]);

    const closeSheet = () => {
      sheetRef.current?.close();
    };

    const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);
    const renderFooter = useCallback(
      (props: any) => (
        <BottomSheetFooter {...props} bottomInset={24}>
          {typeof footer === 'function' ? footer() : footer}
        </BottomSheetFooter>
      ),
      [footer],
    );

    return (
      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={handleClosePress}>
        <Pressable style={styles.modalContainer} onPress={closeSheet}>
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPointsMemo}
            footerComponent={renderFooter}
            enableDynamicSizing={enableDynamicSizing}
            enableContentPanningGesture={false}
            enablePanDownToClose={true}
            handleIndicatorStyle={[
              styles.indicatorStyle,
              {
                backgroundColor: COLORS.tabBorderColor,
              },
            ]}
            onClose={handleClosePress}
            onChange={handleSheetChange}
            backgroundStyle={{
              backgroundColor: backgroundColor ? backgroundColor : COLORS.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
            keyboardBehavior="interactive"
            keyboardBlurBehavior="restore">
            {children}
          </BottomSheet>
        </Pressable>
        <FlashMessage ref={flashMessageRef} position={'top'} />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Dimmed background
  },
  indicatorStyle: {
    width: Wp(13),
    height: 5,
    borderRadius: 10,
  },
});

export default BottomSheetComponent;
