import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyDetailsScreen from '../screens/AppFlow/MyDetails/MyDetails';
import EnterEmailPhone from '../screens/AppFlow/EnterEmailPhone/EnterEmailPhone';
import VerifyEmail from '../screens/AppFlow/VerifyOtp/VerifyOtp';
import GenderScreen from '../screens/AppFlow/GenderScreen/GenderScreen';
import BirthdayScreen from '../screens/AppFlow/BirthdayScreen/BirthdayScreen';
import BaseCityScreen from '../screens/AppFlow/BaseCityScreen/BaseCityScreen';
import CreativeFocusScreen from '../screens/AppFlow/CreativeFocusScreen/CreativeFocusScreen';
import SelectInterestScreen from '../screens/AppFlow/SelectInterestScreen/SelectInterestScreen';
import ProfilePhotoScreen from '../screens/AppFlow/ProfilePhotoScreen/ProfilePhotoScreen';
import IdentityVerification from '../screens/AppFlow/IdentityVerification/IdentityVerification';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/slices';


// Define the param list for the stack navigator
export type AppFlowStackParamList = {
  MyDetailsScreen: undefined;
  EnterEmailPhone: undefined;
  GenderScreen: undefined;
  BirthdayScreen: undefined;
  BaseCityScreen: undefined;
  CreativeFocusScreen: undefined;
  SelectInterestScreen: undefined;
  ProfilePhotoScreen: undefined;
  IdentityVerification: undefined;
  
};

const Stack = createStackNavigator<AppFlowStackParamList>();

export const AppFlowStack: React.FC = () => {
  const pageProgress = useSelector((state: RootState) => state.appFlow.pageProgress);

  const getInitialPage=()=>{
     switch(pageProgress){
      case 1: return "MyDetailsScreen";
      case 2 : return "EnterEmailPhone";
      case 3 : return "GenderScreen";
      case 4 : return "BirthdayScreen";
      case 5 : return "BaseCityScreen";
      case 6 : return "CreativeFocusScreen";
      case 7 : return "SelectInterestScreen";
      case 8 : return "ProfilePhotoScreen";
      case 9 : return "IdentityVerification";
      default : return "MyDetailsScreen"
     }
  }
  return (
    <Stack.Navigator
      initialRouteName={getInitialPage()}
      screenOptions={({ route, navigation }) => ({})}>

      <Stack.Screen
        name="MyDetailsScreen"
        component={MyDetailsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="EnterEmailPhone"
        component={EnterEmailPhone}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="GenderScreen"
        component={GenderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BirthdayScreen"
        component={BirthdayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BaseCityScreen"
        component={BaseCityScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreativeFocusScreen"
        component={CreativeFocusScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SelectInterestScreen"
        component={SelectInterestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePhotoScreen"
        component={ProfilePhotoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IdentityVerification"
        component={IdentityVerification}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
