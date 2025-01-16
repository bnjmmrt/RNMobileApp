import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { AuthStack } from './AuthStack';
import { OnboardingStack } from './OnboardingStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import { AppStack } from './AppStack';

const MainNavigation: React.FC = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  console.log("sayyed logg:",loginData)

  const [isLoggedIn, setIsLoggedIn] = useState<number>(loginData?.varifyStatus || 0);

  return isLoggedIn == 0 ? <AuthStack /> : <AppStack />;
};

export default MainNavigation;
