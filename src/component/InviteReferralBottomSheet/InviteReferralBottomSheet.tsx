
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Share,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import Contacts from 'react-native-contacts';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import Title from '../Title/Title';
import AvatarInitials from '../AvatarInitials';
import Input from '../Input/Input';
import ButtonSmall from '../ButtonSmall';
import Button from '../Button';
import IMAGES from '@images/index';
import TabBar from '../ActiveTabBar/TabBar';
import { fontFamily } from 'src/utils/functions';

interface AppMember {
  name: string;
  phone: string;
}

interface ContactItem {
  name: string;
  phone: string;
}

const PAGE_SIZE = 30;

const appMembers: AppMember[] = [
  { name: 'Leslie Alexander', phone: '2195550114' },
  { name: 'David Taylor', phone: '5556106679' },
  { name: 'Orson Plante', phone: '23244402' },
];

const InviteReferralBottomSheet = forwardRef((props, ref) => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [members, setMembers] = useState<ContactItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<ContactItem[]>([]);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [permissionGranted, setPermissionGranted] = useState(true);
  const [selectedTab, setSelectedTab] = useState('01');
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const requestAndroidPermissions = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then((res) => {
        console.log('Permission: ', res);
        setPermissionGranted(true);
        fetchContacts();
      })
      .catch((error) => {
        setPermissionGranted(false);
        console.error('Permission error: ', error);
      });
  };

  useEffect(() => {
    Platform.OS == 'ios' ? fetchContacts() : requestAndroidPermissions();
  }, []);

  const fetchContacts = async () => {
    try {
      const deviceContacts = await Contacts.getAll().catch((err) =>
        setPermissionGranted(false)
      );

      const formattedContacts = deviceContacts
        .map((contact: any) => ({
          name: `${contact.givenName} ${contact.familyName}`.trim(),
          phone: contact.phoneNumbers[0]?.number.replace(/\D/g, '') || '',
        }))
        .filter((contact) => contact.phone);

        console.log("formattedContacts",formattedContacts.length)

      const appMemberPhones = appMembers.map((member) => member.phone);
      const membersList = formattedContacts.filter((contact) =>
        appMemberPhones.includes(contact.phone)
      );
      const nonMembersList = formattedContacts.filter(
        (contact) => !appMemberPhones.includes(contact.phone)
      );

      setContacts(nonMembersList);
      setFilteredContacts(nonMembersList.slice(0, PAGE_SIZE));
      setMembers(membersList);
      setFilteredMembers(membersList);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSearch = (query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      const lowercasedQuery = query?.toLowerCase();

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
    }, 300); 
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
          '"Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world\'s top event organizers. Click here to join and start exploring unique opportunities: [Rumor App Link]"',
      });
    } catch (error) {
      console.error('Error sharing invite link:', error);
    }
  };

  const handleInvite = (contact: ContactItem) => {
    const message =
      'Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world\'s top event organizers. Click here to join and start exploring unique opportunities: [Rumor App Link]';

    const url = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;

    Linking.openURL(url)
      .then(() => {
        setRequestSent((prev) => [...prev, contact.phone]);
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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AvatarInitials name={item.name} size={48} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
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
    <BottomSheetComponent
      ref={ref}
      snapPoints={['90%']}
      footer={footerComponent()}
      onClose={() => console.log('Bottom sheet closed')}
    >
      <View style={{ paddingHorizontal: 20,flex:1 }}>
        <Title title={LABLE.SELECT_A_REFERRAL} align="center" />

     
        <TabBar
          onTabChange={(tab) => {setSelectedTab(tab)
            setSearchQuery('');
            handleSearch('');
          }}
          tabOneLabel="Contacts"
          tabTwoLabel="Members"
          width='100%'
        />

        {selectedTab === '02'  && (
          <>
        <Text style={styles.sectionSubtitle}>{LABLE.REQUEST_A_REFERRAL}</Text>
             <Input
          ref={searchInputRef}
          placeholder={LABLE.SEARCH_FRIENDS}
          leftImage={IMAGES.search}
          onChangeText={(query) => {
            setSearchQuery(query);
            handleSearch(query);
          }}
          defaultValue={searchQuery}
        />
            <FlatList
              data={filteredMembers}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 4,marginTop:20 }}
              keyExtractor={(item, index) => '' + item.phone + index}
              renderItem={({ item }) =>
                renderListItem(
                  item,
                  'Request',
                  () => handleInvite(item),
                  requestSent.includes(item.phone)
                )
              }
            />
          </>
        )}

        {selectedTab === '01' && (
          <View style={{flex:1}}>
                        <Text style={styles.sectionSubtitle}>{LABLE.INVITE_FRIENDS_TO}</Text>
               <Input
          ref={searchInputRef}
          placeholder={LABLE.SEARCH_FRIENDS}
          leftImage={IMAGES.search}
          onChangeText={(query) => {
            setSearchQuery(query);
            handleSearch(query);
          }}
          defaultValue={searchQuery}
        />
            <FlatList
              data={filteredContacts}
              keyExtractor={(item, index) => '' + item.phone + index}
              contentContainerStyle={{ gap: 4,flexGrow:1,paddingBottom:100,marginTop:16 }}
              renderItem={({ item }) =>
                renderListItem(
                  item,
                  'Invite',
                  () => handleInvite(item),
                  requestSent.includes(item.phone)
                )
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
            />
          </View>
        )}

        {!permissionGranted && (
          <>
            <Text style={styles.sectionTitle}>
              Allow permission to send invite to contacts
            </Text>
            <ButtonSmall
              colorTheme="dark"
              style={styles.settingsButton}
              title="Go to Settings"
              onPress={() => Linking.openURL('app-settings:')}
            />
          </>
        )}
      </View>
    </BottomSheetComponent>
  );
});

const styles = StyleSheet.create({
  smallBtnStyle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  settingsButton:{marginTop:12,paddingHorizontal:12,paddingVertical:8,borderRadius:100},
  btnStyle: {
    borderRadius: 100,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 0,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
  },
  name: {
    fontSize: 14,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  phone: {
    fontSize: 12,
    color: COLORS.light_gray,
    marginTop: 4,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default InviteReferralBottomSheet;