import React, { useEffect, useState } from 'react';
import { MainStack } from './MainStack';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import { apiPost } from '../ApiManager/MainApi';
import { View, ActivityIndicator } from 'react-native'; // Import ActivityIndicator for loading state
import { COLORS, ROLE } from 'src/utils/constants';
import { ROUTES } from './Route';

const MainNavigation: React.FC = () => {
  // const loginData = useSelector((state: RootState) => state.auth.loginData);
  // const isVerified = loginData?.varifyStatus || 0;

  // const [initialAppStackScreen, setInitialAppStackScreen] =
  //   useState<string>('BottomTabBar');
  // const [initialRouteName, setInitialRouteName] = useState<
  //   'AuthStack' | 'AppStack' | 'WelcomeScreen'
  // >('AuthStack');
  // const [loading, setLoading] = useState<boolean>(true); // Loading state

  // useEffect(() => {
  //   const fetchRoles = async () => {
  //     try {
  //       const res: any = await apiPost('/auth/get-user-with-roles-by-id', {
  //         id: loginData.id,
  //       });

  //       const userInfo = res.data.data;

  //       if (isVerified === 0) {
  //         setInitialRouteName('AuthStack');
  //       } else if (
  //         (loginData.roles[0].roleName === 'member' ||
  //           userInfo.roles[0].status === 'ACTIVE') &&
  //         !userInfo.isFirstTimeLoggedIn
  //       ) {
  //         setInitialRouteName('WelcomeScreen');
  //       } else {
  //         setInitialRouteName('AppStack');
  //       }

  //       if (
  //         userInfo.roles[0].name === 'non_member' &&
  //         loginData?.token?.length === 0 &&
  //         !loginData?.token?.id
  //       ) {
  //         setInitialAppStackScreen('BeforeAppStaticScreen');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user roles:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRoles();
  // }, [loginData.id, isVerified]);

  // if (loading) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size="large" color="#ffffff" />
  //     </View>
  //   );
  // }

  const { isGuest, varifyStatus, role, token } = useSelector(
    (state: RootState) => ({
      isGuest: state.auth.isGuest,
      role: state.auth.role,
      varifyStatus: state.auth.varifyStatus,
      token: state.auth.token,
    }),
    shallowEqual,
  );

  const isVerified = varifyStatus || 0;
  const initialRouteName = isVerified === 0 ? 'AuthStack' : 'AppStack';

  let initialAppStackScreen = '';

  if (role === ROLE.NON_MEMBER) {
    if (token?.length > 0 || isGuest) {
      initialAppStackScreen = ROUTES.BottomTabBar;
    } else {
      initialAppStackScreen = ROUTES.BeforeAppStaticScreen;
    }
  } else {
    initialAppStackScreen = ROUTES.BottomTabBar;
  }

  if (!initialAppStackScreen) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.black} size={'large'} />
      </View>
    );
  }
  return (
    <MainStack
      initialRouteName={initialRouteName}
      initialParams={
        initialRouteName === 'AppStack'
          ? { screen: initialAppStackScreen }
          : undefined
      }
    />
  );
};

export default MainNavigation;
