import React, { useCallback } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { View } from 'react-native';
import IMAGES from '../../assets/images';
import { Hp, Wp } from '../../utils/dimensions';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import { resetLoginData } from 'src/redux/slices/authSlice';
import { useDispatch } from 'react-redux';

interface BeforeAppStaticScreenProps extends NativeStackScreenProps<any, any> { }

const BeforeAppStaticScreen: React.FC<BeforeAppStaticScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();


  // useFocusEffect(
  //   useCallback(() => {
  //     changeSafeAreaViewConfig({ ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME });
  //     return () => {
  //       // Optional cleanup when screen is unfocused
  //       // changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
  //     };
  //   }, [])
  // );

  const redirectToHome = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
    dispatch(resetLoginData());
    navigation.dispatch(resetAction);
  }
  return (
    <SafeAreaView style={styles.container}>

      <BeforeAppStaticComponent
        isChatScreen={false} />

      <TouchableOpacity onPress={redirectToHome} style={{ top: 60, right: Wp(5), position: 'absolute' }}>
        <View style={styles.iconWrapper}>
          <Image source={IMAGES.cross} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Shadow on Android
  },
});

export default BeforeAppStaticScreen;
