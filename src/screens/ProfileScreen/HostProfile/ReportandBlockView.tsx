import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import useApi from 'src/axios/useApi';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Input from 'src/component/Input/Input';
import Title from 'src/component/Title/Title';
import { fontFamily } from 'src/utils/functions';

const ReportAndBlockHostView = ({ onClose, userId, hostId, roleId, hostRoleId }: {
    onClose: Function, userId: string;
    hostId: string;
    hostRoleId: string;
    roleId: string;
}) => {
    const inputRef = useRef(null);
    const { apiRequest, loading, error } = useApi();

    const handleSubmitReport = async () => {
        const { inputText, validateInputs } = inputRef.current;

        if (validateInputs()) {
            try {
                const response = await apiRequest('post', `v1/auth/users/${userId}/hosts/${hostId}/report-and-block`, {
                    reportMessage: inputText,
                    reportedByRoleId: roleId,
                    reportedToroleId: hostRoleId,
                });

                if (response) {
                    FlashMessageComponent.show('success', 'Host reported and blocked successfully!');
                    onClose(true);
                } else {
                }
            } catch (error) {
                inputRef.current.setErrorMessage("Please enter a message");
            }
        }
    };

    return (
        <BottomSheetScrollView style={{ paddingHorizontal: 12 }}>
            <Title align="center" title="Report & Block Host" subTitle={`Please share more details on why you are\nreporting this host.`} />
            <View>
                <Input
                    ref={inputRef}
                    label={'What would you like to report?'}
                    errorMessage={'Please enter a message'}
                    multiline
                    labelStyle={{ fontFamily: fontFamily.ABCDiatype_Medium }}
                    forBottomSheet
                />
            </View>
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={'Report & Block'}
                colorTheme="dark"
                loading={loading}
                onPress={handleSubmitReport}
            />
        </BottomSheetScrollView>
    );
};

const styles = StyleSheet.create({
    btnStyle: {
        borderRadius: 100,
        marginTop: 20,
        alignSelf: 'flex-end',
        height: 48,
        width: '100%'
    },
});

export default ReportAndBlockHostView;
