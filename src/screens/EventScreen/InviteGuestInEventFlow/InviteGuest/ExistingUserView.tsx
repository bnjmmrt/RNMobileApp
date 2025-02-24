import IMAGES from '@images/index';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import { CustomText } from 'src/component/CustomText';
import { AppStackParamList } from 'src/navigation/AppStack';
import { ROUTES } from 'src/navigation/Route';
import {
  useMarkUserFavMutation,
  useUnmarkUserFavMutation,
} from 'src/redux/actions/usersApiAction';
import { RootState } from 'src/redux/slices';
import { horizontalMarginScale, verticalScale } from 'src/utils/dimensions';
import ProfileCard from '../../Guest/ProfileCard';
import createStyles from './styles';
import { FlashMessageComponent } from 'src/component/FlashMessageComponent/FlashMessageComponent';
import { ApiErrorInterface, getErrorMessage } from 'src/utils/functions';
import { EventStackParamList } from 'src/navigation/EventStack';

interface ExistingUserViewProps {}

const ExistingUserView: React.FC<ExistingUserViewProps> = ({}) => {
  const styles = createStyles();
  const userNavigation = useNavigation<NavigationProp<AppStackParamList>>();
  const eventNavigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();

  const { selectedUsers, loginData } = useSelector(
    (state: RootState) => ({
      selectedUsers: state.inviteGuestsFlow.selectedUsers,
      loginData: state.auth.loginData,
    }),
    shallowEqual,
  );

  const [
    markUserFav,
    { error: markUserFavError, isLoading: markUserFavLoading },
  ] = useMarkUserFavMutation();
  const [
    unMarkUserFav,
    { error: unMarkUserFavError, isLoading: unMarkUserFavLoading },
  ] = useUnmarkUserFavMutation();

  const handleFavCta = async (user: string) => {
    // try {
    //   let response;
    //   let payload = {
    //     targetUserId: user,
    //     user: loginData.id,
    //   };
    //   if (userDetails?.isFavourite) {
    //     response = await unMarkUserFav(payload).unwrap();
    //   } else {
    //     response = await markUserFav(payload).unwrap();
    //   }
    //   if (response.status === 200) {
    //     // fetchUserDetails({ user: user });
    //     FlashMessageComponent.show('success', 'User marked as favorite!');
    //   } else {
    //     const typedError = response as ApiErrorInterface;
    //     FlashMessageComponent.show('error', getErrorMessage(typedError));
    //   }
    // } catch (error) {
    //   const typedError = error as ApiErrorInterface;
    //   FlashMessageComponent.show('error', getErrorMessage(typedError));
    // }
  };

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
            eventNavigation.navigate(ROUTES.SelectedGuestsToInviteScreen);
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

      {selectedUsers.length === 1 ? (
        <View style={{ flex: 1, marginHorizontal: horizontalMarginScale(20) }}>
          <ProfileCard
            guest={{
              name: selectedUsers[0]?.name || '',
              avatar: selectedUsers[0]?.profilePicture,
              roles: [],
              age: selectedUsers[0]?.age,
              followers: 0,
              location: '',
              isMember: false,
              status: '',
            }}
            actionButtons={[
              {
                title: 'Favorite',
                icon: IMAGES.star_inactive,
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
          />
        </View>
      ) : null}
    </View>
  );
};

export default ExistingUserView;
