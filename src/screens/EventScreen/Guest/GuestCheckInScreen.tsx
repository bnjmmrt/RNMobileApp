import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LABLE, BUTTON_LABLE, COLORS} from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import {useFocusEffect} from '@react-navigation/native';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import ProfileCard from './ProfileCard';
import CheckInComponent from './CheckInComponent';

interface GuestCheckInScreenProps extends NativeStackScreenProps<any, any> {}

const GuestCheckInScreen: React.FC<GuestCheckInScreenProps> = ({
  navigation,
  route,
}) => {
  useEffect(() => {}, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={LABLE.CHECK_IN}
        onPress={handleBackPress}
        showProgressBar={false}
      />
      <ScrollView style={styles.container}>
        <ProfileCard />
        <CheckInComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
});
export default GuestCheckInScreen;
