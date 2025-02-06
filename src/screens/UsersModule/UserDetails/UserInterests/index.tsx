import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';
import {horizontalMarginScale} from 'src/utils/dimensions';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';
import {UserDetailResponse} from 'src/redux/actions/usersApiAction';

const dummyListData = [
  {
    name: 'Interest 1',
    users: '1233432',
  },
  {
    name: 'Interest 2',
    users: '1233432',
  },
  {
    name: 'Interest 3',
    users: '1233432',
  },
  {
    name: 'Interest 4',
    users: '1233432',
  },
  {
    name: 'Interest 5',
    users: '1233432',
  },
  {
    name: 'Interest 6',
    users: '1233432',
  },
  {
    name: 'Interest 7',
    users: '1233432',
  },
  {
    name: 'Interest 8',
    users: '1233432',
  },
];

interface UserInterestsProps {
  user: string;
}

const UserInterests: React.FC<UserInterestsProps> = ({user}) => {
  const styles = createStyle();

  const {userDetails} = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({user})})`
    ] as {data: UserDetailResponse} | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const renderInterestsListRow = useCallback(({item}: {item: string}) => {
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
