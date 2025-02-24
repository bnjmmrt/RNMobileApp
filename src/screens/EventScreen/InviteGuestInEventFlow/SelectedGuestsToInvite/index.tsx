import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import Header from 'src/component/Header/Header';
import { EventStackParamList } from 'src/navigation/EventStack';
import { RootState } from 'src/redux/slices';
import { setSelectedUsersToInvite } from 'src/redux/slices/inviteGuestsFlowSlice';
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

interface SelectedGuestsToInviteScreenProps
  extends NativeStackScreenProps<
    EventStackParamList,
    'SelectedGuestsToInviteScreen'
  > {}

const SelectedGuestsToInviteScreen: React.FC<
  SelectedGuestsToInviteScreenProps
> = ({}) => {
  const styles = createStyles();
  const dispatch = useDispatch();

  const { selectedUsers } = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
    }),
    shallowEqual,
  );

  const onSelectUser = (user: UserItemInterface) => {
    const isSelected = selectedUsers.some(
      selectedUser => selectedUser.id === user.id,
    );
    if (isSelected) {
      const newArray = selectedUsers.filter(u => u.id !== user.id);
      dispatch(setSelectedUsersToInvite(newArray));
    } else {
      const newArray = [...selectedUsers, user];
      dispatch(setSelectedUsersToInvite(newArray));
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: UserItemInterface }) => {
      const isSelected = selectedUsers.some(user => user.id === item.id);
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

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
      });
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        headerTitle={`${selectedUsers.length} Recipients`}
        showProgressBar={false}
      />

      <FlatList
        data={selectedUsers || []}
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
