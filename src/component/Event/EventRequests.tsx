import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  verticalMarginScale,
  radiusScale,
  verticalScale,
} from 'src/utils/dimensions';
import { useFetchGuestStatusCountQuery } from 'src/redux/actions/eventApiAction';
import Button from '../Button';

interface EventOverviewProps {
  eventId: string; // Extend this type with actual item properties for better type safety.
  checkedinCount?: number;
  onTicketBreakdownPress: () => void;
}

const EventRequests: React.FC<EventOverviewProps> = ({
  eventId,
  checkedinCount,
  onTicketBreakdownPress,
}) => {
  const [confirmCount, setConfirmCount] = useState(0);
  const [inviteCount, setInviteCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [checkInCount, setCheckInCount] = useState(checkedinCount || 0);
  const { data } = useFetchGuestStatusCountQuery({ eventId });

  useEffect(() => {
    setConfirmCount(data?.data?.confirmedCount || 0);
    setInviteCount(data?.data?.invitedCount || 0);
    setRequestCount(data?.data?.requestedCount || 0);
    setCheckInCount(data?.data?.checkedInCount || 0);
  }, [data]);

  const renderCountView = (count: number, type: string) => {
    return (
      <View style={styles.countContainer}>
        <Text style={styles.countStyle}>{count}</Text>
        <Text style={styles.subtitle}>{type}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{LABLE.GUEST_LIST}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.containContainer}>
        {renderCountView(inviteCount, LABLE.INVITED)}
        {renderCountView(requestCount, LABLE.REQUESTS)}
        {renderCountView(confirmCount, LABLE.CONFIRMED)}
        {renderCountView(checkInCount, LABLE.CHECKED_IN)}
      </View>

      <View style={styles.divider} />

      <View style={styles.wrapper}>
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.SHOW_TICKET_BREAKDOWN}
          colorTheme="dark"
          onPress={onTicketBreakdownPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(16),
    backgroundColor: COLORS.white,
  },
  containContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalMarginScale(16),
  },
  wrapper: {
    paddingVertical: verticalMarginScale(16),
    paddingHorizontal: horizontalMarginScale(16),
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(16),
    fontFamily: fontFamily.ABCDiatype_Medium,
    fontWeight: '500',
  },
  countContainer: {
    alignItems: 'center',
    flex: 1,
  },
  countStyle: {
    color: COLORS.black,
    fontSize: fontScale(32),
    fontWeight: '400',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontWeight: '500',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
  },
  btnStyle: {
    borderRadius: radiusScale(100),
    height: verticalScale(48),
    width: '100%',
  },
});

export default EventRequests;
