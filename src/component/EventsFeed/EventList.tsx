import React, { useMemo } from 'react';
import {
    FlatList,
    View,
    Text,
    RefreshControl,
    StyleSheet,
    ScrollView,
} from 'react-native';
import FeaturedFeedItem from './FeaturedFeedItem';
import FeedItem from './FeedItem';
import {
    fontScale,
    horizontalMarginScale,
    Hp,
    verticalMarginScale,
    Wp,
    verticalScale,
    horizontalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import { COLORS } from 'src/utils/constants';
import EventEmptyRecord from '../EmptyRecord/EventEmptyRecord';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const EVENTS_PER_SECTION = 6;

const EventList = ({
    allEvents,
    featuredEvents,
    isLoading,
    onRefreshPage,
    handleLoadMore,
    searchTerm,
    selectedFilters,
}) => {
    const getEmptyStateMessage = () => {
        console.log('getEmptyStateMessage', selectedFilters);
        if (Object.entries(selectedFilters) && searchTerm) {
            return 'Please refine your search.';
        } else if (Object.entries(selectedFilters)) {
            return 'Remove filters to expand your search';
        } else if (searchTerm) {
            return 'Please refine your search.';
        } else {
            return 'There are no events available';
        }
    };
    const mergedData = useMemo(() => {
        let mergedList = [];
        let eventIndex = 0;

        if (featuredEvents.length > 0) {
            featuredEvents.forEach((feature, idx) => {
                if (feature.events.length > 0) {
                    mergedList.push({ type: 'featured', data: feature });
                }

                let isLastFeature = idx === featuredEvents.length - 1;
                let eventsToAdd;

                if (isLastFeature) {
                    // If this is the last featured event, add all remaining normal events
                    eventsToAdd = allEvents?.slice(eventIndex);
                } else {
                    // Otherwise, add the next batch of normal events
                    eventsToAdd = allEvents?.slice(eventIndex, eventIndex + EVENTS_PER_SECTION);
                    eventIndex += EVENTS_PER_SECTION;
                }

                if (eventsToAdd?.length > 0) {
                    mergedList.push({ type: 'events', data: eventsToAdd });
                }
            });
        } else {
            // If no featured events, just add all normal events in sections
            for (let i = 0; i < allEvents.length; i += EVENTS_PER_SECTION) {
                mergedList.push({ type: 'events', data: allEvents.slice(i, i + EVENTS_PER_SECTION) });
            }
        }

        return mergedList;
    }, [allEvents, featuredEvents]);


    const renderEventSkeletonItem = () => {
        return (
            <SkeletonPlaceholder>
                <View style={{ width: (Wp(100) - horizontalMarginScale(60)) / 2 }}>
                    <SkeletonPlaceholder.Item
                        width="100%"
                        height={verticalScale(245)}
                        borderRadius={8}
                    />
                    <SkeletonPlaceholder.Item
                        marginTop={verticalMarginScale(12)}
                        width="80%"
                        height={16}
                        borderRadius={4}
                    />
                    <SkeletonPlaceholder.Item
                        marginTop={verticalMarginScale(4)}
                        width="50%"
                        height={12}
                        borderRadius={4}
                    />
                    <SkeletonPlaceholder.Item
                        marginTop={verticalMarginScale(4)}
                        width="40%"
                        height={12}
                        borderRadius={4}
                    />
                </View>
            </SkeletonPlaceholder>
        );
    };

    const renderFeaturedSkeletonItem = () => {
        return (
            <SkeletonPlaceholder>
                <View style={{ width: horizontalScale(217) }}>
                    <SkeletonPlaceholder.Item
                        width={horizontalScale(217)}
                        height={verticalScale(317)}
                        borderRadius={10}
                    />
                    <SkeletonPlaceholder.Item
                        marginTop={verticalMarginScale(8)}
                        width="80%"
                        height={16}
                        borderRadius={4}
                        marginLeft={horizontalMarginScale(8)}
                    />
                    <SkeletonPlaceholder.Item
                        marginTop={verticalMarginScale(1)}
                        width="60%"
                        height={12}
                        borderRadius={4}
                        marginLeft={horizontalMarginScale(8)}
                    />
                    <SkeletonPlaceholder.Item
                        marginTop={verticalMarginScale(1)}
                        width="40%"
                        height={12}
                        borderRadius={4}
                        marginLeft={horizontalMarginScale(8)}
                    />
                </View>
            </SkeletonPlaceholder>
        );
    };

    const renderEventSkeletonList = () => {
        return (
            <View style={{ flex: 1 }}>
                {/* Featured Section Skeleton */}
                <View style={styles.featuredContainer}>
                    <SkeletonPlaceholder>
                        <SkeletonPlaceholder.Item
                            width={Wp(60)}
                            height={32}
                            borderRadius={4}
                            marginLeft={horizontalMarginScale(12)}
                        />
                    </SkeletonPlaceholder>
                    <View style={{ marginTop: verticalMarginScale(16) }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: horizontalMarginScale(12),
                                }}>
                                {[1, 2, 3].map(item => (
                                    <View
                                        key={`featured-skeleton-${item}`}
                                        style={{ marginRight: horizontalMarginScale(16) }}>
                                        {renderFeaturedSkeletonItem()}
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* Regular Events Skeleton */}
                <View
                    style={{
                        paddingHorizontal: horizontalMarginScale(20),
                        marginTop: verticalMarginScale(20),
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}>
                        {[1, 2, 3, 4].map(item => (
                            <View
                                key={`event-skeleton-${item}`}
                                style={{ marginBottom: verticalMarginScale(20) }}>
                                {renderEventSkeletonItem()}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    };

    const renderItem = ({ item }) => {
        if (item.type === 'featured') {
            return (
                <View style={styles.featuredContainer}>
                    <Text style={styles.title}>{item.data.name}</Text>
                    <FlatList
                        data={item.data.events}
                        horizontal
                        keyExtractor={event => event.id}
                        renderItem={({ item }) => (
                            <FeaturedFeedItem item={item} isFeatured />
                        )}
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
                        paddingHorizontal: 20,
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

    if (isLoading && (!allEvents || allEvents.length === 0)) {
        return renderEventSkeletonList();
    }

    return (
        <FlatList
            data={mergedData}
            keyExtractor={(item, index) => `section-${index}`}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
                <View
                    style={{
                        height: Hp(55),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <EventEmptyRecord
                        title="No Events"
                        subTitle={getEmptyStateMessage()}
                        isLoading={isLoading}
                    />
                </View>
            }
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
    },
});

export default EventList;
