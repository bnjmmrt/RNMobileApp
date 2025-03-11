import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { CustomText } from 'src/component/CustomText';
import { UserDetailResponse } from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { horizontalMarginScale } from 'src/utils/dimensions';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

interface UserInterestsProps {
  user: string;
}

const UserInterests: React.FC<UserInterestsProps> = ({ user }) => {
  const styles = createStyle();

  const { userDetails } = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({ user })})`
    ] as { data: UserDetailResponse } | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const renderInterestsListRow = useCallback(({ item }: { item: string }) => {
    return (
      <View style={styles.userIneterstsRowContainer}>
        <CustomText style={styles.userIneterstsName}>{item}</CustomText>
      </View>
    );
  }, []);

  if (!userDetails?.interest) {
    return null;
  }
  return (
    <UserDetailCard title={'Interests'}>
      <FlatList
        data={userDetails?.interest?.split(', ')}
        renderItem={renderInterestsListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          gap: horizontalMarginScale(4),
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
        bounces={false}
      />
    </UserDetailCard>
  );
};

export default UserInterests;
