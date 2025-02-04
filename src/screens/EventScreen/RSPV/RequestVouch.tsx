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
interface ContactItem {
    name: string;
    phone: string;
}

const membersData = [
    {
        age: 31,
        categories: ["Food", "Music", "Technology"],
        phoneNumber: "5556106679",
        city: "Los Angeles",
        email: "wwvvo@uoi.com",
        followerCount: "72816",
        gender: 1,
        id: "ilxmjswjgt",
        instagramUsername: "ylttxhrjrjfi",
        isFavourite: false,
        name: "John Wick",
        profilePicture: "https://example.com/aorodlsmgw.jpg",
        role: "Admin",
        status: 0,
        types: ["Influencer", "Blogger"],
    },
    {
        age: 43,
        categories: ["Technology"],
        phoneNumber: "2836933363",
        city: "Philadelphia",
        email: "etobp@wzu.com",
        followerCount: "96524",
        gender: 1,
        id: "hukknzeemj",
        instagramUsername: "jfgphchevata",
        isFavourite: false,
        name: "Endeidx",
        profilePicture: "https://example.com/kwgmpsvahl.jpg",
        role: "Moderator",
        status: 1,
        types: ["Blogger", "Content Creator"],
    },

];

const RequestVouch = ({ onClose }: { onClose: () => void }) => {
    const { getContacts } = useContactPermission();
    const [contacts, setContacts] = useState<ContactItem[]>([]);
    const [members, setMembers] = useState<ContactItem[]>([]);
    // const { data: membersData, isMembersLoading, isError } = useFetchMembersQuery();
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
            const formattedContacts = await getContacts();
            console.log(formattedContacts.length, "helel")


            const memberPhoneNumbers = new Set(
                membersData.map((member) =>
                    member.phoneNumber.replace(/\s|-/g, "")
                )
            );

            const membersResult: string[] = [];

            formattedContacts.forEach((contact) => {
                if (memberPhoneNumbers.has(contact.phoneNumber)) {
                    const matchedMember = membersData.find(
                        (member) => member.phoneNumber.replace(/\s|-/g, "") === contact.phoneNumber
                    );
                    if (matchedMember) {
                        membersResult.push(matchedMember);
                    }
                }
            });

            setMembers(membersResult);
            setFilteredMembers(membersResult);
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
            <SearchInput placeholder='Search friends..' onSearchTextChange={handleSearch} />
            <View style={{ gap: 6 }}>
                <Text style={styles.title}>{"Friends who are members"}</Text>
                <Text style={styles.description}>{"Request a vouch from a Rumor member to boost your event application."}</Text>
            </View>
            <FlatList
                data={filteredMembers}
                scrollEnabled={false}
                contentContainerStyle={{ gap: 4, }}
                keyExtractor={(item, index) => '' + item.phoneNumber + index}
                renderItem={({ item }) =>
                    <RenderMemberList item={item} />
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
