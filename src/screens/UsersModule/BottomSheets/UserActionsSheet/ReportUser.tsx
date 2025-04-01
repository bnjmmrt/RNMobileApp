import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import {
  UserDetailResponse,
  useReportUserMutation,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { EVENT } from 'src/utils/constants';
import { verticalMarginScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { styles } from './style';

const ReportUser = ({
  onPressBack,
  showError,
  showSuccess,
  user,
}: {
  onPressBack: () => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  user: string;
}) => {
  const messageRef = useRef<InputRefMethods>(null);

  const [message, setMessage] = useState<string>('');

  const [reportUser, { error, isLoading }] = useReportUserMutation();

  const { userDetails } = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({ user })})`
    ] as { data: UserDetailResponse } | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const roleId = useSelector(
    (state: RootState) => state.auth.roleId,
    shallowEqual,
  );

  const onPressCta = async () => {
    Keyboard.dismiss();
    messageRef?.current?.validateInputs();
    if (messageRef?.current?.validateInputs()) {
      if (userDetails && roleId) {
        try {
          const response = await reportUser({
            reportMessage: message,
            user: user,
            reportedToroleId: userDetails?.roleId,
            reportedByRoleId: roleId,
          }).unwrap();

          if (response.success) {
            showSuccess(EVENT.REPORT_SUBMITTED_SUCCESSFULLY);
          } else {
            const typedError = response as ApiErrorInterface;
            showError(getErrorMessage(typedError));
          }
        } catch (error) {
          const typedError = error as ApiErrorInterface;
          showError(getErrorMessage(typedError));
        }
      }
    }
  };

  return (
    <BottomSheetScrollView automaticallyAdjustKeyboardInsets>
      <Header
        headerTitle="Report User"
        showBackButton={true}
        showProgressBar={false}
        onPress={onPressBack}
      />
      <BottomSheetView style={styles.actionContentWrapper}>
        <CustomText style={styles.reportMessage}>
          {
            'Please share more details in the report message below. Your report will be shared with the Rumor Admin team for review.'
          }
        </CustomText>

        <Input
          ref={messageRef}
          multiline={true}
          hasHandler={true}
          placeholder="What would you like to report?"
          label="Report Message"
          defaultValue=""
          errorMessage="Please enter a message"
          otherStyle={{ marginTop: 0, marginBottom: verticalMarginScale(24) }}
          forBottomSheet={true}
          onChangeText={setMessage}
        />
        <Button
          title="Submit Report"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={onPressCta}
          loading={isLoading}
        />
      </BottomSheetView>
    </BottomSheetScrollView>
  );
};

export default ReportUser;
