import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import {CustomText} from 'src/component/CustomText';
import {AppStackParamList} from 'src/navigation/AppStack';
import {ROUTES} from 'src/navigation/Route';
import UserListItemStyle from './style';

interface UserListItemProps {
  item: number;
  isSelected: boolean;
  onSelectUser: (user: number) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({
  item,
  isSelected = false,
  onSelectUser = () => {},
}) => {
  const styles = UserListItemStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const onPressUser = () => {
    navigation.navigate(ROUTES.UserDetail, {user: item.id});
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPressUser}>
      <View style={styles.userInfoContainer}>
        <AvatarInitials
          name={item.name}
          imgUrl={item.profilePicture}
          size={40}
          textColor="white"
        />
        <CustomText style={styles.username}>{item.name}</CustomText>
      </View>
      <TouchableOpacity onPress={() => onSelectUser(item)}>
        <Image
          source={
            isSelected ? IMAGES.checkbox_active : IMAGES.checkbox_inactive
          }
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default UserListItem;
