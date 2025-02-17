import IMAGES from '@images/index';
import React, {useEffect, useRef, useState} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import ButtonSmall from 'src/component/ButtonSmall';
import {FlashMessageComponent} from 'src/component/FlashMessageComponent/FlashMessageComponent';
import Input from 'src/component/Input/Input';
import {
  useAddUserNoteMutation,
  useLazyFetchUserDetailsQuery,
  UserDetailResponse,
} from 'src/redux/actions/usersApiAction';
import {RootState} from 'src/redux/slices';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import {ApiErrorInterface, getErrorMessage} from 'src/utils/functions';
import UserDetailCard from '../UserDetailCard';

interface UserInformationProps {
  user: string;
}

const UserInformation: React.FC<UserInformationProps> = ({user}) => {
  const noteRef = useRef<any>(null);

  const [userNote, setUserNote] = useState<string>('');

  const [addUserNote, {error, isLoading}] = useAddUserNoteMutation();
  const [fetchUserDetails, {}] = useLazyFetchUserDetailsQuery();

  const {userDetails} = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({user})})`
    ] as {data: UserDetailResponse} | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const onSaveNote = async () => {
    noteRef.current.validateInputs();
    if (noteRef.current.validateInputs()) {
      const payload = {
        note: userNote,
        user: user,
      };

      try {
        const response = await addUserNote(payload).unwrap();

        if (response.status === 200) {
          FlashMessageComponent.show('success', 'User notes updated');
          fetchUserDetails({user: user});
        } else {
          const typedError = response as ApiErrorInterface;
          FlashMessageComponent.show('error', getErrorMessage(typedError));
        }
      } catch (error) {
        const typedError = error as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    }
  };

  useEffect(() => {
    if (userDetails?.note) {
      setUserNote(userDetails?.note);
    }
  }, [userDetails, userDetails?.note]);

  return (
    <UserDetailCard title={'Information'}>
      <Input
        ref={noteRef}
        multiline
        placeholder="These notes are internal and only visible to you"
        label="User Notes"
        defaultValue={userNote}
        onChangeText={text => setUserNote(text)}
        errorMessage="Please enter user note"
        otherStyle={{marginTop: 0}}
      />
      {userDetails?.note !== userNote ? (
        <ButtonSmall
          colorTheme="dark"
          style={{
            padding: horizontalMarginScale(12),
            borderRadius: radiusScale(99),
            alignSelf: 'flex-start',
            marginTop: verticalMarginScale(8),
          }}
          title="Save"
          onPress={onSaveNote}
          leftIcon={IMAGES.check}
          leftIconStyle={{tintColor: 'white'}}
          loading={isLoading}
        />
      ) : null}
    </UserDetailCard>
  );
};

export default UserInformation;
