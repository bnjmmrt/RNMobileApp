import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    LABLE,
    BUTTON_LABLE,
    COLORS,
} from '../../../utils/constants';
import Header from '../../../component/Header/Header';
import { changeSafeAreaViewConfig, fontFamily } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import useContacts from 'src/utils/hooks/useContactPermission';
import AvatarInitials from 'src/component/AvatarInitials';
import ButtonSmall from 'src/component/ButtonSmall';
import { fontScale, horizontalMarginScale, verticalMarginScale } from 'src/utils/dimensions';
import SearchInput from 'src/component/SearchInput';
import { useNavigation } from '@react-navigation/native';

interface MyDetailsScreenProps extends NativeStackScreenProps<any, any> { }
interface ContactItem {
    name: string;
    phoneNumber: string;
}

const AddFromContacts: React.FC<MyDetailsScreenProps> = () => {
    const { getContacts, permissionGranted, requestContactPermission } = useContacts();
    const { navigate } = useNavigation();
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        requestContactPermission();
        console.log(permissionGranted)

        const fetchContacts = async () => {
            if (permissionGranted) {
                const formattedContacts = await getContacts();
                console.log(formattedContacts)
                setContacts(formattedContacts);
            }
        };
        fetchContacts();
    }, [permissionGranted]);

    useEffect(() => {
        changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    }, []);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const renderListItem = (
        item: ContactItem,
    ) => (
        <View style={styles.listItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AvatarInitials name={item.name} size={48} />
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.phone}>{item.phoneNumber}</Text>
                </View>
            </View>
            <ButtonSmall
                style={styles.smallBtnStyle}
                title={'Add'}
                colorTheme={'dark'}
                borderType={'SOLID'}
                onPress={() => { navigate('AddGuestScreen', { data: { first_name: item.firstName, last_name: item.lastName, phoneNumber: item?.phoneNumber } }) }}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.viewContainer}>
                <SearchInput
                    value={searchQuery}
                    placeholder='Search contacts...'
                    onSearchTextChange={setSearchQuery}
                />
                <FlatList
                    data={filteredContacts}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        renderListItem(
                            item
                        )
                    }
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    viewContainer: {
        flex: 1,
        padding: 16,
    },
    listContainer: {
        paddingBottom: 16,
        gap: 4,
        marginTop: verticalMarginScale(14)
    },
    addButtonText: {
        color: COLORS.white,
        fontWeight: 'bold',
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
    },
    name: {
        fontSize: fontScale(14),
        fontFamily: fontFamily.ABCDiatype_Regular,
        color: COLORS.black
    },
    phone: {
        fontSize: fontScale(12),
        color: COLORS.light_gray,
        marginTop: verticalMarginScale(4),
        fontFamily: fontFamily.ABCDiatype_Regular,
    },
    smallBtnStyle: {
        paddingHorizontal: horizontalMarginScale(12),
        paddingVertical: verticalMarginScale(8),
        borderRadius: 100,
    },
});

export default AddFromContacts;
