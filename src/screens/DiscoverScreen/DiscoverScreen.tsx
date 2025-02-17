import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import AfterAppStaticComponent from '../../component/BeforeAppStaticComponent/AfterAppStaticComponent';
import EventsFeed from '../../component/EventsFeed/EventsFeed';
import {RootState} from '../../redux/slices';
import {COLORS} from '../../utils/constants';
import DiscoverScreenStyle from './DiscoverScreenStyle';

// Define the type for navigation props
interface DiscoverScreenProps extends NativeStackScreenProps<any, any> {}

const DiscoverScreen: React.FC<DiscoverScreenProps> = () => {
  // Access login data from Redux store
  const role = useSelector((state: RootState) => state.auth.role);

  // Memoize styles to avoid unnecessary recalculations
  const styles = useMemo(() => DiscoverScreenStyle(), []);
  const isNotMember = role == 'non_member';
  // const hasFullAccess = isSignUpCompleted || token.length > 0;

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isNotMember ? COLORS.black2 : COLORS.white,
      }}>
      {!isNotMember ? (
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
