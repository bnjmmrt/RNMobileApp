import React, { useMemo } from 'react';
import { FlatList, View, Text, RefreshControl, StyleSheet } from 'react-native';
import FeaturedFeedItem from './FeaturedFeedItem';
import FeedItem from './FeedItem';
import { fontScale, horizontalMarginScale, verticalMarginScale, Wp } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import { COLORS } from 'src/utils/constants';


const EVENTS_PER_SECTION = 6;

const EventList = ({ allEvents, featuredEvents, isLoading, onRefreshPage, handleLoadMore }) => {
    const mergedData = useMemo(() => {
        let mergedList = [];
        let eventIndex = 0;

        featuredEvents.forEach((feature, idx) => {
            if (feature.events.length > 0) {
                mergedList.push({ type: 'featured', data: feature });
            }

            const normalEvents = allEvents?.slice(eventIndex, eventIndex + EVENTS_PER_SECTION);
            if (normalEvents?.length > 0) {
                mergedList.push({ type: 'events', data: normalEvents });
                eventIndex += EVENTS_PER_SECTION;
            }
        });

        return mergedList;
    }, [allEvents, featuredEvents]);

    const renderItem = ({ item }) => {
        if (item.type === 'featured') {
            return (
                <View style={styles.featuredContainer}>
                    <Text style={styles.title}>
                        {item.data.name}
                    </Text>
                    <FlatList
                        data={item.data.events}
                        horizontal
                        keyExtractor={(event) => event.id}
                        renderItem={({ item }) => <FeaturedFeedItem item={item} isFeatured />}
                        showsHorizontalScrollIndicator={false}
                    // contentContainerStyle={{ gap: 10 }}
                    />
                </View>
            );
        }

        if (item.type === 'events') {
            return (
                <FlatList
                    data={item.data}
                    numColumns={2}
                    keyExtractor={(event, index) => event.id || index.toString()}
                    renderItem={({ item }) => <FeedItem item={item} />}
                    columnWrapperStyle={{
                        // justifyContent: 'center',
                        gap: 20,
                        paddingTop: 10,
                        paddingHorizontal: 20


                    }}
                    contentContainerStyle={{
                        alignItems: 'center',
                        gap: 20,
                    }}
                    scrollEnabled={false}
                />
            );
        }

        return null;
    };

    return (
        <FlatList
            data={mergedData}
            keyExtractor={(item, index) => `section-${index}`}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
                allEvents?.length > 0 ? (
                    <RefreshControl refreshing={isLoading} onRefresh={onRefreshPage} />
                ) : undefined
            }
        />
    );
};
const styles = StyleSheet.create({
    featuredContainer: {
        flexDirection: 'column',
        paddingHorizontal: horizontalMarginScale(10),
        paddingVertical: verticalMarginScale(20),
        width: Wp(100),
        backgroundColor: COLORS.lighter_gray,
        marginVertical: verticalMarginScale(10),
    },
    title: {
        fontSize: fontScale(32),
        fontFamily: fontFamily.RomieTrial_Bold,
        color: COLORS.black,
        lineHeight: 40,
        paddingLeft: horizontalMarginScale(12),
    }
});

export default EventList;
