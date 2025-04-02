import IMAGES from '@images/index';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import { CustomText } from 'src/component/CustomText';
import RecipientListItemStyle from './RecipientListItemStyle';
import { verticalScale } from 'src/utils/dimensions';
import { RecipientListItemProps } from './AddAnnouncementInterface';


const RecipientListItem: React.FC<RecipientListItemProps> = ({
  item,
  index,
  isSelected = false,
  onSelectUser = () => { },
  showCheckbox = false,
}) => {
  const styles = RecipientListItemStyle();
  const name = item?.user?.firstName + ' ' + item?.user?.lastName
  return (
    <TouchableOpacity style={[styles.container, { marginTop: index != 0 ? verticalScale(-10) : null }]}>
      <View style={styles.userInfoContainer}>
        <AvatarInitials
          name={name}
          imgUrl={item?.user?.profilePicture}
          size={35}
          textColor="white"
        />
        <CustomText style={styles.username}>{name}</CustomText>
      </View>
      {showCheckbox ? (
        <TouchableOpacity onPress={() => onSelectUser(item)}>
          <Image
            resizeMode='contain'
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
