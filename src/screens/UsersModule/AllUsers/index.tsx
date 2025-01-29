import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import {CustomText} from 'src/component/CustomText';
import {OnboardingStackkParamList} from 'src/navigation/OnboardingStack';
import {SCREENS} from 'src/utils/constants';
import UserListItemStyle from './style';
import createStyle from './style';
import UserListItem from '../UsersListItem';
import SearchInput from 'src/component/SearchInput';

interface AllUserProps {}

const AllUsers: React.FC<AllUserProps> = ({}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<OnboardingStackkParamList>>();
  const searchInputRef = useRef<any>(null);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const onPressUser = () => {
    navigation.navigate(SCREENS.USER_DETAIL, {user: 1});
  };

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
      />

      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{alignSelf: 'center', width: '90%', gap: 10}}
        contentContainerStyle={{gap: 16}}
        ListHeaderComponent={<View />}
        ListFooterComponent={<View />}
      />
    </View>
  );
};

export default AllUsers;
