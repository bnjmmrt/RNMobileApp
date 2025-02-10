import React, {useEffect, useState} from 'react';
import {MainStack} from './MainStack';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/slices';
import {apiPost} from '../ApiManager/MainApi';
import {View, ActivityIndicator} from 'react-native'; // Import ActivityIndicator for loading state

const MainNavigation: React.FC = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const isVerified = loginData?.varifyStatus || 0;

  const [initialAppStackScreen, setInitialAppStackScreen] =
    useState<string>('BottomTabBar');
  const [initialRouteName, setInitialRouteName] = useState<
    'AuthStack' | 'AppStack' | 'WelcomeScreen'
  >('AuthStack');
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res: any = await apiPost('/auth/get-user-with-roles-by-id', {
          id: loginData.id,
        });

        const userInfo = res.data.data;

        if (isVerified === 0) {
          setInitialRouteName('AuthStack');
        } else if (
          (userInfo.roles[0].name === 'member' ||
            userInfo.roles[0].status === 'ACTIVE') &&
          !userInfo.isFirstTimeLoggedIn
        ) {
          setInitialRouteName('WelcomeScreen');
        } else {
          setInitialRouteName('AppStack');
        }

        if (
          userInfo.roles[0].name !== 'non_member' &&
          loginData?.token?.length === 0
        ) {
          setInitialAppStackScreen('BeforeAppStaticScreen');
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [loginData.id, isVerified]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <MainStack
      initialRouteName={initialRouteName}
      initialParams={
        initialRouteName === 'AppStack'
          ? {screen: initialAppStackScreen}
          : undefined
      }
    />
  );
};

export default MainNavigation;
