import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import Button from 'src/component/Button';
import Header from 'src/component/Header/Header';
import SearchInput from 'src/component/SearchInput';
import {verticalMarginScale} from 'src/utils/dimensions';
import DeleteListUsersSheet from '../BottomSheets/DeleteListUsersSheet';
import ListActionsSheet from '../BottomSheets/ListActionsSheet';
import UserListItem from '../UsersListItem';
import createStyle from './style';
import {AppStackParamList} from 'src/navigation/AppStack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

interface ListDetailsProps extends NativeStackScreenProps<any, any> {}

const ListDetails: React.FC<ListDetailsProps> = ({route}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const searchInputRef = useRef<any>(null);
  const deleteListUsersSheetRef = useRef(null);
  const listActionSheetRef = useRef(null);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const onPressUser = () => {};

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
    <View style={styles.container}>
      <Header
        headerTitle="List Name"
        showProgressBar={false}
        rightIcon={IMAGES.dots}
        onPressRightIcon={() => {
          listActionSheetRef?.current?.open();
        }}
        showBackButton={true}
      />
      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchTextChange}
        placeholder="Search..."
        rightIcon={IMAGES.filter_lines}
      />

      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{alignSelf: 'center', width: '90%'}}
        contentContainerStyle={{gap: verticalMarginScale(16)}}
        ListHeaderComponent={<View />}
        ListFooterComponent={<View />}
      />
      {selectedUsers.length > 0 ? (
        <Button
          title="Remove from List"
          onPress={() => {
            deleteListUsersSheetRef?.current?.open();
          }}
          colorTheme="dark"
          style={styles.removeCta}
        />
      ) : null}

      <DeleteListUsersSheet ref={deleteListUsersSheetRef} />
      <ListActionsSheet ref={listActionSheetRef} />
    </View>
  );
};

export default ListDetails;
