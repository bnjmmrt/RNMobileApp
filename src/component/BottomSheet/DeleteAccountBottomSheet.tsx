import React, { useRef, forwardRef, useCallback } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import BottomSheetComponent, { BottomSheetMethods } from './AppBottomSheet';
import { BUTTON_LABLE, COLORS, PROFILE } from '../../utils/constants';
import Button from '../Button';
import { fontFamily } from '../../utils/functions';

interface DeleteAccountBottomSheetProps {
  onDeletePress?: () => void;
}

const DeleteAccountBottomSheet = forwardRef<
  BottomSheetMethods,
  DeleteAccountBottomSheetProps
>(({ onDeletePress }, ref) => {
  const inputRef = useRef(null);
  //   const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();

  const cancelClick = () => {
    if (ref && 'current' in ref) {
      ref.current?.close();
    }
  };

  const handleDeleteAccount = useCallback(() => {
    onDeletePress?.();
  }, [onDeletePress]);

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['0.56']}
      onClose={() => console.log(ref)}>
      <View style={styles.container}>
        <Text style={styles.title}>{PROFILE.DELETE_ACCOUNT}</Text>
        <Text style={styles.description}>
          Deleting your account will immediately:
        </Text>
        <View style={{ paddingTop: 6 }}>
          <Text style={styles.description}>
            • Cancel all your RSVPs, requests, and invitations.
          </Text>
          <Text style={styles.description}>
            • Hide your profile from hosts.
          </Text>
        </View>

        <Text style={styles.description}>
          You can log back in within 30 days to reactivate your account. After
          30 days, your account and all associated data will be permanently
          deleted.
        </Text>
        <Text style={styles.description}>
          If you choose to return after deletion, you'll need to reapply for
          membership, and reapproval is not guaranteed.
        </Text>
        <Text style={styles.description}>
          Are you sure you want to proceed?
        </Text>
        <Button
          disabled={false}
          style={styles.deleteAccountBtnStyle}
          title={BUTTON_LABLE.DELETE_MY_ACCOUNT}
          colorTheme="dark"
          onPress={handleDeleteAccount}
        />
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.CANCEL}
          colorTheme="dark"
          onPress={cancelClick}
        />
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
  },
  deleteAccountBtnStyle: {
    borderRadius: 100,
    backgroundColor: COLORS.errorText,
    marginTop: 16,
  },
  btnStyle: {
    borderRadius: 100,
  },
  title: {
    fontSize: 24,
    color: COLORS.black,
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  description: {
    fontSize: 14,
    paddingTop: 6,
    color: COLORS.light_gray,
  },
});

export default DeleteAccountBottomSheet;
