import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { fontFamily } from '../../utils/functions';
import { COLORS, LABLE } from '../../utils/constants';
import { fontScale } from 'src/utils/dimensions';
import { useFetchGuestStatusCountQuery } from 'src/redux/actions/eventApiAction';

interface EventOverviewProps {
  eventId: string; // Extend this type with actual item properties for better type safety.
  checkedinCount: number
}

const EventRequests: React.FC<EventOverviewProps> = ({ eventId, checkedinCount }) => {
  const [confirmCount, setConfirmCount] = useState(0);
  const [inviteCount, setInviteCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [checkInCount, setCheckInCount] = useState(checkedinCount || 0);
  const { data } = useFetchGuestStatusCountQuery({ eventId });

  useEffect(() => {
    console.log('data', data);
    setConfirmCount(data?.data?.confirmedCount || 0);
    setInviteCount(data?.data?.invitedCount || 0);
    setRequestCount(data?.data?.requestedCount || 0);
    // setCheckInCount(data?.data?.checkedInCount || 0);

  }, [data])

  const renderCountView = (count: number, type: string) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.countStyle}>{count}</Text>
        <Text style={styles.subtitle}>{type}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{LABLE.GUEST_LIST}</Text>
      <View style={styles.divider} />
      <View style={styles.containContainer}>
        {renderCountView(inviteCount, LABLE.INVITED)}
        {renderCountView(requestCount, LABLE.REQUESTS)}
        {renderCountView(confirmCount, LABLE.CONFIRMED)}
        {renderCountView(checkInCount, LABLE.CHECKED_IN)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: COLORS.borderGray,
    borderRadius: 15,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  containContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: COLORS.black2,
    fontSize: fontScale(16),
    marginBottom: 10,
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  countStyle: {
    color: COLORS.black,
    fontSize: fontScale(32),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  subtitle: {
    color: COLORS.light_gray,
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.borderGray,
    marginVertical: 10,
  },
});

export default EventRequests;
