import { CommonActions, RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { resetLoginData } from 'src/redux/slices/authSlice';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import IMAGES from '../../assets/images';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { COLORS } from '../../utils/constants';
import {
  horizontalMarginScale,
  verticalMarginScale,
  Wp,
} from '../../utils/dimensions';

interface BeforeAppStaticScreenProps extends NativeStackScreenProps<any, any> { }


const BeforeAppStaticScreen: React.FC<BeforeAppStaticScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const [isFromProfile, setIsFromProfile] = useState(route?.params?.isFromProfile || false)


  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.BLACK_SCHEME);
    }, []),
  );

  const redirectToHome = () => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'AuthStack' }],
    });
    dispatch(resetLoginData());
    navigation.dispatch(resetAction);
  };

  return (
    <View style={styles.container}>
      <BeforeAppStaticComponent isChatScreen={false} />

      {!isFromProfile && <TouchableOpacity
        onPress={redirectToHome}
        style={{
          top: horizontalMarginScale(20),
          right: horizontalMarginScale(20),
          position: 'absolute',
        }}>
        <View style={styles.iconWrapper}>
          <Image source={IMAGES.cross} />
        </View>
      </TouchableOpacity>}

      {isFromProfile && <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          top: horizontalMarginScale(20),
          left: horizontalMarginScale(20),
          position: 'absolute',
        }}>
        <View style={styles.iconWrapper}>
          <Image source={IMAGES.leftArrow} />
        </View>
      </TouchableOpacity>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Shadow on Android
  },
});

export default BeforeAppStaticScreen;
