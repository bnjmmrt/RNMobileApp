import IMAGES from '@images/index';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import { CustomText } from 'src/component/CustomText';
import RecipientListItemStyle from './RecipientListItemStyle';
import { verticalScale } from 'src/utils/dimensions';

export interface RecipientItemInterface {
  age: number;
  categories: [];
  city: string;
  followerCount: string;
  gender: string;
  id: string;
  interests: string[];
  isFavourite: boolean;
  name: string;
  profilePicture: string;
  type: string;
  listMappingId: string;
}
interface RecipientListItemProps {
  item: RecipientItemInterface;
  index: number,
  isSelected: boolean;
  onSelectUser: (user: RecipientItemInterface) => void;
  showCheckbox?: boolean;
}

const RecipientListItem: React.FC<RecipientListItemProps> = ({
  item,
  index,
  isSelected = false,
  onSelectUser = () => { },
  showCheckbox = true,
}) => {
  const styles = RecipientListItemStyle();
  return (
    <TouchableOpacity style={[styles.container, { marginTop: index != 0 ? verticalScale(-10) : null }]}>
      <View style={styles.userInfoContainer}>
        <AvatarInitials
          name={item.name}
          imgUrl={item.profilePicture}
          size={35}
          textColor="white"
        />
        <CustomText style={styles.username}>{item.name}</CustomText>
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

export default RecipientListItem;
