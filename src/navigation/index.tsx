import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { AuthStack } from './AuthStack';
import { OnboardingStack } from './OnboardingStack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';
import BottomTabBar from '../component/Tabbar/BottomTabBar';
import { AppStack } from './AppStack';
import { AppFlowStack } from './AppFlowStack';

const MainNavigation: React.FC = () => {
  const loginData = useSelector((state: RootState) => state.auth.loginData);
  console.log("Login Data:", loginData)

  const [isVerified, setVerified] = useState<number>(loginData?.varifyStatus || 0);

  if (isVerified === 0) {
    return <AuthStack />;
  }

  if (loginData.isSignUpCompleted || loginData.isInvited || loginData.token.length > 0) {
    return <OnboardingStack />;
  }

  return <AppStack />;
};

export default MainNavigation;
