import React, { useRef, forwardRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { Hp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, ERROR_MESSAGE, LABLE } from '../../utils/constants';
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import { useSubmitReferralCodeMutation } from '../../../src/redux/slices/referralSlice';

const ReferralCodeBottomSheet = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();

  console.log(ref)



  const handleSubmit = async () => {
    const { inputText, validateInputs } = inputRef.current;

    if (validateInputs()) {
      try {
        const response = await submitReferralCode({
          referralCode: inputText,
          userId: 'userId', 
        }).unwrap();

        FlashMessageComponent.show('success', 'Code submitted successfully!');
        ref.current?.close(); 
      } catch (error) {
        inputRef.current.setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_A_VALID_REFERRAL_CODE);
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[Platform.OS=="android"?'45%':'40%']}
      onClose={() =>console.log(ref)}
    >
        <View style={styles.container}>
          <Title
            title={LABLE.REFERRAL_CODE}
            subTitle={LABLE.IF_YOU_HAVE_ANY_REFERRAL_CODE}
            align="center"
          />
          <Input
            ref={inputRef}
            label={LABLE.ENTER_CODE}
            errorMessage={ERROR_MESSAGE.PLEASE_ENTER_A_VALID_REFERRAL_CODE}
          />
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={isLoading ? 'Loading...' : BUTTON_LABLE.SUBMIT}
            colorTheme="dark"
            onPress={handleSubmit}
          />
        </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 12,
  },
  btnStyle: {
    borderRadius: 100,
    marginTop: Hp(1),
  },
});

export default ReferralCodeBottomSheet;