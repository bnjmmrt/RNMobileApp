import IMAGES from '@images/index';
import React, {useCallback, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import SearchInput from 'src/component/SearchInput';
import {verticalMarginScale} from 'src/utils/dimensions';
import {styles} from './style';

const AddUsersInList = ({onSuccess}: {onSuccess: () => void}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const onSelectUser = (user: number) => {
    if (selectedUsers.includes(user)) {
      const newArray = selectedUsers.filter(u => u !== user);
      setSelectedUsers(newArray);
    } else {
      const newArray = [...selectedUsers, user];
      setSelectedUsers(newArray);
    }
  };

  const renderListRow = useCallback(
    ({item, index}: {item: any; index: number}) => {
      const isSelected = selectedUsers.includes(item);
      return (
        <TouchableOpacity
          style={styles.userContainer}
          onPress={() => onSelectUser(item)}>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity onPress={() => {}}>
              <Image
                source={
                  isSelected ? IMAGES.checkbox_active : IMAGES.checkbox_inactive
                }
              />
            </TouchableOpacity>
            <AvatarInitials
              name="Vijay Soni"
              backgroundColor="red"
              size={32}
              textColor="white"
            />
            <CustomText style={styles.username}>{'Vijay Soni'}</CustomText>
          </View>
          <TouchableOpacity style={styles.userArrowWrapper}>
            <Image source={IMAGES.arrowRight} />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [selectedUsers],
  );

  return (
    <View>
      <CustomText style={styles.addUserTitle}>
        {'Select Users to Add to List'}
      </CustomText>
      <SearchInput placeholder="Search" />
      <FlatList
        data={[1, 2, 3, 4, 5]}
        renderItem={renderListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{gap: verticalMarginScale(8)}}
        style={{
          marginBottom: verticalMarginScale(24),
          marginTop: verticalMarginScale(16),
        }}
      />

      <Button
        title="Add Selected Users to List"
        colorTheme="dark"
        style={styles.actionCta}
        onPress={onSuccess}
      />
    </View>
  );
};

export default AddUsersInList;
