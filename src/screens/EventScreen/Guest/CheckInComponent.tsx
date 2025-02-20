import IMAGES from '@images/index';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import {Image} from 'react-native-animatable';
import AvatarInitials from 'src/component/AvatarInitials';
import {COLORS} from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

const renderItemComponent = (item: any) => {
  return (
    <View style={[styles.card, {padding: 0}]}>
      <View style={[styles.guestCard, true && styles.bottomRadius]}>
        <View style={styles.guestHeader}>
          <AvatarInitials
            name="Anu ha"
            size={32}
            backgroundColor={COLORS.white}
          />
          <Text style={styles.guestUsername}>{item.username}</Text>
          {item.status == 'Checked-In' ? (
            <View style={styles.checkInButton}>
              <Image source={IMAGES.checkCircleFilled} />
              <Text style={styles.checkInText}>Checked-In</Text>
            </View>
          ) : item.status == 'Check-In' ? (
            <View
              style={[
                styles.checkInButton,
                {
                  backgroundColor: COLORS.white,
                  borderWidth: 1,
                  borderColor: COLORS.borderGray,
                },
              ]}>
              <Image source={IMAGES.checkCircleFilled} />
              <Text style={styles.checkInText}>Check-In</Text>
            </View>
          ) : (
            <View style={styles.pendingDetailsButton}>
              <Image source={IMAGES.checkCircleFilled} />
              <Text style={styles.pendingDetailsText}>Pending Details</Text>
            </View>
          )}
          {item.status !== 'Pending' && (<TouchableOpacity>
            <Image source={IMAGES.arrowDownCircle} />
          </TouchableOpacity>)}
        </View>

        {!true && (
          <View style={{marginTop: verticalMarginScale(16)}}>
            <Text style={styles.label}>Guest Note</Text>
            <TextInput
              style={styles.input}
              placeholder="Add a private note. Not visible to the guest."
              multiline
            />
          </View>
        )}
      </View>

      {!true && (
        <TouchableOpacity style={styles.profileButton}>
          <Image source={IMAGES.arrowRight} />
          <Text style={styles.profileText}> Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const guests = [
  {
    id: '1',
    name: 'Anu Ha',
    username: 'Username',
    checkedIn: true,
    status: 'Checked-In',
  },
  {
    id: '2',
    name: 'John Doe',
    username: 'JohnD',
    checkedIn: false,
    status: 'Check-In',
  },
  {
    id: '3',
    name: 'Jane Smith',
    username: 'JaneS',
    checkedIn: false,
    status: 'Pending',
  },
];
const CheckInComponent = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Guest Check-in</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={IMAGES.upDownArrow} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>
          Ticket Type <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>Standard</Text>
          <Image source={IMAGES.downArrow} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Lead Guest</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Guest Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a private note. Not visible to the guest."
          multiline
        />
      </View>
      {/* <Text style={styles.sectionTitle}>Plus 1s</Text>
      <FlatList
        data={guests}
        keyExtractor={item => item.id}
        renderItem={({item}) => renderItemComponent(item)}
        //   contentContainerStyle={styles.container}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: verticalMarginScale(16),
    borderRadius: radiusScale(16),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    // padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  headerText: {
    fontSize: radiusScale(18),
    fontWeight: '700',
  },
  iconButton: {
    padding: 5,
  },
  iconText: {
    fontSize: 16,
  },
  section: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAEAEA',
    padding: verticalMarginScale(10),
    height: verticalScale(40),
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#BFBFBF',
  },
  dropdownText: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    backgroundColor: '#EAEAEA',
    padding: 10,
    borderWidth: 1,
    borderColor: '#BFBFBF',
    borderRadius: 8,
    marginTop: 5,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  guestCard: {
    backgroundColor: COLORS.lighter_gray,
    padding: 15,
    borderTopLeftRadius: radiusScale(16),
    borderTopRightRadius: radiusScale(16),
  },
  bottomRadius: {
    borderBottomStartRadius: radiusScale(16),
    borderBottomRightRadius: radiusScale(16),
  },
  guestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guestAvatar: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  guestUsername: {
    flex: 1,
    paddingLeft: verticalMarginScale(8),
    fontSize: fontScale(14),
  },
  checkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGreen,
    borderWidth: 1,
    borderColor: COLORS.borderGreen,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(25),
    marginRight: verticalMarginScale(8),
  },
  checkInText: {
    color: '#555',
    paddingLeft:verticalMarginScale(8)
  },
  profileButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(25),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    margin: verticalMarginScale(10),
    alignItems: 'center',
  },
  profileText: {
    color: '#333',
  },
  guestCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2,
  },
  guestCountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pendingDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.yellowbackground,
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: radiusScale(25),
  },
  pendingDetailsText: {
    color: COLORS.black,
    fontSize: fontScale(14),
    paddingLeft: verticalMarginScale(8),
  },
  checkedInBanner: {
    backgroundColor: '#222',
    padding: 15,
    marginTop: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkedInText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CheckInComponent;
