import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import SearchInput from 'src/component/SearchInput';
import {AppStackParamList} from 'src/navigation/AppStack';
import {Hp, verticalMarginScale} from 'src/utils/dimensions';
import UserListItem from '../UsersListItem';
import createStyle from './style';

interface AllUserProps {}

const AllUsers: React.FC<AllUserProps> = ({}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const searchInputRef = useRef<any>(null);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const onSelectUser = (user: number) => {
    if (selectedUsers.includes(user)) {
      const newArray = selectedUsers.filter(u => u !== user);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user];
      setSelectedUsers(newArray);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const renderItem = useCallback(
    ({item}: {item: number}) => {
      const isSelected = selectedUsers.includes(item);
      return (
        <UserListItem
          item={item}
          onSelectUser={onSelectUser}
          isSelected={isSelected}
        />
      );
    },
    [selectedUsers],
  );

  return (
    <View>
      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchTextChange}
        placeholder="Search..."
        rightIcon={IMAGES.filter_lines}
        onPressRightIcon={() => {}}
        rightIconText="125"
      />

      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{alignSelf: 'center', width: '90%'}}
        contentContainerStyle={{gap: verticalMarginScale(16)}}
        ListHeaderComponent={<View />}
        ListFooterComponent={<View />}
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="No Users"
              subTitle="Please refine your search"
            />
          </View>
        }
      />
    </View>
  );
};

export default AllUsers;
