import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import EventsFeed from '../../component/EventsFeed/EventsFeed';
import { RootState } from '../../redux/slices';
import { COLORS, ROLE } from '../../utils/constants';
import DiscoverScreenStyle from './DiscoverScreenStyle';
import BeforeAppStaticComponent from 'src/component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { useFocusEffect } from '@react-navigation/native';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> { }

const DiscoverScreen: React.FC<DiscoverScreenProps> = () => {
  // Access login data from Redux store
  const role = useSelector((state: RootState) => state.auth.role);
  const token = useSelector((state: RootState) => state.auth.token);
  const styles = useMemo(() => DiscoverScreenStyle(), []);

  useFocusEffect(
    useCallback(() => {
      if (role == ROLE.MEMBER) {
        changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME,
          statusBarStyle: 'dark-content',
          // showTopSafeAreaView: false,
          // showBottomSafeAreaView: false,
        });

        // if (isNotMember && !isGuest) {
        //   // Update status bar when AfterAppStaticComponent is active
        //   StatusBar.setBarStyle('light-content');
        //   StatusBar.setBackgroundColor('transparent');
        // } else {
        //   console.log('DiscoverScreen else', isGuest, token, role);

        //   StatusBar.setBarStyle('dark-content');
        // }
      }
    }, [role]),
  );

  if (role == ROLE.NON_MEMBER) {
    if (token) {
      return <AfterAppStaticComponent />
    }
    else {
      return <BeforeAppStaticComponent isChatScreen={false} />
    }
  }

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <EventsFeed />
    </View>
  );
};

export default DiscoverScreen;
