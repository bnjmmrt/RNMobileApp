import React, { useRef, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Hp, Wp } from '../../utils/dimensions';
import { COLORS } from '../../utils/constants';

interface BottomSheetComponentProps {
    children: React.ReactNode;
    snapPoints?: string[]; // Allows customizable snap points
    onChange?: (index: number) => void;
    onClose?: () => void;
    ref:any;
    backgroundColor?:string
    indicatorColor?:string
}

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
    children,
    snapPoints = ['40%'], // Default snap point
    onChange,
    onClose,
    backgroundColor="black" ,
    indicatorColor="white"
}) => {
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

    return (
        <>
            {/* <View style={styles.bottomSheetBlurView} /> */}
            <BottomSheet
                ref={sheetRef}
                // index={-1}
                snapPoints={snapPointsMemo}
                enableDynamicSizing={false}
                enableContentPanningGesture={false}
                enablePanDownToClose
                handleIndicatorStyle={[styles.indicatorStyle, {
                    backgroundColor: indicatorColor
                }]}
                onClose={handleClosePress}
                onChange={handleSheetChange}
                backgroundStyle={{ backgroundColor: backgroundColor }}
            >
                <BottomSheetScrollView nestedScrollEnabled>{children}</BottomSheetScrollView>
            </BottomSheet>
        </>
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
