import React, { useCallback } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Button from "src/component/Button";
import AddAnnouncementStyles from "./AddAnnouncement/AddAnnouncementStyles";
import { ANNOUNCEMENT, COLORS } from "src/utils/constants";
import IMAGES from "@images/index";
import { verticalMarginScale } from "src/utils/dimensions";
import SearchInput from "src/component/SearchInput";
import { guestInterface } from "./AddAnnouncement/AddAnnouncementInterface";
import RecipientListItem from "./AddAnnouncement/RecipientListItem";
import EventEmptyRecord from "src/component/EmptyRecord/EventEmptyRecord";

interface RecipientProps {
    allRecipients: any[];
    searchInputRef: React.RefObject<any>;
    handleSearchTextChange: () => (text: string) => void;
    searchText: string;
    totalCount: number;
    currentPage: number;
    selectedUsers: any[];
    setCurrentPage: (page: number) => void;
}

export const Recipient: React.FC<RecipientProps> = ({ allRecipients, handleSearchTextChange, searchInputRef, searchText, totalCount, selectedUsers, setCurrentPage, currentPage }) => {
    const styles = AddAnnouncementStyles();
    const onSelectRecipient = (user: guestInterface) => { };
    const renderItem = useCallback(
        ({ item, index }: { item: guestInterface; index: number }) => {
            const isSelected = selectedUsers.some(user => user.id === item.id);
            return (
                <RecipientListItem
                    index={index}
                    item={item}
                    onSelectUser={onSelectRecipient}
                    isSelected={isSelected}
                />
            );
        },
        [selectedUsers],
    );
    const loadMore = () => {
        if (allRecipients.length < totalCount) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <View style={{ marginTop: verticalMarginScale(10) }}>
            <View style={styles.recipientHeader}>
                <Text style={styles.title}>{ANNOUNCEMENT.Recipients}</Text>
                <View style={styles.countWrapper}>
                    <Text style={[styles.label, { paddingTop: 0 }]}>{totalCount}</Text>
                </View>
            </View>
            <SearchInput
                ref={searchInputRef}
                onSearchTextChange={handleSearchTextChange}
                placeholder="Search..."
                mainContainerStyle={{ marginVertical: verticalMarginScale(15) }}
                defaultValue={searchText}
            />
            <FlatList
                data={allRecipients || []}
                style={{
                    marginBottom: verticalMarginScale(90),
                    marginTop: verticalMarginScale(5),
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
                            marginTop: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                        <EventEmptyRecord
                            title={
                                searchText != ''
                                    ? ANNOUNCEMENT.No_results
                                    : ANNOUNCEMENT.No_Recipients
                            }
                            subTitle={
                                searchText != '' ? ANNOUNCEMENT.Please_refine_your_search : ''
                            }
                        />
                    </View>
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false} />
        </View>
    );
}