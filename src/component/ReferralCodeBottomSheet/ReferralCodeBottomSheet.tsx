import React, { useRef, forwardRef } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { Hp } from '../../utils/dimensions';
import { BUTTON_LABLE, COLORS, ERROR_MESSAGE, LABLE } from '../../utils/constants';
import Title from '../Title/Title';
import Input from '../Input/Input';
import Button from '../Button';
import { FlashMessageComponent } from '../FlashMessageComponent/FlashMessageComponent';

const ReferralCodeBottomSheet = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    const { inputText, validateInputs } = inputRef.current;

    if (validateInputs()) {
      if (inputText === 'ONE40') {
        FlashMessageComponent.show('success', "Code submitted successfully!");
        ref.current?.close(); // Assuming the BottomSheet has a `close` method.
      } else {
        inputRef.current.setErrorMessage(ERROR_MESSAGE.PLEASE_ENTER_A_VALID_REFERRAL_CODE);
      }
    }
  };

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['40%']}
      onClose={() => console.log('Bottom sheet closed')}
    >
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
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
          title={BUTTON_LABLE.SUBMIT}
          colorTheme="dark"
          onPress={handleSubmit}
        />
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    marginTop: Hp(1),
  },
});

export default ReferralCodeBottomSheet;
