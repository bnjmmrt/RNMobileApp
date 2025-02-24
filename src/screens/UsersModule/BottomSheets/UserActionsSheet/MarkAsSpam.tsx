import {BottomSheetView} from '@gorhom/bottom-sheet';
import React from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {
  UserDetailResponse,
  useUserSpamToggleMutation,
} from 'src/redux/actions/usersApiAction';
import {RootState} from 'src/redux/slices';
import {verticalMarginScale} from 'src/utils/dimensions';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import {styles} from './style';

const MarkAsSpam = ({
  showError,
  showSuccess,
  user,
}: {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  user: string;
}) => {
  const [userSpamToggle, {error, isLoading}] = useUserSpamToggleMutation();

  const {userDetails} = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({user})})`
    ] as {data: UserDetailResponse} | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const onPressCta = async () => {
    if (userDetails) {
      try {
        const response = await userSpamToggle({
          isSpam: !userDetails?.isSpam,
          user: user,
        }).unwrap();

        if (response.status === 200) {
          showSuccess(
            `${userDetails.firstName} ${
              userDetails?.isSpam ? 'unmarked' : 'marked'
            } as spam`,
          );
        } else {
          const typedError = response as ApiErrorInterface;
          showError(getErrorMessage(typedError));
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        showError(getErrorMessage(typedError));
      }
    }
  };

  const message = userDetails?.isSpam
    ? 'Are you sure you want to unmark this user as spam?\nFuture requests from this user will no longer be moved to the declined tab automatically.'
    : 'Are you sure you want to mark the selected user as spam?\n\nIf they request access to your events in the future, they will automatically be moved to the declined tab.';
  return (
    <BottomSheetView style={styles.actionContentWrapper}>
      <CustomText style={styles.title}>
        {userDetails?.isSpam ? 'Unmark as Spam' : 'Mark as Spam'}
      </CustomText>
      <CustomText style={styles.markSpamMessage}>{message}</CustomText>

      <Button
        title={userDetails?.isSpam ? 'Unmark as Spam' : 'Mark as Spam'}
        colorTheme="dark"
        style={[
          styles.actionCta,
          !userDetails?.isSpam && styles.markSpamCta,
          {marginBottom: verticalMarginScale(20)},
        ]}
        onPress={onPressCta}
        loading={isLoading}
      />
    </BottomSheetView>
  );
};

export default MarkAsSpam;
