import React, { useCallback, useMemo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE } from '../../utils/constants';
import DiscoverScreenStyle from './DiscoverScreenStyle';
import { SafeAreaView, View } from 'react-native';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/slices';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> { }

const DiscoverScreen: React.FC<DiscoverScreenProps> = () => {
  // Access login data from Redux store
  const { isSignUpCompleted, token } = useSelector((state: RootState) => state.auth.loginData);

  // Memoize styles to avoid unnecessary recalculations
  const styles = useMemo(() => DiscoverScreenStyle(), []);

  const hasFullAccess = isSignUpCompleted || token.length > 0;

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.BLACK_SCHEME);

      return () => {
        // Optional cleanup when screen is unfocused
        changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
      };
    }, [])
  );
  return (
    <View style={styles.container}>
      {hasFullAccess ? (
        <AfterAppStaticComponent />
      ) : (
        <BeforeAppStaticComponent isChatScreen={false} />
      )}
    </View>
  );
};

export default DiscoverScreen;
