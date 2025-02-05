import React, {useRef} from 'react';
import {View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import Input, {InputRefMethods} from 'src/component/Input/Input';
import {
  UserDetailResponse,
  useReportUserMutation,
} from 'src/redux/actions/usersApiAction';
import {RootState} from 'src/redux/slices';
import {verticalMarginScale} from 'src/utils/dimensions';
import {styles} from './style';
import {BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';

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

  const [reportUser, {error, isLoading}] = useReportUserMutation();

  const {userDetails} = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({user})})`
    ] as {data: UserDetailResponse} | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const onPressCta = async () => {
    messageRef?.current?.validateInputs();
    if (messageRef?.current?.validateInputs()) {
      if (userDetails) {
        try {
          const response = await reportUser({
            reportMessage: '',
            user: user,
          }).unwrap();

          if (response.status === 200) {
            showSuccess(`${userDetails.firstName} reported successfully!`);
          } else {
            showError('Something went wrong!');
          }
        } catch (error) {
          showError('Something went wrong!');
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
      <View style={styles.actionContentWrapper}>
        <CustomText style={styles.reportMessage}>
          {
            'Please share more details in the report message below. Your report will be shared with the Rumor Admin team for review.'
          }
        </CustomText>

        <Input
          ref={messageRef}
          multiline={true}
          placeholder="What would you like to report?"
          label="Report Message"
          defaultValue=""
          errorMessage="Please enter report message"
          otherStyle={{marginTop: 0, marginBottom: verticalMarginScale(24)}}
          forBottomSheet={true}
        />
        <Button
          title="Submit Report"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={onPressCta}
          loading={isLoading}
        />
      </View>
    </BottomSheetScrollView>
  );
};

export default ReportUser;
