import IMAGES from '@images/index';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import AvatarInitials from 'src/component/AvatarInitials';
import {CustomText} from 'src/component/CustomText';
import {OnboardingStackkParamList} from 'src/navigation/OnboardingStack';
import {SCREENS} from 'src/utils/constants';
import UserListItemStyle from './style';
import createStyle from './style';
import DeleteListSheet from '../BottomSheets/DeleteListSheet';

interface ListsProps {}

const Lists: React.FC<ListsProps> = ({}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<OnboardingStackkParamList>>();
  const deleteListSheetRef = useRef(null);

  const onPressUser = () => {
    navigation.navigate(SCREENS.USER_DETAIL, {user: 1});
  };

  const ListItemRow = ({
    showDelete,
    index,
    title,
  }: {
    showDelete: boolean;
    index: number;
    title: string;
  }) => {
    return (
      <View style={styles.usersListRowContainer}>
        <CustomText style={styles.usersListName}>{title}</CustomText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <View style={styles.usersListUserCountWrapper}>
            <CustomText style={styles.usersListUserCount}>
              {10000 + ' users'}
            </CustomText>
          </View>
          {showDelete ? (
            <TouchableOpacity
              onPress={() => {
                deleteListSheetRef?.current?.open();
              }}>
              <Image source={IMAGES.delete} resizeMode="contain" />
            </TouchableOpacity>
          ) : null}
          <Image source={IMAGES.arrowRight} resizeMode="contain" />
        </View>
      </View>
    );
  };

  const renderItem = useCallback(
    ({item, index}: {item: number; index: number}) => {
      return (
        <ListItemRow
          showDelete={true}
          index={index}
          title={'List ' + (index + 1)}
        />
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={{gap: 8}}>
        <ListItemRow showDelete={false} index={12} title="My Followers" />
        <ListItemRow showDelete={false} index={13} title="My Favorites" />
      </View>
      <View style={styles.seprator} />
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{gap: 10}}
        contentContainerStyle={{gap: 16}}
        ListFooterComponent={<View />}
      />

      <DeleteListSheet ref={deleteListSheetRef} />
    </View>
  );
};

export default Lists;
