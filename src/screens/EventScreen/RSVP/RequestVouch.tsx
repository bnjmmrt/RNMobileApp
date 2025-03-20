import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import { RenderMemberList } from 'src/component/InviteReferralBottomSheet/RenderMemberList';
import SearchInput from 'src/component/SearchInput';
import Title from 'src/component/Title/Title';
import { useGetConfirmedMembersMutation } from 'src/redux/actions/referralApiAction';
import { COLORS } from 'src/utils/constants';
import { Hp } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import useContacts from 'src/utils/hooks/useContactPermission';
interface ContactItem {
  name: string;
  phone: string;
}

const RequestVouch = ({
  onClose,
  eventId,
  vouchData,
}: {
  onClose: () => void;
  eventId: string;
  vouchData: any;
}) => {
  const { getContactNumbersOnly, permissionGranted, requestContactPermission } =
    useContacts();
  const [members, setMembers] = useState<ContactItem[]>([]);

  const [getConfirmedMembers] = useGetConfirmedMembersMutation();

  const [filteredMembers, setFilteredMembers] = useState<ContactItem[]>([]);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    requestContactPermission();
    fetchContacts();
  }, [permissionGranted]);

  const fetchContacts = async () => {
    try {
      const contacts = await getContactNumbersOnly();
      const response = await getConfirmedMembers({ contacts });
      const vouchUserId =
        vouchData && vouchData.map(request => request.idUserVouch);
      if (response?.data?.data) {
        const membersWithSentFlag = response.data.data.map(member => ({
          ...member,
          isSent: vouchUserId.includes(member.userId),
        }));
        setMembers(membersWithSentFlag);
        setFilteredMembers(membersWithSentFlag);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const lowercasedQuery = query.toLowerCase().trim();

        if (lowercasedQuery.length === 0) {
          setFilteredMembers(members);
          return;
        }

        if (lowercasedQuery.length < 2) {
          setFilteredMembers([]);
          return;
        }

        const filtered = members.filter(member =>
          `${member.firstName} ${member.lastName}`
            .toLowerCase()
            .includes(lowercasedQuery),
        );
        setFilteredMembers(filtered);
      }, 500);
    },
    [members],
  );

  return (
    <View style={{ gap: 12 }}>
      <Title title={'Select a Member to Vouch for You'} align="center" />
      <SearchInput
        placeholder="Search friends"
        onSearchTextChange={handleSearch}
      />
      <View style={{ gap: 6 }}>
        <Text style={styles.title}>{'Friends who are members'}</Text>
        <Text style={styles.description}>
          {
            'Request a vouch from a Rumor member to boost your event application.'
          }
        </Text>
      </View>
      <FlatList
        data={filteredMembers}
        scrollEnabled={false}
        ListEmptyComponent={
          <View
            style={{
              height: Hp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <EventEmptyRecord
              title="No Results"
              subTitle="No Contacts are members at this time"
            />
          </View>
        }
        contentContainerStyle={{ gap: 4 }}
        keyExtractor={(item, index) => '' + item.phoneNumber + index}
        renderItem={({ item }) => (
          <RenderMemberList item={item} eventId={eventId} />
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  btnStyle: {
    borderRadius: 100,
    marginTop: 20,
    alignSelf: 'flex-end',
    height: 48,
    width: '100%',
  },
  title: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
});
export default RequestVouch;
