import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import ButtonSmall from 'src/component/ButtonSmall';
import { CustomText } from 'src/component/CustomText';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import SearchInput from 'src/component/SearchInput';
import { EventStackParamList } from 'src/navigation/EventStack';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import useContacts, { ContactItem } from 'src/utils/hooks/useContactPermission';
import createStyles from './styles';
import { ROUTES } from 'src/navigation/Route';
import { setSelectedManualUser } from 'src/redux/slices/inviteGuestsFlowSlice';

interface InviteFromContactsProps {}

const InviteFromContacts: React.FC<InviteFromContactsProps> = ({}) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();
  const { getContacts, permissionGranted, requestContactPermission } =
    useContacts();
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);

  const fetchContacts = async () => {
    await requestContactPermission();
    try {
      const formattedContacts = await getContacts();
      setContacts(formattedContacts);
      setFilteredContacts(formattedContacts);
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
        setFilteredContacts(contacts);
        return;
      }

      setFilteredContacts(
        contacts.filter(contact =>
          contact.name.toLowerCase().includes(lowercasedQuery),
        ),
      );
    }, 500);
  };

  const renderItem = useCallback(({ item }: { item: ContactItem }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AvatarInitials name={item.name} size={verticalScale(40)} />
          <View>
            <CustomText style={styles.name}>{item.name}</CustomText>
            <CustomText style={styles.phone}>{item.phoneNumber}</CustomText>
          </View>
        </View>
        <ButtonSmall
          style={styles.smallBtnStyle}
          title={'Invite'}
          colorTheme={'dark'}
          onPress={() => {
            dispatch(setSelectedManualUser(item));
            navigation.navigate(ROUTES.ManageGuestsScreen, {
              isManual: true,
              type: 'contact',
            });
          }}
        />
      </View>
    );
  }, []);

  useEffect(() => {
    fetchContacts();
  }, []);

  if (!permissionGranted) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <EventEmptyRecord title="Allow access to your contacts" subTitle="" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchInput
        placeholder={'Search...'}
        onSearchTextChange={query => {
          handleSearch(query);
        }}
        mainContainerStyle={{
          marginHorizontal: horizontalMarginScale(20),
          marginTop: verticalMarginScale(8),
        }}
      />
      <FlatList
        data={filteredContacts || []}
        style={{
          marginHorizontal: horizontalMarginScale(20),
          marginTop: verticalMarginScale(16),
        }}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ gap: verticalMarginScale(16) }}
        ListFooterComponent={
          <View style={{ marginBottom: verticalMarginScale(150) }} />
        }
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="User not found"
              subTitle="This users is not in our system or already has a status on the guest list. Tap “+” to add a new guest"
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default InviteFromContacts;
