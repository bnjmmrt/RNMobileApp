import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import EventsFeed from '../../component/EventsFeed/EventsFeed';
import {RootState} from '../../redux/slices';
import {COLORS} from '../../utils/constants';
import DiscoverScreenStyle from './DiscoverScreenStyle';

// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> {}

const DiscoverScreen: React.FC<DiscoverScreenProps> = () => {
  // Access login data from Redux store
  const {isSignUpCompleted, token, isInvited, roles} = useSelector(
    (state: RootState) => state.auth.loginData,
  );

  // Memoize styles to avoid unnecessary recalculations
  const styles = useMemo(() => DiscoverScreenStyle(), []);
  const isMember = roles[0]?.roleName == 'member';
  console.log('Sayyed roles:', roles);
  const hasFullAccess = isSignUpCompleted || token.length > 0;

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(
        isMember
          ? SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME
          : SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
      );
    }, []),
  );

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isMember ? COLORS.white : COLORS.black2,
      }}>
      {isMember ? (
        <EventsFeed />
      ) : (
        <AfterAppStaticComponent
        // title={LABLE.YOU_ARE_ON_WAITLIST}
        // subTitle={LABLE.FULL_ACCESS_UNLOCK}
        />
      )}
    </View>
  );
};

export default DiscoverScreen;
