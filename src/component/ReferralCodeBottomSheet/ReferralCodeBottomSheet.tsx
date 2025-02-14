import React, { useRef, forwardRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { horizontalMarginScale, Hp, verticalMarginScale, verticalScale } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, ERROR_MESSAGE, LABLE } from '../../utils/constants';
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import { useSubmitReferralCodeMutation } from '../../redux/actions/referralApiAction';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { RootState } from 'src/redux/slices';
import { useSelector } from 'react-redux';

const ReferralCodeBottomSheet = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  const userId = useSelector((state: RootState) => state.auth.userId);


  const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();
  const handleSubmit = async () => {
    const { inputText, validateInputs } = inputRef.current;

    if (validateInputs()) {
      try {
        const response = await submitReferralCode({
          referralCode: inputText,
          userId: userId,
        }).unwrap();
        FlashMessageComponent.show('success', 'Code submitted successfully!');
        ref.current?.close();
      } catch (error) {
        console.log(error?.data?.error);
        inputRef.current.setErrorMessage(error?.data?.error?.message);
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[`${verticalScale(45)}%`]}
      onClose={() => console.log(ref)}
    // footer={}
    >
      <BottomSheetScrollView style={styles.container}>
        <Title
          title={LABLE.REFERRAL_CODE}
          subTitle={LABLE.IF_YOU_HAVE_ANY_REFERRAL_CODE}
          align="center"
        />
        <Input
          ref={inputRef}
          inputFieldContainerStyle={{ height: 56 }}
          label={LABLE.ENTER_CODE}
          forBottomSheet
          errorMessage={ERROR_MESSAGE.PLEASE_ENTER_A_VALID_REFERRAL_CODE}
        />
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.SUBMIT}
          colorTheme="dark"
          loading={isLoading}
          onPress={handleSubmit}
        />
      </BottomSheetScrollView>

    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(20),
  },
  btnStyle: {
    borderRadius: 100,
    marginTop: verticalMarginScale(40),
    height: 48
  },
});

export default ReferralCodeBottomSheet;