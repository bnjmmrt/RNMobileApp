import React from 'react';
import { MainStack } from './MainStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';

const MainNavigation: React.FC = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  const isVerified = loginData?.varifyStatus || 0;
  const role =
    (loginData?.roles &&
      loginData?.roles.length > 0 &&
      loginData?.roles[0]?.roleName) ||
    'non_member';

  const initialRouteName = isVerified === 0 ? 'AuthStack' : 'AppStack';

  const initialAppStackScreen =
    role === 'non_member'
      ? loginData?.token?.length > 0
        ? 'BottomTabBar'
        : 'BeforeAppStaticScreen'
      : 'BottomTabBar';

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
