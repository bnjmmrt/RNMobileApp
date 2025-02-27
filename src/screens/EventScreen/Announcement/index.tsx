import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, RefreshControl, TouchableOpacity, Image } from 'react-native';
import AnnouncementStyles from './styles';
import Header from 'src/component/Header/Header';
import { ANNOUNCCEMENTS_DATA, ANNOUNCEMENT, COLORS } from 'src/utils/constants';
import IMAGES from '@images/index';
import { horizontalMarginScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import FastImage from '@d11/react-native-fast-image';
import AvatarInitials from 'src/component/AvatarInitials';

interface AnnouncementProps extends NativeStackScreenProps<any, any> { }
const Announcement: React.FC<AnnouncementProps> = ({ navigation }) => {
    const styles = AnnouncementStyles()
    const handleBackPress = () => {
        navigation.goBack()
    };

    // const onRefreshPage = () => {
    //     setCurrentPage(1);
    //     refetch();
    // };
    // const loadMore = () => {
    //     if (announcementList.length < data?.data?.totalCount && !isLoading) {
    //         setCurrentPage(prev => prev + 1);
    //     }
    // };

    const MediaItem = ({ item }: { item: any }) => (
        item.type === "image" ? (
            <FastImage source={{ uri: item.uri }} style={styles.mediaImage} />
        ) : (
            <View style={styles.pdfContainer}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.pdfSize}>{item.size}</Text>
            </View>
        )
    );

    const AnnouncementItem = ({ item }: { item: any }) => {
        const [expanded, setExpanded] = useState(false);
        const shouldShowReadMore = item?.description?.split(' ').length > 30;
        const displayedText = expanded || !shouldShowReadMore ? item.description : `${item.description.substring(0, 100)}...`;
        return (
            <View style={styles.Detailcontainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AvatarInitials
                            name={item.addedBy}
                            imgUrl={item.imageKeyUrl}
                            size={36}
                            textColor="white"
                        />
                        <Text style={styles.headerTitle}>{item.addedBy}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.subtitle}> {item.time?.includes("Today") ? item.time : item.date}</Text>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('EventStack', {
                                screen: 'AddAnnouncementScreen'
                            })
                        }} style={styles.iconWrapper}>
                            <Image source={IMAGES.pencil} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.lineView} />
                <View style={styles.textContainer}>
                    <Text numberOfLines={expanded ? undefined : 3} style={styles.name}>{displayedText}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {item.media.slice(0, 3).map((mediaItem: any, index: any) => (
                            <MediaItem key={index} item={mediaItem} />
                        ))}
                    </ScrollView>
                    {!expanded && shouldShowReadMore ? (
                        <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleContainer}>
                            <Text style={styles.toggleText}>{ANNOUNCEMENT.READ_MORE}</Text>
                            <FastImage source={IMAGES.downArrow} style={styles.toggleIcon} />
                        </TouchableOpacity>) : shouldShowReadMore && (
                            <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.toggleContainer}>
                                <Text style={styles.toggleText}>{ANNOUNCEMENT.READ_LESS}</Text>
                                <FastImage source={IMAGES.downArrow} style={styles.toggleIcon} />
                            </TouchableOpacity>
                        )}
                </View>
                <View style={styles.lineView} />
                <View style={styles.recipientHeader}>
                    <Text style={styles.headerDes}>{ANNOUNCEMENT.Send_to}</Text>
                    <View style={styles.countWrapper}>
                        <Text style={styles.label}>{item.recipientsCount} {ANNOUNCEMENT.Recipients}</Text>
                    </View>
                </View>
                <ScrollView horizontal={true} style={{ marginVertical: verticalMarginScale(10) }}>
                    {item?.ticketType.map((item: any) => {
                        return (
                            <View style={[styles.countWrapper, {
                                marginHorizontal: 3, backgroundColor: 'transparant', paddingVertical: verticalScale(5),
                            }]}>
                                <Text style={styles.label}>{item}</Text>
                            </View>
                        )
                    })
                    }
                </ScrollView>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Header
                headerTitle={ANNOUNCEMENT.Announcement}
                onPress={handleBackPress}
                rightIcon={IMAGES.plus}
                showProgressBar={false}
                rightIconWrapperStyle={{ backgroundColor: COLORS.black }}

            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.contentContainer}>
                    <FlatList
                        data={ANNOUNCCEMENTS_DATA}
                        style={{
                            marginBottom: verticalMarginScale(90),
                            marginTop: verticalMarginScale(5),
                        }}
                        renderItem={({ item }) => <AnnouncementItem item={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ gap: verticalMarginScale(16) }}
                    // onEndReached={loadMore}
                    // onEndReachedThreshold={0.4}
                    // showsVerticalScrollIndicator={false}
                    // refreshControl={
                    //     announcementList.length > 0 ? (
                    //         <RefreshControl refreshing={false} onRefresh={onRefreshPage} />
                    //     ) : undefined
                    // }
                    />
                </View>
            </ScrollView>
        </View>
    );
};


export default Announcement;