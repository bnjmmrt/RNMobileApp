import IMAGES from '@images/index';
import React, {useCallback} from 'react';
import {FlatList, Image, View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

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

interface UserListsProps {}

const UserLists: React.FC<UserListsProps> = ({}) => {
  const styles = createStyle();
  const renderUsersListRow = useCallback(({item}: {item: any}) => {
    return (
      <View style={styles.usersListRowContainer}>
        <CustomText style={styles.usersListName}>{item.name}</CustomText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <View style={styles.usersListUserCountWrapper}>
            <CustomText style={styles.usersListUserCount}>
              {item.users + ' users'}
            </CustomText>
          </View>
          <Image source={IMAGES.arrowRight} resizeMode="contain" />
        </View>
      </View>
    );
  }, []);

  return (
    <UserDetailCard title={'Lists'}>
      <FlatList
        data={dummyListData}
        renderItem={renderUsersListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{gap: 8}}
      />
    </UserDetailCard>
  );
};

export default UserLists;
