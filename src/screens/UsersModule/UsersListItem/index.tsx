import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import { CustomText } from 'src/component/CustomText';
import { AppStackParamList } from 'src/navigation/AppStack';
import { ROUTES } from 'src/navigation/Route';
import UserListItemStyle from './style';

export interface UserItemInterface {
  age: number;
  categories: [];
  city: string;
  followerCount: string;
  gender: string;
  id: string;
  interests: string[];
  isFavourite: boolean;
  isInCustomList: boolean;
  name: string;
  profilePicture: string;
  type: string;
  listMappingId: string;
}
interface UserListItemProps {
  item: UserItemInterface;
  isSelected: boolean;
  onSelectUser: (user: UserItemInterface) => void;
  showCheckbox?: boolean;
}

const UserListItem: React.FC<UserListItemProps> = ({
  item,
  isSelected = false,
  onSelectUser = () => {},
  showCheckbox = true,
}) => {
  const styles = UserListItemStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const onPressUser = () => {
    navigation.navigate(ROUTES.UserDetail, { user: item.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPressUser}>
      <View style={styles.userInfoContainer}>
        <AvatarInitials
          name={item.name}
          imgUrl={item.profilePicture}
          size={40}
        />
        <CustomText style={styles.username} textProps={{ numberOfLines: 2 }}>
          {item.name}
        </CustomText>
      </View>
      {showCheckbox ? (
        <TouchableOpacity onPress={() => onSelectUser(item)}>
          <Image
            source={
              isSelected ? IMAGES.checkbox_active : IMAGES.checkbox_inactive
            }
          />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};

export default UserListItem;
