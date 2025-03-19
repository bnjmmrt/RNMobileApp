import IMAGES from '@images/index';
import { useFocusEffect } from '@react-navigation/native';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { shallowEqual, useSelector } from 'react-redux';
import { useFetchAllEventsQuery } from 'src/redux/actions/eventApiAction';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';
import HeaderComponent from '../../component/HeaderComponent';
import { RootState } from '../../redux/slices';
import { Address } from '../../redux/slices/appFlowSlice';
import { COLORS } from '../../utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  Hp,
  radiusScale,
  verticalMarginScale,
  verticalScale,
  Wp,
} from '../../utils/dimensions';
import { changeSafeAreaViewConfig, fontFamily } from '../../utils/functions';
import { BottomSheetMethods } from '../BottomSheet/BottomSheet';
import FiltersSheet, { getFilterQuery, SelectedFilters } from '../FilterSheet';
import { InputRefMethods } from '../Input/Input';
import SearchInput from '../SearchInput';
import FeaturedFeedItem from './FeaturedFeedItem';
import FeedDetail from './FeedDetail';
import FeedFilterItem from './FeedFilterItem';
import FeedItem from './FeedItem';
import FeedSeriesDetail from './FeedSeriesDetail';
import EventEmptyRecord from '../EmptyRecord/EventEmptyRecord';
import { formatDetailedEventDate } from 'src/utils/dateFunctions';
import EventList from './EventList';

export interface EventItem {
  admissionType: {
    description: string;
    enabled: boolean;
    id: string;
    name: string;
  };
  ageLimit: {
    description: string;
    enabled: boolean;
    id: string;
    maxAge: number;
    minAge: number;
    name: string;
  };
  autoPublished: boolean;
  capacity: number;
  collaborators: [
    {
      addGuestsToDrafts: boolean;
      chatWithAllGuests: boolean;
      chatWithGuestsByCollaborator: boolean;
      checkInGuests: boolean;
      displayName: string;
      displayNameListEvent: boolean;
      editEventDetailsSettings: boolean;
      email: string;
      generateEventReports: boolean;
      id: string;
      inviteGuestsToEvent: boolean;
      limitInvitations: boolean;
      limitInvitationsNumber: number;
      manageDedicatedSignUpForm: boolean;
      manageInAppRsvpRequests: boolean;
      name: string;
      postAnnouncementsByCollaborator: boolean;
      postAnnouncementsToAllGuests: boolean;
      role: {
        id: string;
        name: string;
      };
      tickets: [
        {
          id: string;
          limitInvitationsNumber: number;
          name: string;
        },
      ];
      viewFullGuestList: boolean;
    },
  ];
  currentGuestStatus: number;
  description: string;
  enabled: boolean;
  endDate: string;
  eventType: {
    description: string;
    enabled: boolean;
    id: string;
    name: string;
  };
  featuredEventSection: {
    id: string;
    index: number;
    name: string;
  };
  furtherInstructions: string;
  guestId: string;
  guestsCount: number;
  id: string;
  imageCover: string;
  imageFlyer: string;
  isPrivate: boolean;
  limitOnePlus: number;
  location: {
    city: string;
    id: string;
    latitude: number;
    location: string;
    longitude: number;
    placeId: string;
    regionCode: string;
  };
  name: string;
  owner: {
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    profilePicture: string;
  };
  publishDate: string;
  qrCodeUtilization: number;
  quizQuestions: [
    {
      enabled: boolean;
      id: string;
      order: number;
      question: string;
      required: boolean;
    },
  ];
  rsvpDeadline: string;
  showLocation: boolean;
  startDate: string;
  status: number;
  talents: [
    {
      contact: string;
      description: string;
      enabled: boolean;
      id: string;
      imageKeyUrl: string;
      name: string;
      socialNetwork: string;
    },
  ];
  ticketTypes: [
    {
      capacity: number;
      description: string;
      enabled: boolean;
      id: string;
      name: string;
    },
  ];
  timeZone: string;
  useQr: boolean;
  userId: string;
}

export interface SeriesItem {
  name: string;
  image: { uri: string };
  about: string;
  period: string;
  events: EventItem[];
}

export interface Filter {
  location: Address;
  categories: string[];
  date: string[];
}

export interface Pagination {
  take: number;
  skip: number;
}

