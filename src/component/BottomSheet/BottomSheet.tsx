import React, { useRef, useCallback, useMemo, forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import BottomSheet, { BottomSheetFooter, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Hp, Wp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';

interface BottomSheetComponentProps {
    children: React.ReactNode;
    snapPoints?: string[]; // Allows customizable snap points
    onChange?: (index: number) => void;
    onClose?: () => void;
    ref: any;
    backColor?: string;
    footer?:any;
}

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
    children,
    snapPoints = ['40%'], // Default snap point
    onChange,
    onClose,
    footer
}, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const sheetRef = useRef<BottomSheet>(null);
    const handleSheetChange = useCallback(
        (index: number) => {
            onChange?.(index);
        },
        [onChange]
    );

    const handleClosePress = useCallback(() => {
        sheetRef.current?.close();
        onClose?.();
    }, [onClose]);

    const snapPointsMemo = useMemo(() => snapPoints, [snapPoints]);
    const renderFooter = useCallback(
        (props) => (
            <BottomSheetFooter {...props} bottomInset={24}>
                {typeof footer === 'function' ? footer() : footer}
            </BottomSheetFooter>
        ),
        [footer]
    );

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="fade"
            onRequestClose={handleClosePress}
        >
            <View style={styles.modalContainer}>
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={snapPointsMemo}
                    footerComponent={renderFooter}
                    enableDynamicSizing={false}
                    enableContentPanningGesture={false}
                    enablePanDownToClose
                    handleIndicatorStyle={[styles.indicatorStyle, {
                        backgroundColor: COLORS.tabBorderColor
                    }]}
                    onClose={handleClosePress}
                    onChange={handleSheetChange}
                    backgroundStyle={{ backgroundColor: COLORS.white }}
                >
                    <BottomSheetScrollView nestedScrollEnabled>{children}</BottomSheetScrollView>
                </BottomSheet>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    indicatorStyle: {
        width: Wp(13),
        height: 5,
        borderRadius: 10,
    },
    bottomSheetBlurView: {
        height: Hp(100),
        width: Wp(100),
        backgroundColor: '#00000060',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0
    },
});

export default BottomSheetComponent;
