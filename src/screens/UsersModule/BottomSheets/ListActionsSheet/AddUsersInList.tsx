import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import SearchInput from 'src/component/SearchInput';
import { AppStackParamList } from 'src/navigation/AppStack';
import { ROUTES } from 'src/navigation/Route';
import { useAddUsersToCustomListMutation } from 'src/redux/actions/listsApiAction';
import { useFetchAllUsersQuery } from 'src/redux/actions/usersApiAction';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { UserItemInterface } from '../../UsersListItem';
import { styles } from './style';

const AddUsersInList = ({
  onSuccess,
  closeSheet,
  showError,
  listId,
  listName,
  selectedUsers: users,
}: {
  onSuccess: () => void;
  closeSheet: () => void;
  showError: (message: string) => void;
  listId: string;
  listName: string;
  selectedUsers?: string[];
}) => {
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState<{
    users: UserItemInterface[];
    totalCount: number;
  }>({ totalCount: 0, users: [] });

  const { data, isLoading } = useFetchAllUsersQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
    searchValue: searchText,
  });

  const [
    addUsersToList,
    { error: addUsersToListError, isLoading: addUsersToListLoading },
  ] = useAddUsersToCustomListMutation();

  const loadMore = () => {
    if (allUsers?.users?.length < data?.data?.totalCount && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const onSelectUser = (user: UserItemInterface) => {
    const isSelected = selectedUsers.some(
      selectedUser => selectedUser === user.id,
    );
    if (isSelected) {
      const newArray = selectedUsers.filter(u => u !== user.id);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user.id];
      setSelectedUsers(newArray);
    }
  };

  const handleSearchTextChange = (text: string) => {
    setCurrentPage(1);
    setSearchText(text);
  };

  const onPressAddToList = async () => {
    if (!listId) {
      showError('Please select a list first!');
      return;
    }

    if (selectedUsers?.length === 0) {
      showError('Please select users to add in list!');
      return;
    }
    const payload = {
      customName: listName,
      userIds: selectedUsers || [],
      listId: listId,
    };
    try {
      const response = await addUsersToList(payload).unwrap();
      if (response.status === 200) {
        onSuccess();
      } else {
        showError('Something went wrong!');
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      showError(getErrorMessage(typedError));
    }
  };

  const renderListRow = useCallback(
    ({ item, index }: { item: UserItemInterface; index: number }) => {
      const isSelected = selectedUsers.some(user => user === item.id);
      return (
        <TouchableOpacity
          style={styles.userContainer}
          onPress={() => onSelectUser(item)}>
          <View style={styles.userInfoContainer}>
            <Image
              source={
                isSelected ? IMAGES.checkbox_active : IMAGES.checkbox_inactive
              }
            />

            <AvatarInitials
              name={item.name}
              size={32}
              imgUrl={item.profilePicture}
            />
            <CustomText style={styles.username}>{item.name}</CustomText>
          </View>
          <TouchableOpacity
            style={styles.userArrowWrapper}
            onPress={() => {
              closeSheet();
              navigation.navigate(ROUTES.UserDetail, { user: item.id });
            }}>
            <Image source={IMAGES.arrowRight} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [selectedUsers],
  );

  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        setAllUsers(data.data);
      } else {
        setAllUsers(prev => ({
          totalCount: data.data.totalCount,
          users: [...prev.users, ...data.data.users],
        }));
      }
    }
  }, [data]);

  return (
    <BottomSheetView style={{ flex: 1 }}>
      <CustomText style={styles.addUserTitle}>
        {'Select Users to Add to List'}
      </CustomText>
      <BottomSheetFlatList
        data={
          users
            ? allUsers.users.filter(
                item1 => !users.some(item2 => item2 === item1.id),
              )
            : allUsers?.users || []
        }
        renderItem={renderListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalMarginScale(8) }}
        style={{
          marginBottom: verticalMarginScale(12),
          marginHorizontal: horizontalMarginScale(12),
          flex: 1,
        }}
        ListHeaderComponent={
          <SearchInput
            placeholder="Search"
            mainContainerStyle={{
              marginBottom: verticalMarginScale(8),
              marginHorizontal: 0,
            }}
            defaultValue={searchText}
            onSearchTextChange={handleSearchTextChange}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              height: Hp(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="Users not found"
              subTitle={''}
              isLoading={isLoading}
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
      />

      <Button
        title="Add Selected Users to List"
        colorTheme="dark"
        style={[
          styles.actionCta,
          {
            marginBottom: verticalMarginScale(20),
          },
        ]}
        onPress={onPressAddToList}
        loading={addUsersToListLoading}
      />
    </BottomSheetView>
  );
};

export default AddUsersInList;