const EventsFeed = () => {
  const filtersSheetRef = useRef<BottomSheetMethods>(null);
  const searchInputRef = useRef<InputRefMethods>(null);

  const [detail, setDetail] = useState<EventItem | null>(null);
  const [seriesDetail, setSeriesDetail] = useState<SeriesItem | null>(null);
  const [responseSubmitted, setResponseSubmitted] = useState<boolean>(false);

  const [allEvents, setAllEvents] = useState<(EventItem & SeriesItem)[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterNumber, setFilterNumber] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const isGuest = useSelector(
    (state: RootState) => state.auth.isGuest,
    shallowEqual,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  const { data, isLoading, error, isError, refetch } = useFetchAllEventsQuery({
    statusName: 'UPCOMING_STATUS',
    searchText: searchTerm,
    queryString: filterQuery,
    userId: userId,
    // take: 100,
    // skip: 0
    // skip: (currentPage - 1) * 30,
  });

  const debouncedSearch = useCallback(
    debounce((text: string) => setSearchTerm(text), 500),
    [],
  );
  const handleSearchChange = useCallback((text: string) => {
    debouncedSearch(text);
  }, []);

  const handleNotify = useCallback(() => {
    setResponseSubmitted(true);
    setTimeout(() => {
      setResponseSubmitted(false);
    }, 3000);
  }, []);

  const handleLoadMore = useCallback(() => {
    // const totalCount = data?.data?.totalCount;
    // console.log("totalCount", totalCount)
    // console.log("AllEvent", allEvents?.length)
    // if (allEvents?.length < totalCount && !isLoading) {
    //   setCurrentPage(prev => prev + 1);
    // }
  }, [allEvents]);

  const onRefreshPage = () => {
    setCurrentPage(1);
    refetch();
  };

  const onApplyFilter = (
    queryString: string,
    numberOfFiltersApplied: number,
    selectedFilters?: SelectedFilters,
  ) => {
    setCurrentPage(1);
    setFilterQuery(queryString);
    setFilterNumber(numberOfFiltersApplied);

    if (selectedFilters) {
      console.log('selectedFilters', selectedFilters);
      setSelectedFilters(selectedFilters);
    }
  };

  const onClearFilter = () => {
    setCurrentPage(1);
    setFilterQuery('');
    setFilterNumber(0);
    setSelectedFilters({});
  };

  useEffect(() => {
    if (data?.data?.result) {
      const eventsRes = data?.result;
      // const featuredEventsRes = data?.data?.data?.filter(
      //   (item: any) => item.featuredEventSection,
      // );
      const { result, allArray } = groupEventsByFeaturedSection(data);

      setFeaturedEvents(result);
      setAllEvents(allArray);
      // setAllEvents(prev =>
      //   currentPage === 1 ? eventsRes : [...prev, ...eventsRes],
      // );
    }
  }, [data]);

  function groupEventsByFeaturedSection(mainResponse) {
    // console.log(":DATA RESULTH:0", mainResponse);

    let groupedEvents = {};
    let allArray = []; // Single array to store all non-featured events

    mainResponse?.data?.result.forEach(event => {
      if (event?.featuredEventSection) {
        const sectionId = event.featuredEventSection.id;
        if (!groupedEvents[sectionId]) {
          groupedEvents[sectionId] = {
            id: sectionId,
            index: event.featuredEventSection.index,
            name: event.featuredEventSection.name,
            events: [],
          };
        }
        groupedEvents[sectionId].events.push(event);
      } else {
        allArray.push(event); // Push non-featured events into a single array
      }
    });

    // Convert groupedEvents object into an array
    let result = Object.values(groupedEvents);

    return { result, allArray }; // Return both grouped featured events and all other events in a single array
  }

  useFocusEffect(
    useCallback(() => {
      if (isGuest) {
        changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.BLACK_SCHEME,
          showBottomSafeAreaView: false,
          showTopSafeAreaView: false,
        });
      } else {
        changeSafeAreaViewConfig({
          ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
          showBottomSafeAreaView: false,
          showTopSafeAreaView: false,
        });
      }
    }, []),
  );

  const renderFilters = useCallback(() => {
    const onRemoveFilter = (filterKey: string, valueIndex: number) => {
      let tempSelectedFilters = { ...selectedFilters };

      // Remove the specific value from the selected filter
      tempSelectedFilters = {
        ...tempSelectedFilters,
        [filterKey]: {
          ...tempSelectedFilters[filterKey],
          value: tempSelectedFilters[filterKey].value.filter(
            (_: any, index: number) => index !== valueIndex
          ),
        },
      };

      if (filterKey === "minStartDate" && tempSelectedFilters.maxEndDate) {
        delete tempSelectedFilters.maxEndDate;
      }

      if (filterKey === "longitude" && tempSelectedFilters.latitude) {
        delete tempSelectedFilters.latitude;
      }

      const { queryString, filtersCount } = getFilterQuery(tempSelectedFilters);
      onApplyFilter(queryString, filtersCount, tempSelectedFilters);
    };




    return (
      <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.filterScrollView, {}]}
          contentContainerStyle={{ gap: horizontalMarginScale(4) }}>
          {Object.entries(selectedFilters).map(([key, filter]) => {
            return (
              <>
                {filter.value.map((item, index) => {
                  return (
                    <FeedFilterItem
                      content={item.name}
                      handleClear={() => onRemoveFilter(key, index)}
                    />
                  );
                })}
              </>
            );
          })}
        </ScrollView>
      </View>
    );
  }, [selectedFilters]);

  const renderFeaturedEvents = useCallback(
    () =>
      featuredEvents.length > 0 ? (
        <View style={styles.featuredContainer}>
          <Text style={styles.title}>Featured Events</Text>
          <ScrollView
            horizontal
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}>
            {featuredEvents.map(event => (
              <FeaturedFeedItem key={event.id} item={event} isFeatured />
            ))}
          </ScrollView>
        </View>
      ) : null,
    [featuredEvents.length],
  );

  const renderItem = useCallback(({ item }: { item: any }) => {
    return <FeedItem item={item} />;
  }, []);

  if (isGuest) {
    return <BeforeAppStaticComponent isChatScreen={false} />;
  }

  return (
    <View style={styles.container}>
      <HeaderComponent isDarkTheme={false} />
      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchChange}
        placeholder="Search for an event..."
        rightIcon={IMAGES.filter_lines}
        onPressRightIcon={() => {
          filtersSheetRef?.current?.open();
        }}
        rightIconText={String(filterNumber || '') || ''}
        mainContainerStyle={{
          marginHorizontal: horizontalMarginScale(20),
        }}
        defaultValue={searchTerm}
      />
      {renderFilters()}
      {/* {renderFeaturedEvents()} */}
      <EventList
        allEvents={allEvents || []}
        featuredEvents={featuredEvents}
        isLoading={isLoading}
        onRefreshPage={onRefreshPage}
        handleLoadMore={handleLoadMore}
        searchTerm={searchTerm}
        selectedFilters={selectedFilters}
      />

      {/* <FlatList
        data={allEvents || []}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        numColumns={2}
        style={{
          marginHorizontal: horizontalMarginScale(20),
          marginTop: verticalMarginScale(20),
        }}
        columnWrapperStyle={{ gap: horizontalMarginScale(20) }}
        contentContainerStyle={{ gap: horizontalMarginScale(20) }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={{ marginBottom: verticalScale(100) }} />
        }
        ListEmptyComponent={
          <View
            style={{
              height: Hp(55),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <EventEmptyRecord
              title="No Events"
              subTitle="There are no events available"
              isLoading={isLoading}
            />
          </View>
        }
        refreshControl={
          allEvents?.length > 0 ? (
            <RefreshControl refreshing={isLoading} onRefresh={onRefreshPage} />
          ) : undefined
        }
      /> */}

      {responseSubmitted && (
        <View style={styles.responseSubmitted}>
          <Image source={IMAGES.check1} style={styles.check1} />
          <Text style={styles.responseSubmittedText}>Response Submitted</Text>
        </View>
      )}

      <FeedSeriesDetail series={seriesDetail} setSeries={setSeriesDetail} />

      <FeedDetail
        detail={detail}
        setDetail={setDetail}
        handleNotify={handleNotify}
      />

      <FiltersSheet
        ref={filtersSheetRef}
        from="discoverEvents"
        onApplyFilter={onApplyFilter}
        onClearFilter={onClearFilter}
        selectedFiltersInParent={selectedFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  featuredContainer: {
    flexDirection: 'column',
    paddingHorizontal: horizontalMarginScale(10),
    paddingVertical: verticalMarginScale(20),
    width: Wp(100),
    backgroundColor: COLORS.lighter_gray,
    marginTop: verticalMarginScale(20),
  },
  title: {
    fontSize: fontScale(32),
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    lineHeight: 40,
    paddingLeft: horizontalMarginScale(12),
  },
  filterScrollView: {
    marginHorizontal: horizontalMarginScale(20),
    marginTop: verticalMarginScale(8),
    marginBottom: verticalMarginScale(8)
  },
  scrollView: {
    height: verticalScale(390),
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: Platform.OS === 'ios' ? verticalMarginScale(61) : 0,
  },
  responseSubmitted: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    bottom: 56,
    marginHorizontal: 'auto',
    height: horizontalScale(32),
    paddingHorizontal: horizontalMarginScale(6),
    paddingVertical: verticalMarginScale(6),
    borderRadius: radiusScale(6),
    backgroundColor: COLORS.grayMiddle,
  },
  responseSubmittedText: {
    color: COLORS.white,
  },
  check1: {
    width: horizontalScale(12),
    height: verticalScale(12),
    paddingVertical: verticalMarginScale(8),
    paddingHorizontal: horizontalMarginScale(8),
  },
});

export default EventsFeed;
