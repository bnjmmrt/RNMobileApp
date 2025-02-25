import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Contacts from 'react-native-contacts';

import { FlatList, Text } from 'react-native';
import { RenderMemberList } from 'src/component/InviteReferralBottomSheet/RenderMemberList';
import SearchInput from 'src/component/SearchInput';
import Title from 'src/component/Title/Title';
import { COLORS } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';
import useContacts from 'src/utils/hooks/useContactPermission';
import useContactPermission from 'src/utils/hooks/useContactPermission';
import { useFetchMembersQuery, useGetConfirmedMembersMutation } from 'src/redux/actions/referralApiAction';
import { useRoute } from '@react-navigation/native';
import EventEmptyRecord from 'src/component/EmptyRecord/EventEmptyRecord';
import { Hp } from 'src/utils/dimensions';
interface ContactItem {
    name: string;
    phone: string;
}

const RequestVouch = ({ onClose, eventId }: { onClose: () => void, eventId: string }) => {
    const { getContacts, getContactNumbersOnly } = useContacts();
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [members, setMembers] = useState<ContactItem[]>([]);

    const [getConfirmedMembers] = useGetConfirmedMembersMutation();

    const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<ContactItem[]>([]);
    const [requestSent, setRequestSent] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const [selectedTab, setSelectedTab] = useState('01');
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const contacts = await getContactNumbersOnly();
            const response = await getConfirmedMembers({ contacts });
            if (response?.data?.data) {
                setMembers(response?.data?.data);
                setFilteredMembers(response?.data?.data);
            }

        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    // const handleGetConfirmedMembers = async () => {
    //     try {
    //         const response = await getConfirmedMembers({ contacts: ['+915555555556', '+915555555557', '+915555555558'] });
    //         console.log('Confirmed Members:', response);
    //     } catch (error) {
    //         console.error('Error fetching confirmed members:', error);
    //     }
    // };

    const handleSearch = (query: string) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            const lowercasedQuery = query.toLowerCase();

            if (query.length === 0) {
                setFilteredMembers(members);
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
        }, 500);
    };

    return (
        <View style={{ gap: 12 }}>
            <Title title={"Select a Member to Vouch for You"} align="center" />
            <SearchInput placeholder='Search friends' onSearchTextChange={handleSearch} />
            <View style={{ gap: 6 }}>
                <Text style={styles.title}>{"Friends who are members"}</Text>
                <Text style={styles.description}>{"Request a vouch from a Rumor member to boost your event application."}</Text>
            </View>
            <FlatList
                data={filteredMembers}
                scrollEnabled={false}
                ListEmptyComponent={<View style={{ height: Hp(40), justifyContent: 'center', alignItems: 'center' }}>
                    <EventEmptyRecord title='No Results' subTitle='No Contacts are members at this time' />
                </View>}
                contentContainerStyle={{ gap: 4, }}
                keyExtractor={(item, index) => '' + item.phoneNumber + index}
                renderItem={({ item }) =>
                    <RenderMemberList item={item} eventId={eventId} />
                }
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
        width: '100%'
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
