import React from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { View } from 'react-native';
import IMAGES from '@images/index';
import { Hp, Wp } from 'src/utils/dimensions';
import { CommonActions } from '@react-navigation/native';

interface BeforeAppStaticScreenProps extends NativeStackScreenProps<any, any> { }

const BeforeAppStaticScreen: React.FC<BeforeAppStaticScreenProps> = ({ navigation }) => {

  const redirectToHome = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
    navigation.dispatch(resetAction);

  }
  return (
    <SafeAreaView style={styles.container}>



      <BeforeAppStaticComponent
        isChatScreen={false}
        showLogout={true} />

      <TouchableOpacity onPress={redirectToHome} style={{ top: Hp(8), right: Wp(5), position: 'absolute' }}>
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
