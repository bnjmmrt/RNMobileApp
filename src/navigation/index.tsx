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
  console.log("Login Data:",loginData)

  const [isVerified, setVerified] = useState<number>(loginData?.varifyStatus || 0);
  const [isInvited, setInvited] = useState<number>(loginData?.isInvited);


  return isVerified == 0 ? <OnboardingStack /> : isInvited ? <OnboardingStack /> : <OnboardingStack />;
};

export default MainNavigation;
