import React, { useRef, forwardRef } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { BUTTON_LABLE, COLORS, PROFILE } from '../../utils/constants';
import Button from '../Button';
import { fontFamily } from '../../utils/functions';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale } from 'src/utils/dimensions';
import BottomSheetComponent from '../BottomSheet/BottomSheet';

interface DeleteTalentBottomSheetProps {

}
const DeleteTalentBottomSheet = forwardRef(
    (props: DeleteTalentBottomSheetProps, ref) => {
        const inputRef = useRef(null);
        //   const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();

        const cancelClick = () => {
            ref.current?.close();
        };

        const handleDelete = () => {
            props?.handleDelete();
            // handle API here
            ref.current?.close();
        };

        return (
            <BottomSheetComponent
                ref={ref}
                snapPoints={['25%']}
                onClose={() => console.log(ref)}>
                <View style={styles.container}>
                    <Text style={styles.title}>{'Delete Featured Talent'}</Text>
                    <Text style={styles.description}>
                        Talent will be removed from the event details page.
                    </Text>
                    <Button
                        disabled={false}
                        style={styles.deleteAccountBtnStyle}
                        title={"Delete"}
                        colorTheme="dark"
                        onPress={handleDelete}
                    />
                </View>
            </BottomSheetComponent>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: horizontalMarginScale(20),
        gap: 12,
    },
    deleteAccountBtnStyle: {
        borderRadius: radiusScale(100),
        backgroundColor: COLORS.errorText,
        marginTop: verticalMarginScale(8),
    },
    btnStyle: {
        borderRadius: radiusScale(100),
    },
    title: {
        fontSize: fontScale(24),
        fontFamily: fontFamily.RomieTrial_Bold,
        textAlign: 'center'
    },
    description: {
        fontSize: fontScale(14),
        paddingTop: verticalMarginScale(6),
        color: COLORS.light_gray,
    },
});

export default DeleteTalentBottomSheet;
