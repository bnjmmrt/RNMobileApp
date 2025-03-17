import IMAGES from '@images/index';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import {
  useLazyFetchUserDetailsQuery,
  useMarkUserFavMutation,
  UserDetailResponse,
  useUnmarkUserFavMutation,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { COLORS } from 'src/utils/constants';
import {
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import UserDetailCard from '../UserDetailCard';
import createStyle from './style';

interface UserProfileProps {
  user: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const styles = createStyle();
  const [
    markUserFav,
    { error: markUserFavError, isLoading: markUserFavLoading },
  ] = useMarkUserFavMutation();
  const [
    unMarkUserFav,
    { error: unMarkUserFavError, isLoading: unMarkUserFavLoading },
  ] = useUnmarkUserFavMutation();
  const [fetchUserDetails, {}] = useLazyFetchUserDetailsQuery();

  const userId = useSelector((state: RootState) => state.auth.userId);
  const { userDetails } = useSelector((state: RootState) => {
    const queryResult = state.api.queries[
      `fetchUserDetails(${JSON.stringify({ user })})`
    ] as { data: UserDetailResponse } | undefined;

    return {
      userDetails: queryResult?.data?.data ?? undefined,
    };
  }, shallowEqual);

  const handleFavCta = async () => {
    try {
      let response;
      let payload = {
        targetUserId: user,
        user: userId,
      };
      if (userDetails?.isFavourite) {
        response = await unMarkUserFav(payload).unwrap();
      } else {
        response = await markUserFav(payload).unwrap();
      }

      if (response.success) {
        if (userDetails?.isFavourite) {
          FlashMessageComponent.show('success', 'User removed from favorites');
        } else {
          FlashMessageComponent.show('success', 'User added to Favorites');
        }
        fetchUserDetails({ user: user });
      } else {
        const typedError = response as ApiErrorInterface;
        FlashMessageComponent.show('error', getErrorMessage(typedError));
      }
    } catch (error) {
      const typedError = error as ApiErrorInterface;
      FlashMessageComponent.show('error', getErrorMessage(typedError));
    }
  };

  return (
    <View>
      <UserDetailCard
        containerStyle={{
          borderBottomLeftRadius: radiusScale(8),
          borderBottomRightRadius: radiusScale(8),
          borderTopLeftRadius: radiusScale(16),
          borderTopRightRadius: radiusScale(16),
        }}>
        <View style={{ alignItems: 'center' }}>
          <AvatarInitials
            name={`${userDetails?.firstName || ''} ${
              userDetails?.lastName || ''
            }`}
            size={80}
            imgUrl={userDetails?.imageUrl}
          />
          <View
            style={[
              styles.memberTypeWrapper,
              userDetails?.role === 'member' && {
                backgroundColor: COLORS.black,
                borderWidth: 0,
              },
            ]}>
            {userDetails?.role === 'member' ? (
              <Image source={IMAGES.check_verified} />
            ) : null}
            <CustomText
              style={[
                styles.memberType,
                userDetails?.role === 'member' && {
                  color: COLORS.white,
                },
              ]}>
              {userDetails?.role.split('_').join(' ') || ''}
            </CustomText>
          </View>
          <CustomText style={styles.userName}>
            {`${userDetails?.firstName || ''} ${userDetails?.lastName || ''}`}
          </CustomText>
          {userDetails?.category ? (
            <ScrollView
              contentContainerStyle={{
                gap: horizontalMarginScale(4),
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: verticalMarginScale(16),
                justifyContent: 'center',
              }}
              scrollEnabled={false}>
              {userDetails.category
                .split(', ')
                .map((item: string, index: number) => {
                  return (
                    <View style={styles.userTagsContainer}>
                      <CustomText style={styles.userTags}>{item}</CustomText>
                    </View>
                  );
                })}
            </ScrollView>
          ) : null}
        </View>

        <View style={styles.userActionsFloatingContainer}>
          {userDetails?.isSpam ? (
            <TouchableOpacity
              style={styles.userActionButton}
              onPress={() => {
                FlashMessageComponent.show(
                  'info',
                  'You marked this user as spam',
                );
              }}>
              <Image source={IMAGES.alert_triangle_filled} />
            </TouchableOpacity>
          ) : null}
          {userDetails?.isFollow ? (
            <TouchableOpacity
              style={styles.userActionButton}
              onPress={() => {
                FlashMessageComponent.show('info', 'User is following you');
              }}>
              <Image source={IMAGES.user_check} />
            </TouchableOpacity>
          ) : null}
        </View>
      </UserDetailCard>
      <View style={styles.favButtonWrapper}>
        <Button
          title={'Favorite'}
          imageSource={
            userDetails?.isFavourite ? IMAGES.star_active : IMAGES.star_inactive
          }
          leftImageStyle={{
            height: verticalScale(16),
            width: verticalScale(16),
          }}
          style={styles.favButton}
          onPress={handleFavCta}
          loading={markUserFavLoading || unMarkUserFavLoading}
        />
      </View>
    </View>
  );
};

export default UserProfile;
