import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { AppStackParamList } from 'src/navigation/AppStack';
import { EventStackParamList } from 'src/navigation/EventStack';
import { ROUTES } from 'src/navigation/Route';
import {
  useLazyFetchUserDetailsQuery,
  useMarkUserFavMutation,
  useUnmarkUserFavMutation,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { horizontalMarginScale, verticalScale } from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import ProfileCard from '../../Guest/ProfileCard';
import createStyles from './styles';

interface ExistingUserViewProps {}

const ExistingUserView: React.FC<ExistingUserViewProps> = ({}) => {
  const styles = createStyles();
  const userNavigation = useNavigation<NavigationProp<AppStackParamList>>();
  const eventNavigation = useNavigation<NavigationProp<EventStackParamList>>();

  const [isFavorite, setIsFavorite] = useState<boolean>();

  const { selectedUsers, userId } = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const [fetchUserDetails, { data: singleUserDetail, isLoading }] =
    useLazyFetchUserDetailsQuery();

  console.log(selectedUsers);

  const [
    markUserFav,
    { error: markUserFavError, isLoading: markUserFavLoading },
  ] = useMarkUserFavMutation();
  const [
    unMarkUserFav,
    { error: unMarkUserFavError, isLoading: unMarkUserFavLoading },
  ] = useUnmarkUserFavMutation();

  const handleFavCta = async (user: string) => {
    try {
      let response;
      let payload = {
        targetUserId: user,
        user: userId,
      };
      if (isFavorite) {
        response = await unMarkUserFav(payload).unwrap();
      } else {
        response = await markUserFav(payload).unwrap();
      }
      if (response.status === 200) {
        if (isFavorite) {
          FlashMessageComponent.show('success', 'User removed from favorites');
        } else {
          FlashMessageComponent.show('success', 'User added to Favorites');
        }
        setIsFavorite(!isFavorite);
      } else {
        const typedError = response as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    }
  };

  useEffect(() => {
    if (selectedUsers.length === 1) {
      const user = selectedUsers[0];
      fetchUserDetails({ user: user.id });
    }
  }, [selectedUsers]);

  useEffect(() => {
    if (selectedUsers.length === 1 && singleUserDetail) {
      setIsFavorite(singleUserDetail.data.isFavourite);
    }
  }, [singleUserDetail]);

  const slicedSelectedUsers =
    selectedUsers.length > 6 ? selectedUsers.slice(0, 6) : selectedUsers;

  return (
    <View style={[]}>
      {selectedUsers.length > 1 ? (
        <TouchableOpacity
          style={[
            styles.contentWrapper,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}
          onPress={() => {
            eventNavigation.navigate(ROUTES.SelectedGuestsToInviteScreen, {
              users: selectedUsers,
            });
          }}>
          <CustomText style={styles.title}>
            {`${selectedUsers.length} Recipients`}
          </CustomText>
          <View style={styles.usersAvatarContainer}>
            {slicedSelectedUsers.map((item, index) => {
              return (
                <AvatarInitials
                  key={item.id}
                  imgUrl={item.profilePicture}
                  name={item.name}
                  size={verticalScale(32)}
                  containerStyle={{
                    ...styles.avatarContainer,
                    ...{
                      marginRight:
                        slicedSelectedUsers.length - 1 !== index
                          ? -verticalScale(14)
                          : 0,
                    },
                  }}
                />
              );
            })}
          </View>
        </TouchableOpacity>
      ) : null}

      {selectedUsers.length === 1 && singleUserDetail ? (
        <View style={{ flex: 1, marginHorizontal: horizontalMarginScale(20) }}>
          <ProfileCard
            user={{
              name:
                `${singleUserDetail?.data?.firstName} ${singleUserDetail?.data?.lastName}` ||
                '',
              avatar: singleUserDetail?.data?.imageUrl,
              roles: singleUserDetail?.data?.focuses,
              age: singleUserDetail?.data?.age || 0,
              followers: selectedUsers[0].followerCount || '0',
              location: singleUserDetail?.data?.city,
              isMember: singleUserDetail?.data?.role === 'member',
              status: singleUserDetail?.data?.status,
              interests: singleUserDetail?.data?.interest
                .split(', ')
                .map((item: string, index: number) => item),
              isFollowing: singleUserDetail?.data?.isFollow,
            }}
            actionButtons={[
              {
                title: 'Favorite',
                icon: isFavorite ? IMAGES.star_active : IMAGES.star_inactive,
                onPress: () => handleFavCta(selectedUsers[0].id),
              },
              {
                title: 'Profile',
                icon: IMAGES.arrow_up_right,
                onPress: () =>
                  userNavigation.navigate(ROUTES.UserDetail, {
                    user: selectedUsers[0].id,
                  }),
              },
            ]}
            showGuestStatus={false}
          />
        </View>
      ) : null}
    </View>
  );
};

export default ExistingUserView;
