import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { fontFamily, removeSignature } from '../../utils/functions';
import { COLORS, LABLE, ROLE } from '../../utils/constants';
import IMAGES from '@images/index';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { Event } from 'src/types';
import { CustomText } from '../CustomText';
import { convertUTCToTimeZoneFormat } from 'src/utils/dateFunctions';
import AvatarInitials from '../AvatarInitials';
import { ROUTES } from 'src/navigation/Route';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { useNavigation } from '@react-navigation/native';

interface EventInvitationProps {
  item: Event; // Extend this type with actual item properties for better type safety.
}

const MAX_LINES = 4;

const EventInvitation: React.FC<EventInvitationProps> = ({ item }) => {
  const role = useSelector((state: RootState) => state.auth.role);
  const { navigate } = useNavigation();


  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(prev => !prev);

  const formatedDate = convertUTCToTimeZoneFormat(item?.startDate, item?.timeZone, "MMM DD, yyyy h:mm a")

  const invitationDate = convertUTCToTimeZoneFormat(item?.invitationDate ? item.invitationDate : item?.startDate, item?.timeZone, "MM/DD/yyyy")

  const subTitle = `Hi, you're invited to ${item.name} on ${formatedDate}. ${item?.guestOptionalMessage ? item?.guestOptionalMessage : ''}`

  const host = item?.owner
  // Hi, you're invited to LA TOXICA REGGAETON PARTY on Mar 26, 2025 at 1:00 am


  // Check if "Read More" is needed
  const shouldShowReadMore =
    subTitle && subTitle?.split(' ').length > 26;

  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{LABLE.INITATION_MESSAGE}</CustomText>

      <View style={styles.divider} />

      <View style={{ flexDirection: 'row', padding: 20 }}>

        <View>
          <AvatarInitials
            onPress={() => {
              role == ROLE.MEMBER &&
                navigate('ProfileStack', {
                  screen: ROUTES.HostProfileScreen,
                  params: { hostId: host.id },
                });
            }}
            imgUrl={removeSignature(host?.companyLogo)}
            size={40}
          />
        </View>


        <View style={{ marginEnd: 20 }}>
          <CustomText
            style={styles.subtitle}
            textProps={{
              numberOfLines: expanded ? undefined : MAX_LINES,
            }}>
            {subTitle}
          </CustomText>

          <CustomText style={{ paddingHorizontal: 15, marginTop: 10, marginBottom: 5, color: COLORS.light_gray }}>{invitationDate}</CustomText>

          {shouldShowReadMore && (
            <TouchableOpacity onPress={handleToggle} style={styles.toggleContainer}>
              {!expanded ? (
                <CustomText style={styles.toggleText}>{LABLE.READ_MORE}</CustomText>
              ) : (
                <CustomText style={styles.toggleText}>{LABLE.VIEW_LESS}</CustomText>
              )}

              <Image
                source={expanded ? IMAGES.upArrow : IMAGES.downArrow}
                tintColor={COLORS.light_gray}
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
          )}
        </View>

      </View>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    paddingTop: verticalMarginScale(20),
    paddingBottom: verticalMarginScale(10),
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: horizontalMarginScale(16),
  },
  subtitle: {
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Medium,
    paddingHorizontal: verticalMarginScale(16),
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: verticalMarginScale(16),
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalMarginScale(10),
    paddingHorizontal: verticalMarginScale(16),
  },
  toggleText: {
    textDecorationLine: 'underline',
    marginRight: 5,
  },
  toggleIcon: {
    width: verticalScale(10),
    height: verticalScale(10),
    tintColor: COLORS.light_gray,
    resizeMode: 'contain',
  },
});

export default EventInvitation;
