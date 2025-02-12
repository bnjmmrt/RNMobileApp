import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import ListItem, {ListItemProps} from '../../ListItem';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';
import {CustomText} from 'src/component/CustomText';
import ButtonSmall from 'src/component/ButtonSmall';
import IMAGES from '@images/index';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/slices';
import {UserDetailResponse} from 'src/redux/actions/usersApiAction';
import {UserItemInterface} from '../../UsersListItem';
import {ListItemInterface} from '../../Lists';

const dummyListData = [
  {
    name: 'List 1',
    users: '1233432',
  },
  {
    name: 'List 1',
    users: '1233432',
  },
];

interface UserListsProps {
  user: string;
}

const UserLists: React.FC<UserListsProps> = ({user}) => {
  const styles = createStyle();

  const {userDetails} = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({user})})`
    ] as {data: UserDetailResponse} | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const renderUsersListRow = useCallback(
    ({
      item,
      index,
    }: {
      item: {customName: string; id: string; totalCount: number};
      index: number;
    }) => {
      return (
        <ListItem
          title={item.customName}
          index={index}
          showDelete={false}
          containerStyle={styles.usersListRowContainer}
          id={item.id}
          userCount={item.totalCount}
          from="customListDetail"
        />
      );
    },
    [],
  );

  return (
    <UserDetailCard title={'Lists'}>
      <FlatList
        data={userDetails?.customLists || []}
        renderItem={renderUsersListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{gap: verticalMarginScale(8)}}
        ListEmptyComponent={
          <View>
            <CustomText>{'This user is not on any list'}</CustomText>
            <ButtonSmall
              colorTheme="dark"
              style={{
                padding: horizontalMarginScale(12),
                borderRadius: radiusScale(99),
                alignSelf: 'flex-start',
                marginTop: verticalMarginScale(8),
                gap: horizontalMarginScale(6),
              }}
              title="Add to List"
              onPress={() => {}}
              leftIcon={IMAGES.list}
              leftIconStyle={{tintColor: 'white'}}
            />
          </View>
        }
      />
    </UserDetailCard>
  );
};

export default UserLists;
