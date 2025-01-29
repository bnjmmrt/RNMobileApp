import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Button from 'src/component/Button';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Input from 'src/component/Input/Input';
import Title from 'src/component/Title/Title';

const ReportAndBlockHostView = ({ onClose }: { onClose: () => void }) => {
    const inputRef = useRef(null);
    const handleSubmitReport = async () => {
        const { inputText, validateInputs } = inputRef.current;

        if (validateInputs()) {
            try {
                // const response = await submitReferralCode({
                //   referralCode: inputText,
                //   userId: 'userId', 
                // }).unwrap();

                FlashMessageComponent.show('success', 'Code submitted successfully!');
                onClose();
            } catch (error) {
                inputRef.current.setErrorMessage("Please,enter a message");
            }
        }
    };
    return (

        <View style={{ paddingHorizontal: 12 }}>
            <Title align="center" title="Report & Block" subTitle="Please share more details on why you 
are reporting this host." />
            <View style={{ height: 220 }}>
                <Input
                    ref={inputRef}
                    label={'What would you like to report?'}
                    errorMessage={'Please, enter a message'}
                    multiline
                />
            </View>
            <Button
                disabled={false}
                style={styles.btnStyle}
                title={'Report & Block'}
                colorTheme="dark"
                // loading={isLoading}
                onPress={handleSubmitReport}
            />
        </View>
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
