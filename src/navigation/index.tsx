import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { AuthStack } from './AuthStack';
import { AppFlowStack } from './AppFlowStack';

const MainNavigation: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return isLoggedIn ? null : <AuthStack />;
};

export default MainNavigation;
