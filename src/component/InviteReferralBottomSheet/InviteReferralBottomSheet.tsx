import React, { useState, useRef, forwardRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Share,
  Linking,
  SafeAreaView,
} from 'react-native';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import AvatarInitials from '../AvatarInitials';
import ButtonSmall from '../ButtonSmall';
import Button from '../Button';
import IMAGES from '../../assets/images';
import TabBar from '../ActiveTabBar/TabBar';
import { changeSafeAreaViewConfig, fontFamily, numberSpacing } from '../../utils/functions';
import { useFetchMembersQuery, useGetConfirmedMembersMutation, useGetReferralRequestQuery, useRequestMemberMutation } from '../../redux/actions/referralApiAction';
import { RenderMemberList } from './RenderMemberList';
import Header from '../Header/Header';
import SearchInput from '../SearchInput';
import { fontScale, horizontalMarginScale, horizontalScale, Hp, verticalMarginScale } from 'src/utils/dimensions';
import EventEmptyRecord from '../EmptyRecord/EventEmptyRecord';
import { useFocusEffect } from '@react-navigation/native';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import useContacts from 'src/utils/hooks/useContactPermission';
import useApi from 'src/axios/useApi';

interface ContactItem {
  name: string;
  phoneNumber: string;
  countryCode: string
}

const PAGE_SIZE = 30;

