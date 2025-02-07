import IMAGES from '@images/index';
import {useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import ConfirmationBottomSheet from 'src/component/BottomSheet/ConfirmationBottomSheet';
import ListComponentBottomSheet from 'src/component/BottomSheet/ListComponentBottomSheet';
import Button from 'src/component/Button';
import CustomSelectableText from 'src/component/CustomSelectableText/CustomSelectableText';
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

const SwapDeleteComponent = () => {
  return (
    <View style={styles.swapDeletecontainer}>

      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{'IF'}</Text>
      </View>
  
      <Text style={styles.name}>{'Anurag Harod'}</Text>
    </View>
  );
};

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

const reasons = [
  {id: 1, name: 'Scheduling Conflict'},
  {id: 2, name: 'Prior Commitment'},
  {id: 3, name: 'Traveling'},
  {id: 4, name: 'Event Location Inconvenient'},
  {id: 5, name: 'Not Interested in This Event'},
  {id: 6, name: 'Too Short of Notice'},
  {id: 7, name: 'Weather Concerns'},
  {id: 8, name: 'Other'},
];
const guests = [
  {id: 0, name: 'No Guests'},
  {id: 1, name: 'Guest 1'},
  {id: 2, name: 'Guest 2'},
  {id: 3, name: 'Guest 3'},
  {id: 4, name: 'Guest 4'},
];
const RSVPFormScreen = () => {
  const navigation = useNavigation();
  const [isToastShown, setIsToastShown] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showYesOptionDropdown, setYesOptionDropdown] = useState(false);
  const [selectedReason, setSelectedReason] = useState<any>({});
  const [selectedGuest, setSelectedGuest] = useState<any>(guests[0]);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const reasonsRef = useRef<any>(null);
  const guestRef = useRef<any>(null);
  const confirmationRef = useRef<any>(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const onNoClick = () => {
    setSelectedButton('No');
    setShowDropdown(true);
    setYesOptionDropdown(false);
  };
  const onYesClick = () => {
    setSelectedButton('Yes');
    setShowDropdown(false);
    setYesOptionDropdown(true);
  };
  const onClickReason = () => {
    reasonsRef?.current.open();
  };

  const onClickGuest = () => {
    guestRef?.current.open();
  };
  const onAddGuest = () => {
    //contact logic

    navigation.navigate('AddGuestOptionScreen');
  };
  const submit = () => {
    if (selectedButton === null) {
      setIsToastShown(true);
    } else {
      confirmationRef.current.open();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={BUTTON_LABLE.RSVP}
        onPress={handleBackPress}
        showProgressBar={false}
      />

      <ScrollView style={styles.scrollContainer}>
        <EventCard />
        <StatusBanner />

        <View style={[styles.card, {flexDirection: 'column'}]}>
          <View>
            <Text style={styles.info}>Would you like to attend the event?</Text>
          </View>
          <View style={styles.rsvpButtonsRow}>
            <Button
              disabled={false}
              title={BUTTON_LABLE.YES}
              onPress={onYesClick}
              style={
                selectedButton == 'Yes'
                  ? styles.smallButton
                  : styles.clearButton
              }
              clearButtonStyle={
                selectedButton == 'No' ? styles.clearButton : styles.smallButton
              }
              colorTheme={selectedButton == 'Yes' ? 'dark' : 'white'}
            />
            <Button
              disabled={false}
              title={BUTTON_LABLE.NO}
              onPress={onNoClick}
              style={
                selectedButton == 'No' ? styles.smallButton : styles.clearButton
              }
              clearButtonStyle={
                selectedButton == 'Yes'
                  ? styles.clearButton
                  : styles.smallButton
              }
              colorTheme={selectedButton == 'No' ? 'dark' : 'white'}
            />
          </View>
        </View>
        {showDropdown && (
          <View style={{padding: verticalMarginScale(12)}}>
            <Text style={styles.label}>Why can’t you attend?</Text>
            <CustomSelectableText
              placeholder={'Select...'}
              rightImage={IMAGES.downArrow}
              errorMessage={''}
              defaultValue={selectedReason?.name}
              onPress={onClickReason}
              style={{marginTop: verticalMarginScale(4)}}
            />
            <Text style={styles.infoText}>{LABLE.RSVP_TEXT}</Text>
          </View>
        )}
        {showYesOptionDropdown && (
          <>
            <View>
              <Text style={[styles.infoText, {color: COLORS.black}]}>
                {LABLE.RSVP_QUESTION_DETAILS}
              </Text>
              <CustomSelectableText
                placeholder={'No Guest'}
                rightImage={IMAGES.downArrow}
                errorMessage={''}
                defaultValue={selectedGuest?.name}
                onPress={onClickGuest}
                style={styles.customSelectText}
              />
            </View>
            {selectedGuest?.name != guests[0]?.name && (
               <>
                <SwapDeleteComponent />
                <Button
                  disabled={false}
                  style={[styles.clearButton, styles.btnBorder]}
                  title={BUTTON_LABLE.ADD_GUEST_DETAILS}
                  colorTheme="white"
                  onPress={onAddGuest}
                />
              </>
            )}
          </>
        )}

        <ListComponentBottomSheet
          ref={reasonsRef}
          list={reasons}
          selectedItem={setSelectedReason}
          snapPoints={[Platform.OS === 'android' ? '65%' : '60%']}
        />
        <ListComponentBottomSheet
          ref={guestRef}
          list={guests}
          selectedItem={setSelectedGuest}
          snapPoints={[Platform.OS === 'android' ? '45%' : '40%']}
        />
        <ConfirmationBottomSheet
          ref={confirmationRef}
          title={LABLE.WE_WERE_SORRY_CANT_MAKE_IT}
          subTitle={LABLE.RSVP_SUBTITLE}
          status={LABLE.YOU_DECLINED_THIS_INVITATION}
          btnLabel={LABLE.DISCOVER_MORE_EVENTS}
          snapPoints={[Platform.OS === 'android' ? '40%' : '38%']}
          btnStyle={[styles.clearButton, styles.btnBorder]}
        />
      </ScrollView>
      {showYesOptionDropdown && (
        <Text style={[styles.infoText, styles.bottomText]}>
          {LABLE.RSVP_INSTRUCTION}
        </Text>
      )}
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.SUBMIT}
        colorTheme="dark"
        onPress={submit}
      />
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
  container: {flex: 1, padding: verticalMarginScale(10)},
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    // marginHorizontal: horizontalMarginScale(12),
    padding: verticalMarginScale(10),
    borderRadius: radiusScale(10),
    borderWidth: horizontalScale(1),
    borderColor: COLORS.lighter_gray,
  },
  scrollContainer: {
    marginVertical: verticalMarginScale(16),
    paddingHorizontal: 16,
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
    // marginHorizontal: horizontalMarginScale(12),
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
  infoText: {
    marginTop: verticalScale(16),
    fontSize: fontScale(12),
    color: COLORS.light_gray,
    lineHeight: verticalScale(14),
  },
  bottomText: {paddingHorizontal: verticalMarginScale(12), textAlign: 'center'},
  label: {
    fontSize: fontScale(14),
    fontWeight: '500',
    marginTop: verticalMarginScale(2),
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: radiusScale(100),
    alignSelf: 'center',
    marginVertical: verticalMarginScale(10),
  },
  clearButton: {
    borderWidth: horizontalScale(1.5),
    backgroundColor: COLORS.white,
    borderColor: COLORS.lighter_gray,
    width: '48%',
    height: verticalScale(50),
  },
  btnBorder: {
    width: '100%',
    borderWidth: horizontalScale(1.5),
    borderColor: COLORS.black,
  },
  smallButton: {
    width: '48%',
  },
  rsvpButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: verticalMarginScale(12),
  },
  toastWrapper: {
    position: 'absolute',
    bottom: verticalMarginScale(60),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  customSelectText: {
    marginTop: verticalMarginScale(4),
    marginBottom: verticalMarginScale(8),
  },

  swapDeletecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    padding: verticalMarginScale(16),
    marginVertical: verticalMarginScale(8),
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    width: horizontalScale(40),
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Placeholder color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 14,
    color: '#000', // Adjust for contrast
    fontWeight: '600',
  },
  name: {
    fontSize: 16,
    color: '#000',
  },
});

export default RSVPFormScreen;
