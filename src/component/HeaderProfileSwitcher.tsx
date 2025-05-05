/* eslint-disable react/no-unstable-nested-components */
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ProfileStackParamList } from 'src/navigation/ProfileStack';
import { ROUTES } from 'src/navigation/Route';
import { RootState } from 'src/redux/slices';
import {
  role,
  setAuthToken,
  setRole,
  setRoleId,
} from 'src/redux/slices/authSlice';
import {
  ApiErrorInterface,
  fetchUserProfile,
  getErrorMessage,
  removeSignature,
} from 'src/utils/functions';
import { COLORS, ROLE } from '../utils/constants';
import { Wp } from '../utils/dimensions';
import AvatarInitials from './AvatarInitials';
import useApi from 'src/axios/useApi';
import { EndPoint } from 'src/ApiManager/config';
import { FlashMessageComponent } from './FlashMessageComponent/FlashMessageComponent';

interface HeaderProfileSwitcherProps {
  rightImageStyle?: StyleProp<ImageStyle>;
  isDarkTheme?: boolean;
  hasGradient?: boolean;
}

const HeaderProfileSwitcher: React.FC<HeaderProfileSwitcherProps> = ({
  isDarkTheme,
}) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const dispatch = useDispatch();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { apiRequest, loading, error } = useApi();

  const backgroundColor = isDarkTheme ? COLORS.black2 : COLORS.white;

  const [isRolesExpanded, setIsRolesExpanded] = useState<boolean>(false);
  const [isSecondRoleShown, setIsSecondRoleShown] = useState<boolean>(false);
  const [switchingRole, setSwitchingRole] = useState<'first' | 'second' | ''>();

  const { roles, role, profileData, companyLogo, profilePicture, userId } =
    useSelector(
      (state: RootState) => ({
        profileData: state.appFlowApiData?.profileData,
        role: state.auth.role,
        roles: state.auth.roles,
        companyLogo: state.auth.companyLogo,
        profilePicture: state.auth.profilePicture,
        userId: state.auth.userId,
      }),
      shallowEqual,
    );

  const name = profileData?.firstName
    ? `${profileData?.firstName} ${profileData?.lastName}`
    : '';

  const profilePhoto =
    role?.toLocaleLowerCase() === 'host' ? companyLogo : profilePicture;

  const isHostActive = (roles) => {
    const host = roles?.find(member => member.roleName === 'host');
    return host?.roleStatus === 'ACTIVE';
  }

  const toggleRole = async (newRole: role) => {
    const isHostHasActiveRole = isHostActive(roles)

    if (roles.length > 1 && isHostHasActiveRole) {
      setIsRolesExpanded(!isRolesExpanded);
      if (isRolesExpanded) {
        if (newRole.roleName !== role) {
          try {
            const response: any = await apiRequest(
              'post',
              `${EndPoint.switch_profile}/${userId}`,
              { targetRole: newRole.roleName },
            );
            if (response.success) {
              let newRoleName =
                newRole?.roleName === 'non_member'
                  ? 'Non-Member'
                  : newRole?.roleName === 'host'
                    ? 'Host'
                    : 'Member';
              FlashMessageComponent.show(
                `success`,
                `Switched to ${newRoleName} Account`,
              );
              const myRole = response?.data?.roles[0] || newRole;
              setIsRolesExpanded(false);
              dispatch(setRole(myRole.roleName));
              dispatch(setRoleId(myRole.roleId));
              dispatch(setAuthToken(response?.data?.token));
              fetchUserProfile();
            }
          } catch (error) {
            const typedError = error as ApiErrorInterface;
            const errorMessage = getErrorMessage(typedError);
            if (errorMessage === 'User does not have the requested role.') {
              if (newRole?.roleName === 'non_member') {
                toggleRole({ ...newRole, roleName: 'member' })
              }
            } else {
              FlashMessageComponent.show('error', errorMessage);
            }
            console.log(errorMessage);
          } finally {
            setSwitchingRole('');
          }
        }
      }
    } else {
      navigation.navigate(ROUTES.ProfileScreen);
      setSwitchingRole('');
    }
  };

  const AvatarWithLoading = ({
    photo,
    index,
    position,
    switching,
  }: {
    photo: string | undefined;
    index: number;
    position: 'first' | 'second';
    switching: boolean;
  }) => {
    return (
      <View>
        <AvatarInitials
          name={name}
          size={48}
          imgUrl={removeSignature(photo) || ''}
          onPress={() => {
            setSwitchingRole(position);
            toggleRole(roles[index]);
          }}
        />
        {switching ? (
          <ActivityIndicator style={styles.loading} color={COLORS.white} />
        ) : null}
      </View>
    );
  };

  useEffect(() => {
    if (isRolesExpanded) {
      setIsSecondRoleShown(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      setIsSecondRoleShown(false);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isRolesExpanded]);

  useEffect(() => {
    if (isRolesExpanded) {
      setTimeout(() => {
        setIsRolesExpanded(false);
      }, 5000);
    }
  }, [isRolesExpanded]);

  return (
    <Animated.View
      style={[
        styles.profileButtonContainer,
        {
          width: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [58, 120],
          }),
        },
        isRolesExpanded && {
          justifyContent: 'space-between',
        },
        !isRolesExpanded && {
          backgroundColor: backgroundColor,
        },
      ]}>
      <AvatarWithLoading
        index={0}
        photo={
          isRolesExpanded
            ? roles[0].roleName === ROLE.HOST
              ? companyLogo
              : profilePicture
            : profilePhoto
        }
        position="first"
        switching={loading && switchingRole === 'first'}
      />

      <Animated.View
        style={[
          styles.avatarContainer,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0],
                }),
              },
            ],
          },
        ]}>
        {isSecondRoleShown && (
          <AvatarWithLoading
            index={1}
            photo={
              roles[1].roleName === ROLE.HOST ? companyLogo : profilePicture
            }
            position="second"
            switching={loading && switchingRole === 'second'}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Wp(100),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    marginHorizontal: 5,
    backgroundColor: COLORS.tabBorderColor,
  },
  profileButtonContainer: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: COLORS.lighter_gray,
    overflow: 'hidden',
  },
  avatarContainer: {},
  imgStyle: {
    resizeMode: 'contain',
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HeaderProfileSwitcher;
