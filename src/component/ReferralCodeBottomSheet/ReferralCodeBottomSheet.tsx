import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useSubmitReferralCodeMutation } from '../../redux/actions/referralApiAction';
import { BUTTON_LABLE, ERROR_MESSAGE, LABLE } from '../../utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
} from '../../utils/dimensions';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import Button from '../Button';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';
import Input, { InputRefMethods } from '../Input/Input';
import Title from '../Title/Title';

const ReferralCodeBottomSheet = forwardRef((props, ref) => {
  const inputRef = useRef<InputRefMethods>(null);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();
  const handleSubmit = async () => {
    if (inputRef?.current?.validateInputs()) {
      try {
        const response = await submitReferralCode({
          referralCode: inputRef?.current?.inputText,
          userId: userId,
        }).unwrap();
        FlashMessageComponent.show('success', 'Code submitted successfully!');
        ref.current?.close();
      } catch (error) {
        console.log(error?.data?.error);
        inputRef.current.setErrorMessage('Please enter a valid referral code');
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={[`${Platform.OS === 'android' ? 45 : 40}%`]}
      onClose={() => console.log(ref)}
      activeSafeAreaViewColor={'#121f22'}
      inActiveSafeAreaViewColor={'#121f22'}
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
    height: 48,
  },
});

export default ReferralCodeBottomSheet;
