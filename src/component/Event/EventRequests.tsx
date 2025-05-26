import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import { useFetchGuestStatusCountQuery } from 'src/redux/actions/eventApiAction';
import Button from '../Button';
import { CustomText } from '../CustomText';

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
    setCheckInCount(checkedinCount || 0);
  }, [checkedinCount]);

  useEffect(() => {
    setConfirmCount(data?.data?.confirmedCount || 0);
    setInviteCount(data?.data?.invitedCount || 0);
    setRequestCount(data?.data?.requestedCount || 0);
    // setCheckInCount(data?.data?.checkedInCount || 0);
  }, [data]);

  const renderCountView = (count: number, type: string) => {
    return (
      <View style={styles.countContainer}>
        <CustomText style={styles.countStyle}>{count}</CustomText>
        <CustomText style={styles.subtitle}>{type}</CustomText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <CustomText style={styles.title}>{LABLE.GUEST_LIST}</CustomText>
      </View>

      <View style={styles.divider} />

      <View style={styles.containContainer}>
        {renderCountView(inviteCount, LABLE.INVITED)}
        {renderCountView(requestCount, LABLE.REQUESTS)}
        {renderCountView(confirmCount, LABLE.CONFIRMED)}
        {renderCountView(checkInCount, LABLE.CHECKED_IN)}
      </View>

      <View style={styles.divider} />

      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
        }}>
        <Button
          disabled={false}
          style={styles.btnStyle}
          title={BUTTON_LABLE.MANAGE_GUEST_LIST}
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
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },
  containContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  wrapper: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  countContainer: {
    alignItems: 'center',
    flex: 1,
  },
  countStyle: {
    fontSize: 32,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
  },
  btnStyle: {
    borderRadius: 100,
    height: 48,
    width: '100%',
  },
});

export default EventRequests;
