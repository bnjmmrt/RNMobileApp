import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, TouchableOpacity, View, ViewStyle} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import {OnboardingStackkParamList} from 'src/navigation/OnboardingStack';
import {ROUTES} from 'src/navigation/Route';
import createStyle from './style';
import {horizontalMarginScale} from 'src/utils/dimensions';

interface ListItemProps {
  showDelete: boolean;
  index: number;
  title: string;
  onPressDelete?: () => void;
  containerStyle?: ViewStyle;
}

const ListItem: React.FC<ListItemProps> = ({
  showDelete,
  index,
  title,
  onPressDelete,
  containerStyle,
}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<OnboardingStackkParamList>>();

  const onPressList = () => {
    navigation.navigate(ROUTES.ListDetail, {list: 1});
  };

  return (
    <TouchableOpacity
      style={[styles.usersListRowContainer, containerStyle]}
      onPress={onPressList}>
      <CustomText style={styles.usersListName}>{title}</CustomText>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: horizontalMarginScale(8),
        }}>
        <View style={styles.usersListUserCountWrapper}>
          <CustomText style={styles.usersListUserCount}>
            {10000 + ' users'}
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