const InviteReferralBottomSheet = forwardRef((props, ref) => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [members, setMembers] = useState<ContactItem[]>([]);
  const { apiRequest, loading: apiLoading, error: apiError } = useApi();
  const searchRef = useRef(null);

  const [getConfirmedMembers, { data, error, isLoading }] = useGetConfirmedMembersMutation();


  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ContactItem[]>([]);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState('01');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { getContacts, permissionGranted, getContactNumbersOnly, requestContactPermission } = useContacts();

  useEffect(() => {
    requestContactPermission();
    fetchContacts()
  }, []);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []),
  );


  const fetchContacts = async () => {
    try {
      const refferalRequest = await apiRequest('get', 'v1/platform/list-referral-requests/');
      const formattedContacts = await getContacts();
      const contacts = await getContactNumbersOnly();
      const response = await getConfirmedMembers({ contacts });

      if (response?.data?.data) {
        const referralUserIds = refferalRequest.data.map(request => request.userId);

        const membersWithSentFlag = response.data.data.map(member => ({
          ...member,
          isSent: referralUserIds.includes(member.userId)
        }));

        setMembers(membersWithSentFlag);
        setFilteredMembers(membersWithSentFlag);

        const memberPhoneNumbers = membersWithSentFlag.map(member => member.phoneNumber);
        const nonMembers = formattedContacts.filter(contact =>
          !memberPhoneNumbers.includes(contact.phoneNumber)
        );

        setContacts(nonMembers);
        setFilteredContacts(nonMembers.slice(0, PAGE_SIZE));
      } else {
        setContacts(formattedContacts);
        setFilteredContacts(formattedContacts.slice(0, PAGE_SIZE));
      }

    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };


  const handleSearch = (query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const lowercasedQuery = query.toLowerCase();

      if (query.length === 0) {
        setFilteredMembers(members.slice(0, PAGE_SIZE));
        setFilteredContacts(contacts.slice(0, PAGE_SIZE));
        return;
      }

      if (query.length < 2) {
        setFilteredMembers([]);
        setFilteredContacts([]);
        return;
      }
      setFilteredMembers(
        members.filter((member) =>
          member?.name?.toLowerCase().includes(lowercasedQuery)
        )
      );
      setFilteredContacts(
        contacts
          .filter((contact) =>
            contact.name.toLowerCase().includes(lowercasedQuery)
          )
          .slice(0, PAGE_SIZE)
      );
    }, 500);
  };


  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const newContacts = contacts.slice(startIndex, endIndex);
    if (newContacts.length > 0) {
      setFilteredContacts((prev) => [...prev, ...newContacts]);
      setCurrentPage(nextPage);
    }
  };

  const handleInviteLink = async () => {
    try {
      await Share.share({
        message:
          'Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world\'s top event organizers. Click here to join and start exploring unique opportunities: [Rumor App Link]',
      });
    } catch (error) {
      console.error('Error sharing invite link:', error);
    }
  };

  const handleInvite = (contact: ContactItem) => {
    const message =
      'Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world\'s top event organizers. Click here to join and start exploring unique opportunities: [Rumor App Link]';

    const url = `sms:${contact.phoneNumber}?body=${encodeURIComponent(message)}`;

    Linking.openURL(url)
      .then(() => {
        setRequestSent((prev) => [...prev, contact.phoneNumber]);
        console.log(`Invitation sent to ${contact.name}.`);
      })
      .catch((error) => {
        console.error('Error opening messaging app:', error);
      });
  };

  const renderListItem = (
    item: ContactItem,
    buttonLabel: string,
    onPressAction: () => void,
    isSent: boolean
  ) => (
    <View style={styles.listItem}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
        <AvatarInitials name={item?.name} size={48} />
        <View style={{ width: horizontalScale(206) }}>
          <Text numberOfLines={1} style={styles.name}>{item?.name}</Text>
          <Text style={styles.phone}>{numberSpacing(item.phoneNumber, item.countryCode)}</Text>
        </View>
      </View>
      <ButtonSmall
        disabled={isSent}
        style={styles.smallBtnStyle}
        title={isSent ? 'Sent' : buttonLabel}
        colorTheme={isSent ? 'dark' : 'dark'}
        borderType={isSent ? 'STRIPE' : 'SOLID'}
        leftIcon={isSent ? IMAGES.check : null}
        onPress={onPressAction}
      />
    </View>
  );

  const footerComponent = () => (
    <Button
      disabled={false}
      style={styles.btnStyle}
      title={BUTTON_LABLE.INVITE_CONTACTS_VIA}
      colorTheme="dark"
      onPress={handleInviteLink}
    />
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header headerTitle="Referrals & Invites" showProgressBar={false} />
      <View style={{ paddingHorizontal: 20, flex: 1, marginTop: verticalMarginScale(12) }}>
        <TabBar
          onTabChange={(tab) => {
            setSelectedTab(tab)
            handleSearch('');
          }}
          tabOneLabel="Request a Referral"
          tabTwoLabel="Invite Contacts"
          width='100%'
        />

        {selectedTab === '01' && (
          <View style={{ flex: 1, gap: 8, marginTop: verticalMarginScale(12) }}>
            {permissionGranted && <SearchInput
              ref={searchRef}
              placeholder={LABLE.SEARCH_FRIENDS}
              onSearchTextChange={(query) => {
                handleSearch(query);
              }}
            />}
            {permissionGranted && <View style={{ gap: verticalMarginScale(4), marginVertical: verticalMarginScale(4) }}>
              <Text style={styles.sectionTitle}>{LABLE.FRIENDS_WHO_ARE_MEMBERS}</Text>
              <Text style={styles.sectionSubtitle}>{LABLE.REQUEST_A_REFERRAL}</Text>
            </View>}

            <FlatList
              data={filteredMembers}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                permissionGranted ?
                  <View style={{ height: Hp(50), justifyContent: 'center', alignItems: 'center' }}>
                    <EventEmptyRecord title='No Results' subTitle={searchRef?.current?.searchText == "" ? 'No Contacts are members at this time' : "Please refine your search."} />
                  </View> :
                  <View style={{ height: Hp(65), justifyContent: 'center', alignItems: 'center' }}>
                    <EventEmptyRecord title='Access your contacts' subTitle='Easily sync your phone contacts to request referrals from members and invite friends to join you on Rumor' />
                    <ButtonSmall
                      colorTheme="dark"
                      leftIcon={IMAGES.settings}
                      style={styles.settingsButton}
                      title="Sync Contacts in Settings"
                      onPress={() => Linking.openURL('app-settings:')}
                    />
                  </View>
              }
              contentContainerStyle={{ gap: 4, marginTop: 0 }}
              keyExtractor={(item, index) => '' + item.phoneNumber + index}
              renderItem={({ item }) =>
                <RenderMemberList item={item} />
              }
            />
          </View>
        )}

        {selectedTab === '02' && (
          <View style={{ flex: 1, gap: 8, marginTop: verticalMarginScale(12) }}>
            {permissionGranted && <SearchInput
              placeholder={LABLE.SEARCH_FRIENDS}
              ref={searchRef}
              onSearchTextChange={(query) => {
                handleSearch(query);
              }}
            />}
            {permissionGranted && <View style={{ gap: verticalMarginScale(4), marginVertical: verticalMarginScale(4) }}>
              <Text style={styles.sectionTitle}>{LABLE.CONTACTS}</Text>
              <Text style={styles.sectionSubtitle}>{LABLE.INVITE_FRIENDS_TO}</Text>
            </View>}
            <FlatList
              data={filteredContacts}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !permissionGranted ?
                  <View style={{ height: Hp(65), justifyContent: 'center', alignItems: 'center' }}>
                    <EventEmptyRecord title='Access your contacts' subTitle='Easily sync your phone contacts to request referrals from members and invite friends to join you on Rumor' />
                    <ButtonSmall
                      colorTheme="dark"
                      leftIcon={IMAGES.settings}
                      style={styles.settingsButton}
                      title="Sync Contacts in Settings"
                      onPress={() => Linking.openURL('app-settings:')}
                    />
                  </View> : <View style={{ height: Hp(50), justifyContent: 'center', alignItems: 'center' }}>
                    <EventEmptyRecord title='No Results' subTitle={searchRef?.current?.searchText == "" ? 'No Contacts are members at this time' : "Please refine your search."} />
                  </View>
              }
              keyExtractor={(item, index) => '' + item.phoneNumber + index}
              contentContainerStyle={{ gap: 4, flexGrow: 1, paddingBottom: verticalMarginScale(100), marginTop: verticalMarginScale(12) }}
              renderItem={({ item }) =>
                renderListItem(
                  item,
                  'Invite',
                  () => handleInvite(item),
                  requestSent.includes(item.phoneNumber)
                )
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          </View>
        )}

        {selectedTab == '02' && footerComponent()}
      </View>



    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  smallBtnStyle: {
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: 100,
  },
  settingsButton: { marginTop: verticalMarginScale(12), paddingHorizontal: horizontalMarginScale(12), paddingVertical: verticalMarginScale(8), borderRadius: 100 },
  btnStyle: {
    borderRadius: 100,
    marginBottom: verticalMarginScale(20),
    marginTop: verticalMarginScale(20),
    height: 48
  },
  sectionTitle: {
    fontSize: fontScale(18),
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black
  },
  sectionSubtitle: {
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(12),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
    gap: 8,
  },
  name: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Regular,
    color: COLORS.black,
  },
  phone: {
    fontSize: fontScale(12),
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(4),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default InviteReferralBottomSheet;