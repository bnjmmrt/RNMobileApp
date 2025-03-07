
import React, { useState, useRef, forwardRef, useEffect, useCallback } from 'react';
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
import IMAGES from '@images/index';
import { fontFamily } from 'src/utils/functions';
import ButtonSmall from 'src/component/ButtonSmall';
import AvatarInitials from 'src/component/AvatarInitials';
import Button from 'src/component/Button';
import { BUTTON_LABLE, COLORS, LABLE } from 'src/utils/constants';
import BottomSheetComponent from 'src/component/BottomSheet/BottomSheet';
import Input from 'src/component/Input/Input';
import Title from 'src/component/Title/Title';
import useContacts from 'src/utils/hooks/useContactPermission';
import SearchInput from 'src/component/SearchInput';
import { fontScale, horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';
import { environment } from 'environments/environment';


interface ContactItem {
  name: string;
  phone: string;
}

const PAGE_SIZE = 30;
const rumorAppLink=Platform.OS==='android' ? environment.playstoreLink : environment.appStoreLink

const InviteFriendsSheet = forwardRef((props, ref) => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const { getContacts, permissionGranted } = useContacts();
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [requestSent, setRequestSent] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchContacts();
  }, []);


  const fetchContacts = async () => {
    try {

      const formattedContacts = await getContacts();
      setContacts(formattedContacts);
      setFilteredContacts(formattedContacts.slice(0, PAGE_SIZE));

    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSearch = useCallback((query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const lowercasedQuery = query.toLowerCase().trim();

      if (lowercasedQuery.length === 0) {
        setFilteredContacts(contacts.slice(0, PAGE_SIZE));
        return;
      }

      if (lowercasedQuery.length < 2) {
        setFilteredContacts([]);
        return;
      }
      setFilteredContacts(
        contacts
          .filter((contact) =>
            contact.name.toLowerCase().includes(lowercasedQuery)
          )
          .slice(0, PAGE_SIZE)
      );
    }, 500);
  }, [contacts]);


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
          `Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world\'s top event organizers. Click here to join and start exploring unique opportunities: ${rumorAppLink}`,
      });
    } catch (error) {
      console.error('Error sharing invite link:', error);
    }
  };

  const handleInvite = (contact: ContactItem) => {
    const message =
      `Hey! I wanted to invite you to join Rumor, a new private network offering exclusive experiences curated by the world\'s top event organizers. Click here to join and start exploring unique opportunities: ${rumorAppLink}`;

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
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <AvatarInitials name={item.name} size={48} listing={true}/>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
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
    <View style={{ backgroundColor: COLORS.white }}>
      <Button
        disabled={false}
        style={styles.btnStyle}
        title={BUTTON_LABLE.INVITE_CONTACTS_VIA}
        colorTheme="dark"
        onPress={handleInviteLink}
      />
    </View>
  );

  return (
    <BottomSheetComponent
      ref={ref}
      snapPoints={['90%']}
      footer={footerComponent()}
      onClose={() => {
        setSearchQuery('');
        handleSearch('')
      }}
    >
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <Title title={BUTTON_LABLE.INVITES} align="center" />
        <View style={{ flex: 1 ,marginTop:0}}>
          <Text style={styles.sectionSubtitle}>{BUTTON_LABLE.INVITE_FREINDS}</Text>
          <SearchInput
            placeholder={LABLE.SEARCH_FRIENDS}
            onSearchTextChange={(query) => {
              setSearchQuery(query);
              handleSearch(query);
            }}
          />
          <FlatList
            data={filteredContacts}
            keyExtractor={(item, index) => '' + item.phoneNumber + index}
            contentContainerStyle={{ gap: 4, flexGrow: 1, paddingBottom: 100, marginTop: 16 }}
            renderItem={({ item }) =>
              renderListItem(
                item,
                'Invite',
                () => handleInvite(item),
                requestSent.includes(item.phoneNumber)
              )
            }
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        </View>

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
  settingsButton: { marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100 },
  btnStyle: {
    borderRadius: 100,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: fontScale(18),
    marginTop: 0,
    textAlign: 'center',
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  sectionSubtitle: {
    fontSize: fontScale(14),
    color: COLORS.light_gray,
    fontFamily: fontFamily.ABCDiatype_Medium,
    textAlign: 'center',
    marginBottom: verticalMarginScale(16),
    marginTop: verticalMarginScale(8)
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalMarginScale(10),
    paddingHorizontal: horizontalMarginScale(12),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 16,
  },
  name: {
    fontSize: fontScale(14),
    fontFamily: fontFamily.ABCDiatype_Medium,
    color: COLORS.black
  },
  phone: {
    fontSize: fontScale(12),
    color: COLORS.light_gray,
    marginTop: verticalMarginScale(4),
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default InviteFriendsSheet;