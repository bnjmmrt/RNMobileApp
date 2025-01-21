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
import Contacts, { Contact } from 'react-native-contacts';
import BottomSheetComponent from '../BottomSheet/BottomSheet';
import { BUTTON_LABLE, COLORS, LABLE } from '../../utils/constants';
import Title from '../Title/Title';
import AvatarInitials from '../AvatarInitials';
import { fontFamily } from '../../../src/utils/functions';
import Input from '../Input/Input';
import IMAGES from '../../../src/assets/images';
import ButtonSmall from '../ButtonSmall';
import Button from '../Button';
import { Hp } from '../../../src/utils/dimensions';


interface AppMember {
  name: string;
  phone: string;
}

interface ContactItem {
  name: string;
  phone: string;
}

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
  const [permissionGranted,setPermissionGranted]=useState(true);

  const requestAndroidPermissions = ()=>{
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
    })
        .then((res) => {
            console.log('Permission: ', res);
            setPermissionGranted(true)
            fetchContacts();
        })
        .catch((error) => {
          setPermissionGranted(false)
            console.error('Permission error: ', error);
        });
  };
 
  useEffect(() => {
    Platform.OS == 'ios' ? fetchContacts() : requestAndroidPermissions();
  }, []);

  const fetchContacts = async () => {
    try {
      const deviceContacts = await Contacts.getAll().catch(err=>setPermissionGranted(false));

      const formattedContacts = deviceContacts.map((contact: Contact) => ({
        name: `${contact.givenName} ${contact.familyName}`.trim(),
        phone: contact.phoneNumbers[0]?.number.replace(/\D/g, '') || '',
      })).filter(contact => contact.phone);

      const appMemberPhones = appMembers.map((member) => member.phone);
      const membersList = formattedContacts.filter((contact) =>
        appMemberPhones.includes(contact.phone)
      );
      const nonMembersList = formattedContacts.filter(
        (contact) => !appMemberPhones.includes(contact.phone)
      );

      setContacts(nonMembersList);
      setMembers(membersList);
      setFilteredContacts(nonMembersList);
      setFilteredMembers(membersList);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();

    setFilteredMembers(
      members.filter((member) =>
        member.name.toLowerCase().includes(lowercasedQuery)
      )
    );

    setFilteredContacts(
      contacts.filter((contact) =>
        contact.name.toLowerCase().includes(lowercasedQuery)
      )
    );
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
        // Optionally show a success message
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
      <View style={{ paddingHorizontal: 20,paddingBottom:100 }}>
        <Title title={LABLE.SELECT_A_REFERRAL} align="center" />
        <View style={{ height: 16 }} />

        <Input
          ref={searchInputRef}
          placeholder={LABLE.SEARCH_FRIENDS}
          leftImage={IMAGES.search}
          onChangeText={handleSearch}
          defaultValue={searchQuery}
        />

        {filteredMembers.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{LABLE.FRIENDS_WHO_ARE_MEMBERS}</Text>
            <Text style={styles.sectionSubtitle}>{LABLE.REQUEST_A_REFERRAL}</Text>
            <FlatList
              data={filteredMembers}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 4 }}
              keyExtractor={(item) => item.phone}
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

        {filteredContacts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{LABLE.CONTACTS}</Text>
            <Text style={styles.sectionSubtitle}>{LABLE.INVITE_FRIENDS_TO}</Text>
            <FlatList
              data={filteredContacts}
              scrollEnabled={false}
              keyExtractor={(item) => item.phone}
              contentContainerStyle={{ gap: 4 }}
              renderItem={({ item }) =>
                renderListItem(
                  item,
                  'Invite',
                  () => handleInvite(item),
                  requestSent.includes(item.phone)
                )
              }
            />
          </>
        )}
          {!permissionGranted && <>
      <Text style={styles.sectionTitle}>Allow permission to send invite to contacts</Text>
            <ButtonSmall colorTheme='dark' style={styles.settingsButton}  title='Go to Settings' onPress={()=>Linking.openURL('app-settings:')}/>
            </>}
           
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
    marginTop: 16,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Regular,
    marginBottom: 16,
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