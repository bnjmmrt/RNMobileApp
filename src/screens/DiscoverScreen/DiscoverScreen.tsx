import React, { useMemo } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LABLE } from '../../utils/constants';
import DiscoverScreenStyle from './DiscoverScreenStyle';
import { SafeAreaView } from 'react-native';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import { useSelector } from 'react-redux';
import EventsFeed from '../../component/EventsFeed/EventsFeed';
import { RootState } from '../../redux/slices';

// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> {}

const DiscoverScreen: React.FC<DiscoverScreenProps> = () => {
  // Access login data from Redux store
  const { isSignUpCompleted, token, isInvited } = useSelector((state: RootState) => state.auth.loginData);

  // Memoize styles to avoid unnecessary recalculations
  const styles = useMemo(() => DiscoverScreenStyle(), []);

  const hasFullAccess = isSignUpCompleted || token.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {!isInvited ?
        <EventsFeed />
        :
        <AfterAppStaticComponent
          title={LABLE.YOU_ARE_ON_WAITLIST}
          subTitle={LABLE.FULL_ACCESS_UNLOCK} />
      }
    </SafeAreaView>
  );
};

export default DiscoverScreen;
