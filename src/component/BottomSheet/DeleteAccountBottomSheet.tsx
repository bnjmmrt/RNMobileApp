import React, {useRef, forwardRef} from 'react';
import {View, StyleSheet, Text, Platform} from 'react-native';
import BottomSheetComponent from './BottomSheet';
import {BUTTON_LABLE, COLORS, PROFILE} from '../../utils/constants';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import { fontScale, horizontalMarginScale, radiusScale, verticalMarginScale } from 'src/utils/dimensions';

interface DeleteAccountBottomSheetProps {

}
const DeleteAccountBottomSheet = forwardRef(
  (props: DeleteAccountBottomSheetProps, ref) => {
    const inputRef = useRef(null);
    //   const [submitReferralCode, { isLoading }] = useSubmitReferralCodeMutation();

    const cancelClick = () => {
      ref.current?.close();
    };

    const handleDeleteAccount = () => {

      // handle API here
      ref.current?.close();
    };

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={[Platform.OS == 'android' ? '65%' : '60%']}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          <Text style={styles.title}>{PROFILE.DELETE_ACCOUNT}</Text>
          <Text style={styles.description}>
            Deleting your account will immediately:
          </Text>
          <View style={{paddingTop: 6}}>
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
            If you choose to return after deletion, you’ll need to reapply for
            membership, and reapproval is not guaranteed.Are you sure you want
            to proceed?
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
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:horizontalMarginScale(20),
    gap: 12,
  },
  deleteAccountBtnStyle: {
    borderRadius:radiusScale(100),
    backgroundColor: COLORS.errorText,
    marginTop:verticalMarginScale(8),
  },
  btnStyle: {
    borderRadius:radiusScale(100),
  },
  title: {
    fontSize: fontScale(24),
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  description: {
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(6),
    color: COLORS.light_gray,
  },
});

export default DeleteAccountBottomSheet;
