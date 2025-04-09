// InviteReferralBottomSheet.tsx

import { useFocusEffect } from '@react-navigation/native';
import { environment } from 'environments/environment';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import useApi from 'src/axios/useApi';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  verticalMarginScale,
} from 'src/utils/dimensions';
import useContacts, { ContactItem } from 'src/utils/hooks/useContactPermission';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import IMAGES from '../../assets/images';
import { useGetConfirmedMembersMutation } from '../../redux/actions/referralApiAction';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import {
  changeSafeAreaViewConfig,
  fontFamily,
  numberSpacing,
} from '../../utils/functions';
import TabBar from '../ActiveTabBar/TabBar';
import AvatarInitials from '../AvatarInitials';
import Button from '../Button';
import ButtonSmall from '../ButtonSmall';
import EventEmptyRecord from '../EmptyRecord/EventEmptyRecord';
import Header from '../Header/Header';
import SearchInput from '../SearchInput';
import { RenderMemberList } from './RenderMemberList';
import { BOTTOM_SAFEAREA_SPACING } from '../Wrappers/SafeAreaViewWrapper';

const PAGE_SIZE = 30;

const InviteReferralBottomSheet = forwardRef((props, ref) => {
  const [contacts, setContacts] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedTab, setSelectedTab] = useState('01');
  const [requestSent, setRequestSent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [getConfirmedMembers, { data, isLoading }] =
    useGetConfirmedMembersMutation();
  const { apiRequest } = useApi();
  const {
    getContacts,
    permissionGranted,
    getContactNumbersOnly,
    permissionLoading,
  } = useContacts(true);
  const searchRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const [isRendering, setRendring] = useState(false);

  useFocusEffect(
    useCallback(() => {
      changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_TRANSLUCENT_SCHEME);
    }, []),
  );

  useEffect(() => {
    if (permissionGranted) fetchContacts();
  }, [permissionGranted]);

  const fetchContacts = async () => {
    try {
      setRendring(true);
      const formattedContacts = await getContacts();
      const contactNumbers = await getContactNumbersOnly();
      const response = await getConfirmedMembers({ contacts: contactNumbers });
      const referralRequests = await apiRequest(
        'get',
        'users/v1/auth/list-referral-requests/',
      );
      const referralUserIds = referralRequests?.data?.data?.map(r => r.userId);

      if (response?.data?.data) {
        const membersWithSentFlag = response.data.data.map(member => ({
          ...member,
          isSent: referralUserIds?.includes(member.userId),
        }));

        setMembers(membersWithSentFlag);
        setFilteredMembers(membersWithSentFlag);

        const memberPhoneNumbers = membersWithSentFlag.map(m => m.phoneNumber);

        const nonMembers = formattedContacts.filter(
          contact => !memberPhoneNumbers.includes(contact.phoneNumber?.replace(/[^\d+]/g, '')),
        );

        setContacts(nonMembers);
        setFilteredContacts(nonMembers.slice(0, PAGE_SIZE));
      } else {
        setContacts(formattedContacts);
        setFilteredContacts(formattedContacts.slice(0, PAGE_SIZE));
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setRendring(false);
    }
  };

  const handleSearch = (query: string) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      const lower = query.toLowerCase();

      if (!query) {
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
        members.filter(m => m?.name?.toLowerCase().includes(lower)),
      );
      setFilteredContacts(
        contacts
          .filter(c => c?.name?.toLowerCase().includes(lower))
          .slice(0, PAGE_SIZE),
      );
    }, 500);
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const newContacts = contacts.slice(start, end);
    if (newContacts.length > 0) {
      setFilteredContacts(prev => [...prev, ...newContacts]);
      setCurrentPage(nextPage);
    }
  };

  const handleInviteLink = async () => {
    const link =
      Platform.OS === 'android'
        ? environment.playstoreLink
        : environment.appStoreLink;
    try {
      await Share.share({
        title: 'Join Rumor and Unlock Unique Experiences!',
        message: `Hey! I wanted to invite you to join Rumor... ${link}`,
      });
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const handleInvite = (contact: ContactItem) => {
    const rumorAppLink =
      Platform.OS === 'android'
        ? environment.playstoreLink
        : environment.appStoreLink;
    const message = `Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world's top event organizers. Click here to join and start exploring unique opportunities: Andorid: ${environment.playstoreLink} | iOS: ${environment.appStoreLink}`;

    const url = `sms:${contact.phoneNumber}?body=${encodeURIComponent(
      message,
    )}`;

    Linking.openURL(url)
      .then(() => setRequestSent(prev => [...prev, contact.phoneNumber]))
      .catch(err => console.error('SMS error:', err));
  };

  const renderEmptyComponentMember = () => {
    if (!permissionGranted) {
      return (
        <View style={styles.emptyContainer}>
          <EventEmptyRecord
            isLoading={isRendering || permissionLoading}
            title="Access your contacts"
            subTitle="Sync your phone contacts to invite friends"
            footerContent={
              <ButtonSmall
                colorTheme="dark"
                leftIcon={IMAGES.settings}
                style={styles.settingsButton}
                title="Sync Contacts in Settings"
                onPress={() => Linking.openURL('app-settings:')}
              />
            }
          />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <EventEmptyRecord
          title="No Results"
          subTitle={
            searchRef?.current?.searchText 
              ?'Please refine your search.'
              :  'No Contacts are members at this time'
          }
          isLoading={isRendering || permissionLoading}
        />
      </View>
    );
  };


  const renderEmptyComponentContact = () => {
    if (!permissionGranted) {
      return (
        <View style={styles.emptyContainer}>
          <EventEmptyRecord
            isLoading={isRendering || permissionLoading}
            title="Access your contacts"
            subTitle="Sync your phone contacts to invite friends"
            footerContent={
              <ButtonSmall
                colorTheme="dark"
                leftIcon={IMAGES.settings}
                style={styles.settingsButton}
                title="Sync Contacts in Settings"
                onPress={() => Linking.openURL('app-settings:')}
              />
            }
          />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <EventEmptyRecord
          title="No Results"
          subTitle={
            searchRef?.current?.searchText ? 'Please refine your search.' : 'No contacts are available in phonebook'
          }

          isLoading={isRendering || permissionLoading}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header headerTitle="Referrals & Invites" showProgressBar={false} />
      <View
        style={{
          paddingHorizontal: 20,
          flex: 1,
          marginTop: verticalMarginScale(12),
        }}>
        <TabBar
          tab={'01'}
          onTabChange={tab => {
            setSelectedTab(tab);
            handleSearch('');
          }}
          tabOneLabel="Request a Referral"
          tabTwoLabel="Invite Contacts"
        />

        {/* {!permissionGranted && (
          <View
            style={{
              height: Hp(65),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <EventEmptyRecord
              title="Access your contacts"
              subTitle="Easily sync your phone contacts to request referrals from members and invite friends to join you on Rumor"
            />
            <ButtonSmall
              colorTheme="dark"
              leftIcon={IMAGES.settings}
              style={styles.settingsButton}
              title="Sync Contacts in Settings"
              onPress={() => Linking.openURL('app-settings:')}
            />
          </View>
        )} */}

        {selectedTab === '01' && (
          <View style={{ flex: 1, gap: 8, marginTop: verticalMarginScale(12) }}>
            {permissionGranted && !isRendering && !permissionLoading && (
              <SearchInput
                ref={searchRef}
                placeholder={LABLE.SEARCH_FRIENDS}
                onSearchTextChange={handleSearch}
              />
            )}
            {permissionGranted && !isRendering && !permissionLoading && (
              <View style={styles.sectionWrapper}>
                <Text style={styles.sectionTitle}>
                  {LABLE.FRIENDS_WHO_ARE_MEMBERS}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {LABLE.REQUEST_A_REFERRAL}
                </Text>
              </View>
            )}
            <FlatList
              data={filteredMembers}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 4 }}
              keyExtractor={(item, index) => item.phoneNumber + index}
              ListEmptyComponent={renderEmptyComponentMember()}
              ListFooterComponent={
                <View style={{ height: BOTTOM_SAFEAREA_SPACING }} />
              }
              renderItem={({ item }) => <RenderMemberList item={item} />}
            />
            {/* {!isRendering && (
            )} */}
          </View>
        )}

        {/* CONTACTS LIST */}
        {selectedTab === '02' && (
          <View style={{ flex: 1, gap: 8, marginTop: verticalMarginScale(12) }}>
            {permissionGranted && (
              <SearchInput
                ref={searchRef}
                placeholder={LABLE.SEARCH_FRIENDS}
                onSearchTextChange={handleSearch}
              />
            )}
            {permissionGranted && (
              <View style={styles.sectionWrapper}>
                <Text style={styles.sectionTitle}>{LABLE.CONTACTS}</Text>
                <Text style={styles.sectionSubtitle}>
                  {LABLE.INVITE_FRIENDS_TO}
                </Text>
              </View>
            )}
            {!isRendering && (
              <FlatList
                data={filteredContacts}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 4,
                  flexGrow: 1,
                  paddingBottom: verticalMarginScale(100),
                }}
                keyExtractor={(item, index) => item.phoneNumber + index}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        gap: 12,
                      }}>
                      <AvatarInitials name={item.name} size={48} />
                      <View style={{ width: horizontalScale(206) }}>
                        <Text numberOfLines={1} style={styles.name}>
                          {item.name}
                        </Text>
                        <Text style={styles.phone}>
                          {numberSpacing(item.phoneNumber, item.countryCode)}
                        </Text>
                      </View>
                    </View>
                    <ButtonSmall
                      disabled={requestSent.includes(item.phoneNumber)}
                      title={
                        requestSent.includes(item.phoneNumber)
                          ? 'Sent'
                          : 'Invite'
                      }
                      style={styles.smallBtnStyle}
                      colorTheme="dark"
                      borderType={
                        requestSent.includes(item.phoneNumber)
                          ? 'STRIPE'
                          : 'SOLID'
                      }
                      leftIcon={
                        requestSent.includes(item.phoneNumber)
                          ? IMAGES.check
                          : null
                      }
                      onPress={() => handleInvite(item)}
                    />
                  </View>
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={renderEmptyComponentContact()}
              />
            )}
          </View>
        )}

        {selectedTab === '02' && (
          <Button
            style={styles.btnStyle}
            title={BUTTON_LABLE.INVITE_CONTACTS_VIA}
            colorTheme="dark"
            onPress={handleInviteLink}
          />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  sectionWrapper: {
    gap: verticalMarginScale(4),
    marginVertical: verticalMarginScale(4),
  },
  smallBtnStyle: {
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: 100,
  },
  settingsButton: {
    marginTop: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(12),
    paddingVertical: verticalMarginScale(8),
    borderRadius: 100,
  },
  btnStyle: {
    borderRadius: 100,
    marginTop: verticalMarginScale(20),
    marginBottom: BOTTOM_SAFEAREA_SPACING,
    height: 48,
  },
  sectionTitle: {
    fontSize: fontScale(18),
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black,
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
  emptyContainer: {
    height: Hp(55),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InviteReferralBottomSheet;
