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
import {
  LABLE,
  BUTTON_LABLE,
  COLORS,
  ERROR_MESSAGE,
} from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import {useFocusEffect} from '@react-navigation/native';
import {changeSafeAreaViewConfig} from 'src/utils/functions';
import {SAFEWAREAVIEW_CONFIG} from 'src/utils/safeAreaViewConfig';
import ProfileCard from './ProfileCard';
import CheckInComponent from './CheckInComponent';
import EmptyRecordComponent from 'src/component/EmptyRecord/EmptyRecordComponent';
import IMAGES from '@images/index';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import AvatarInitials from 'src/component/AvatarInitials';

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
      {true ? (
        <ScrollView style={styles.container}>
          <ProfileCard />
          <View style={styles.card}>
            <AvatarInitials size={32} name="Anurag Harod" />
            <View style={{paddingLeft: verticalMarginScale(8)}}>
              <Text style={styles.blurText}>Guest of</Text>
              <Text style={styles.username}>Aurang</Text>
            </View>
          </View>
          <CheckInComponent />
        </ScrollView>
      ) : (
        <EmptyRecordComponent
          title={LABLE.USER_NOT_FOUND}
          subTitle={ERROR_MESSAGE.TCKET_ERROR_MESSAGE}
          btnShown={true}
          btnIcon={IMAGES.searchWhite}
          btnLabel={LABLE.SEARCH_USERS}
        />
        // <EmptyRecordComponent
        //   title={LABLE.USER_ALREADY_CHECKED_IN}
        //   subTitle={ERROR_MESSAGE.TCKET_ERROR_MESSAGE}
        //   btnShown={true}
        //   btnIcon={IMAGES.profileWhite}
        //   btnLabel={LABLE.MANAGE_GUESTS}
        // />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 10,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(16),
    paddingHorizontal: horizontalMarginScale(16),
    paddingVertical: verticalMarginScale(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(16),
  },
  username: {
    fontSize: fontScale(14),
    fontWeight: '500',
  },
  blurText: {color: COLORS.light_gray, fontSize: fontScale(11)},
});
export default GuestCheckInScreen;
