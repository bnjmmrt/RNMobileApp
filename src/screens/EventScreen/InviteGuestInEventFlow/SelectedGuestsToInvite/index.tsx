import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import Header from 'src/component/Header/Header';
import { EventStackParamList } from 'src/navigation/EventStack';
import { RootState } from 'src/redux/slices';
import {
  removeSelectedUsersToInvite,
  setSelectedUsersToInvite,
} from 'src/redux/slices/inviteGuestsFlowSlice';
import UserListItem, {
  UserItemInterface,
} from 'src/screens/UsersModule/UsersListItem';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import createStyles from './styles';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';

interface SelectedGuestsToInviteScreenProps
  extends NativeStackScreenProps<
    EventStackParamList,
    'SelectedGuestsToInviteScreen'
  > {}

const SelectedGuestsToInviteScreen: React.FC<
  SelectedGuestsToInviteScreenProps
> = ({ route }) => {
  const styles = createStyles();
  const dispatch = useDispatch();
  const { users } = route?.params || {};

  const { selectedUsers, removedUsers } = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
      removedUsers: state.inviteGuestsFlow.removedUsers,
    }),
    shallowEqual,
  );

  const [tempSelectedUsers, setTempSelectedUsers] = useState<
    { isSelected: boolean; user: UserItemInterface }[]
  >([]);

  const onSelectUser = (
    user: {
      isSelected: boolean;
      user: UserItemInterface;
    },
    index: number,
  ) => {
    let tempArray = [...tempSelectedUsers];
    console.log(user.isSelected, tempArray.length);

    if (user.isSelected && selectedUsers.length === 1) {
      FlashMessageComponent.show(
        'error',
        "You can't remove all users from list!",
      );
      return;
    }
    tempArray[index] = {
      ...tempArray[index],
      isSelected: !user.isSelected,
    };
    if (user.isSelected) {
      // Removing from selectedUsers and adding to removedUsers
      const newRemovedArray = [...removedUsers, user.user];
      dispatch(removeSelectedUsersToInvite(newRemovedArray));

      const newSelectedArray = selectedUsers.filter(u => u.id !== user.user.id);
      dispatch(setSelectedUsersToInvite(newSelectedArray));
    } else {
      // Adding to selectedUsers and removing from removedUsers
      const newSelectedArray = [...selectedUsers, user.user];
      dispatch(setSelectedUsersToInvite(newSelectedArray));

      const newRemovedArray = removedUsers.filter(u => u.id !== user.user.id);
      dispatch(removeSelectedUsersToInvite(newRemovedArray));
    }

    setTempSelectedUsers(tempArray);
  };

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { isSelected: boolean; user: UserItemInterface };
      index: number;
    }) => {
      return (
        <UserListItem
          item={item.user}
          onSelectUser={() => onSelectUser(item, index)}
          isSelected={item.isSelected}
        />
      );
    },
    [tempSelectedUsers],
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(removeSelectedUsersToInvite([]));
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
      });
    }, []),
  );

  useEffect(() => {
    if (users) {
      let tempData = users.map(item => {
        return { isSelected: true, user: item };
      });
      setTempSelectedUsers(tempData);
    }
  }, [users]);

  return (
    <View style={styles.container}>
      <Header
        headerTitle={`${selectedUsers.length} Recipients`}
        showProgressBar={false}
      />

      <FlatList
        data={tempSelectedUsers || []}
        style={{
          marginHorizontal: horizontalMarginScale(20),
          marginTop: verticalMarginScale(16),
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalMarginScale(16) }}
        ListFooterComponent={
          <View style={{ marginBottom: verticalMarginScale(150) }} />
        }
        extraData={tempSelectedUsers}
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="User not found"
              subTitle="This users is not in our system or already has a status on the guest list. Tap “+” to add a new guest"
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SelectedGuestsToInviteScreen;
