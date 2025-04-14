import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import {
  useDeleteUserMutation,
  UserDetailResponse,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { verticalMarginScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import { setUsersTabAllUsersRefresh } from 'src/redux/slices/listSkipSlice';

const DeleteUser = ({
  showError,
  showSuccess,
  user,
}: {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  user: string;
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [deleteUser, { error, isLoading }] = useDeleteUserMutation();

  const { userDetails } = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({ user })})`
    ] as { data: UserDetailResponse } | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const onPressCta = async () => {
    if (userDetails) {
      try {
        const response = await deleteUser({
          user: userDetails?.hostUserMappingId,
        }).unwrap();

        if (response.success) {
          dispatch(setUsersTabAllUsersRefresh());
          showSuccess(`${userDetails.firstName} has been deleted`);
          navigation.goBack();
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

  return (
    <BottomSheetView style={styles.actionContentWrapper}>
      <CustomText style={styles.title}>
        {'Are you sure you want to delete this user?'}
      </CustomText>
      <CustomText style={styles.markSpamMessage}>
        {'This action is permanent and cannot be undone.'}
      </CustomText>

      <Button
        title={'Delete User'}
        colorTheme="dark"
        style={[
          styles.actionCta,
          styles.markSpamCta,
          { marginBottom: verticalMarginScale(20) },
        ]}
        onPress={onPressCta}
        loading={isLoading}
      />
    </BottomSheetView>
  );
};

export default DeleteUser;
