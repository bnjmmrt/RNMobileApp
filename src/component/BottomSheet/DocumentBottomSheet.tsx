import React, { useRef, forwardRef, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { COLORS } from '../../utils/constants';
import Button from '../Button';
import { fontFamily } from '../../utils/functions';
import { EndPoint } from '../../ApiManager/config';
import useApi from '../../axios/useApi';
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';

interface DocumentBottomSheetProps {
    onFileClick: () => void;
    onPhotoClick: () => void;
    title?: string;
    photoButtonText: string;
    fileButtonText: string;
    snapPoints: any;
    image: any | null;
}
const DocumentBottomSheet = forwardRef(
    (props: DocumentBottomSheetProps, ref) => {
        const inputRef = useRef(null);
        // const [image, setImage] = useState<string>(image);

        return (
            <BottomSheetComponent
                ref={ref}
                snapPoints={props.snapPoints}
                onClose={() => console.log(ref)}>
                <View style={styles.container}>
                    {props.title && <Text style={styles.title}>{props.title}</Text>}
                    <View style={{marginTop:verticalMarginScale(20)}}>
                        <Button
                            disabled={false}
                            style={styles.btnStyle}
                            title={props.fileButtonText}
                            colorTheme="dark"
                            onPress={props.onFileClick}
                            clearButtonStyle={styles.clearButton}
                            textStyle={{ color: '#000' }}
                        />
                        <Button
                            disabled={false}
                            style={styles.btnStyle}
                            title={props.photoButtonText}
                            colorTheme="dark"
                            onPress={props.onPhotoClick}
                            clearButtonStyle={styles.clearButton}
                            textStyle={{ color: '#000' }}
                        />
                    </View>

                </View>
            </BottomSheetComponent>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: horizontalMarginScale(20),
        gap: 10,
    },
    btnStyle: {
        borderRadius: fontScale(100),
        marginVertical:verticalMarginScale(3)
    },
    clearButton: {
        borderWidth: horizontalScale(2),
        backgroundColor: COLORS.white,
        borderColor: COLORS.borderGray,
    },
    title: {
        fontSize: fontScale(24),
        fontFamily: fontFamily.RomieTrial_Bold,
        textAlign: 'center',
    },
    profilePhotoContainer: {
        height: verticalScale(196),
        width: verticalScale(196),
        borderRadius: radiusScale(100),
        borderWidth: horizontalScale(1),
        backgroundColor: COLORS.tabBorderColor,
        borderColor: COLORS.borderGray,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DocumentBottomSheet;
