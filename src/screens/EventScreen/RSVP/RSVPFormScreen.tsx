import IMAGES from '@images/index';
import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Button from 'src/component/Button';
import Header from 'src/component/Header/Header';
import Toast from 'src/component/Toast/Toast';
import {
  BUTTON_LABLE,
  COLORS,
  EVENT_STATUS,
  LABLE,
  PROFILE,
} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

const EventCard = () => {
  return (
    <View style={styles.card}>
      <Image source={IMAGES.frame} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>Revolve Festival</Text>
        <Text style={styles.details}>Fri, April 13, 9:00PM - 11:00PM EST</Text>
        <Text style={styles.details}>Los Angeles, California</Text>
      </View>
    </View>
  );
};

const StatusBanner = () => {
  return (
    <View style={styles.statusBanner}>
      <Image source={IMAGES.tickInvited} />
      <Text style={styles.statusText}> {EVENT_STATUS.INVITED}</Text>
    </View>
  );
};

const RSVPFormScreen = () => {
  const navigation = useNavigation();
  const [isToastShown, setIsToastShown] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const submit = () => {
    // Show the toast
    setIsToastShown(true);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* HEADER + SCROLL CONTENT */}
      <Header
        headerTitle={BUTTON_LABLE.RSVP}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <ScrollView style={{flex: 1}}>
        <EventCard />
        <StatusBanner />

        <View style={[styles.card, {flexDirection: 'column'}]}>
          <View>
            <Text>Would you like to attend the event?</Text>
          </View>
          <View style={styles.rsvpButtonsRow}>
            <Button
              disabled={false}
              title={BUTTON_LABLE.YES}
              onPress={submit}
              clearButtonStyle={styles.clearButton}
            />
            <Button
              disabled={false}
              title={BUTTON_LABLE.NO}
              onPress={submit}
              clearButtonStyle={styles.clearButton}
            />
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BUTTON */}
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.UPDATE_APPLICATION}
        colorTheme="dark"
        onPress={submit}
      />

      {/* ABSOLUTE TOAST */}
      {isToastShown && (
        <View style={styles.toastWrapper}>
          <Toast
            message={'Please select at least one'}
            onClose={() => setIsToastShown(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginVertical: verticalMarginScale(16),
    marginHorizontal: horizontalMarginScale(12),
    padding: verticalMarginScale(10),
    borderRadius: radiusScale(10),
    borderWidth: horizontalScale(1),
    borderColor: COLORS.lighter_gray,
  },
  image: {
    width: horizontalScale(80),
    height: verticalScale(110),
    borderRadius: radiusScale(10),
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E7F1F5',
    padding: verticalMarginScale(12),
    borderRadius: radiusScale(8),
    marginVertical: verticalMarginScale(16),
    marginHorizontal: horizontalMarginScale(12),
  },
  statusText: {
    fontSize: fontScale(14),
    color: COLORS.black,
    marginLeft: verticalScale(5),
    flex: 1,
  },
  info: {
    marginLeft: horizontalMarginScale(10),
    justifyContent: 'center',
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: '700',
    fontFamily: fontFamily.RomieTrial_Bold,
  },
  details: {
    fontSize: fontScale(14),
    color: 'gray',
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: radiusScale(100),
    alignSelf: 'center',
    marginVertical: verticalMarginScale(10),
  },
  clearButton: {
    borderWidth: 1.5,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lighter_gray,
    width: '48%',
  },
  rsvpButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
  },
  toastWrapper: {
    position: 'absolute',
    bottom: 80, // Adjust as needed to appear above the bottom button
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default RSVPFormScreen;
