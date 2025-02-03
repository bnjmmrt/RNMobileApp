import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';
import {horizontalMarginScale} from 'src/utils/dimensions';

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

interface UserInterestsProps {}

const UserInterests: React.FC<UserInterestsProps> = ({}) => {
  const styles = createStyle();

  const renderInterestsListRow = useCallback(({item}: {item: any}) => {
    return (
      <View style={styles.userIneterstsRowContainer}>
        <CustomText style={styles.userIneterstsName}>{item.name}</CustomText>
      </View>
    );
  }, []);

  return (
    <UserDetailCard title={'Interests'}>
      <FlatList
        data={dummyListData}
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
