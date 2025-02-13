import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, View, ViewStyle} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import {ROUTES} from 'src/navigation/Route';
import createStyle from './style';
import {horizontalMarginScale} from 'src/utils/dimensions';
import {AppStackParamList, customListType} from 'src/navigation/AppStack';

export interface ListItemProps {
  id: string;
  index: number;
  title: string;
  userCount: number;
  showDelete: boolean;
  onPressDelete?: () => void;
  containerStyle?: ViewStyle;
  from?: 'customList' | 'customListDetail';
  listType: customListType;
}

const ListItem: React.FC<ListItemProps> = ({
  id,
  index,
  title,
  userCount,
  showDelete,
  onPressDelete,
  containerStyle,
  from = 'customList',
  listType,
}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();

  const onPressList = () => {
    navigation.navigate(ROUTES.ListDetail, {list: id, listType: listType});
  };

  return (
    <TouchableOpacity
      style={[styles.usersListRowContainer, containerStyle]}
      onPress={onPressList}>
      <CustomText style={styles.usersListName}>
        {from === 'customList'
          ? index === 0
            ? 'My Followers'
            : index === 1
            ? 'My Favorites'
            : title
          : title}
      </CustomText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: horizontalMarginScale(8),
        }}>
        <View style={styles.usersListUserCountWrapper}>
          <CustomText style={styles.usersListUserCount}>
            {userCount + ' users'}
          </CustomText>
        </View>
        {showDelete ? (
          <TouchableOpacity onPress={onPressDelete}>
            <Image source={IMAGES.delete} resizeMode="contain" />
          </TouchableOpacity>
        ) : null}
        <Image source={IMAGES.arrowRight} resizeMode="contain" />
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
