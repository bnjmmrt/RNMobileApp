import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {Platform, View} from 'react-native';
import {shallowEqual, useSelector} from 'react-redux';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import EventsFeed from '../../component/EventsFeed/EventsFeed';
import {RootState} from '../../redux/slices';
import {COLORS} from '../../utils/constants';
import DiscoverScreenStyle from './DiscoverScreenStyle';
import BeforeAppStaticComponent from 'src/component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import { useFocusEffect } from '@react-navigation/native'
import { changeSafeAreaViewConfig } from 'src/utils/functions'
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig'

// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> {}

const DiscoverScreen: React.FC<DiscoverScreenProps> = () => {
  // Access login data from Redux store
  const role = useSelector((state: RootState) => state.auth.role);

  // Memoize styles to avoid unnecessary recalculations
  const styles = useMemo(() => DiscoverScreenStyle(), []);
  const isNotMember = role == 'non_member';
  // const hasFullAccess = isSignUpCompleted || token.length > 0;

  const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 24;

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig({
        ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
        showTopSafeAreaView: false,
        showBottomSafeAreaView: false,
      });
    }, []),
  );

  const isGuest = useSelector(
    (state: RootState) => state.auth.isGuest,
    shallowEqual,
  );

  if (isGuest) {
    return <BeforeAppStaticComponent isChatScreen={false} />;
  }

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isNotMember ? COLORS.black2 : COLORS.white,
      }}>
      {!isNotMember ? <EventsFeed /> : (
        isGuest ? <BeforeAppStaticComponent isChatScreen={false} /> : <AfterAppStaticComponent />
      )}
    </View>
  );
};

export default DiscoverScreen;
