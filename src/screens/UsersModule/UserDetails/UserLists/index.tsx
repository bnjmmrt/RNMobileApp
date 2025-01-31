import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import ListItem from '../../ListItem';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';
import {CustomText} from 'src/component/CustomText';
import ButtonSmall from 'src/component/ButtonSmall';
import IMAGES from '@images/index';

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
  const renderUsersListRow = useCallback(
    ({item, index}: {item: any; index: number}) => {
      return (
        <ListItem
          showDelete={false}
          title={item.name}
          index={index}
          containerStyle={styles.usersListRowContainer}
        />
      );
    },
    [],
  );

  return (
    <UserDetailCard title={'Lists'}>
      <FlatList
        data={dummyListData}
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
