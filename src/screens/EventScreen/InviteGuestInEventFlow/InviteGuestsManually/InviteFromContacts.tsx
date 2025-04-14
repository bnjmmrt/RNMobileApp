import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import AvatarInitials from 'src/component/AvatarInitials';
import ButtonSmall from 'src/component/ButtonSmall';
import { CustomText } from 'src/component/CustomText';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import SearchInput from 'src/component/SearchInput';
import { EventStackParamList } from 'src/navigation/EventStack';
import { ROUTES } from 'src/navigation/Route';
import { useGetGuestsQuery } from 'src/redux/actions/eventApiAction';
import { RootState } from 'src/redux/slices';
import { setSelectedManualUser } from 'src/redux/slices/inviteGuestsFlowSlice';
import {
  horizontalMarginScale,
  Hp,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import useContacts, { ContactItem } from 'src/utils/hooks/useContactPermission';
import { EventGuest } from '../../types';
import createStyles from './styles';

interface InviteFromContactsProps { }

const InviteFromContacts: React.FC<InviteFromContactsProps> = ({ }) => {
  const styles = createStyles();
  const navigation = useNavigation<NavigationProp<EventStackParamList>>();
  const dispatch = useDispatch();
  const { getContacts, permissionGranted, getPhoneNumber } = useContacts(true);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [contactsFetching, setContactsFetching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { selectedEvent } = useSelector(
    (state: RootState) => ({
      selectedEvent: state.inviteGuestsFlow.selectedEvent,
    }),
    shallowEqual,
  );

  const {
    data: guestsData,
    error: guestsError,
    isLoading: isLoadingGuests,
    isFetching: isFetchingGuests,
    refetch: refetchGuests,
  } = useGetGuestsQuery({ eventId: selectedEvent?.id });

  const fetchContacts = async () => {
    setContactsFetching(true);
    try {
      setContactsFetching(true);
      const formattedContacts = await getContacts();

      if (formattedContacts) {
        let nonInvitedUsers: ContactItem[] = [];
        formattedContacts.map((item, index) => {
          const userPhone = getPhoneNumber(item.phoneNumber);

          const isInvited = guestsData?.data?.result.some(
            (user: EventGuest) => {
              const hasPlus = user.phoneNumber?.includes('+');
              const phoneWithoutPlus = hasPlus
                ? user.phoneNumber?.split('+')[1]
                : user.phoneNumber;
              return (
                phoneWithoutPlus ===
                `${userPhone.countryCode}${userPhone.phoneNumber}`
              );
            },
          );
          if (!isInvited) {
            nonInvitedUsers.push(item);
          }
        });

        setContacts(nonInvitedUsers);
        setFilteredContacts(nonInvitedUsers);
      }
      // setContacts(formattedContacts);
      // setFilteredContacts(formattedContacts);
      setContactsFetching(false);
    } catch (error) {
      setContactsFetching(false);
      console.error('Error fetching contascts:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const renderItem = useCallback(
    ({ item }: { item: ContactItem }) => {
      const userPhone = getPhoneNumber(item.phoneNumber);
      return (
        <View style={styles.listItem}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <AvatarInitials name={item.name} size={verticalScale(40)} listing />
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
              dispatch(
                setSelectedManualUser({
                  ...item,
                  phoneNumber: item.phoneNumber,
                }),
              );
              navigation.navigate(ROUTES.InviteGuestScreen, {
                isManual: true,
                type: 'contact',
              });
            }}
          />
        </View>
      );
    },
    [guestsData],
  );

  useEffect(() => {
    if (guestsData?.data?.result) {
      fetchContacts();
    }
  }, [permissionGranted, guestsData]);

  if (
    !permissionGranted &&
    !isFetchingGuests &&
    !isLoadingGuests &&
    !contactsFetching
  ) {
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
      {/* {filteredContacts.length > 0 ? ( */}
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
      {/* // ) : null} */}
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
        initialNumToRender={50}
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title={searchQuery ? 'User not found' : 'No users found!'}
              subTitle={
                searchQuery
                  ? 'This user is not in our system or already has a status on the guest list. Please refine your search.'
                  : ''
              }
              isLoading={
                contactsFetching || isLoadingGuests || isFetchingGuests
              }
            />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default InviteFromContacts;
