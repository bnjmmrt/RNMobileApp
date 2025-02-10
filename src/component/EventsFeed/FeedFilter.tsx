import React, {useEffect, useState} from 'react';
import {Modal, View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {BUTTON_LABLE, COLORS, feedList} from '../../utils/constants';
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
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import IMAGES from '../../assets/images';
import moment from 'moment';
import type {Filter} from './EventsFeed';

interface FeedFilterProps {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  filterVisible: boolean;
  setFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DateRange {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

const FeedFilter: React.FC<FeedFilterProps> = ({
  filter,
  setFilter,
  filterVisible,
  setFilterVisible,
  setLocationVisible,
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);
  const [feedFilters, setFeedFilters] = useState<string[]>(filter.categories);
  const [alert, setAlert] = useState<boolean>(false);

  const handleToggle = (feed: string) => {
    if (feedFilters.includes(feed))
      setFeedFilters(prev => prev.filter(f => f !== feed));
    else setFeedFilters(prev => [...prev, feed]);
  };

  const handleShowResults = () => {
    if (filter.date[0] && !filter.date[1]) {
      setAlert(true);
      return null;
    }

    setFilter(prev => ({
      ...prev,
      categories: feedFilters,
    }));

    setFilterVisible(false);
  };

  const handleClearFilters = () => {
    setFilter({
      location: {address: '', placeId: '', latitude: '', longitude: ''},
      categories: [],
      date: ['', ''],
    });
    setFeedFilters([]);
  };

  useEffect(() => {
    setFeedFilters(filter.categories);
  }, [setFeedFilters, filter.categories, filterVisible]);

  if (!filterVisible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterVisible}
      onRequestClose={() => setFilterVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalBar} />

          <ScrollView style={styles.scrollPadding}>
            <Text style={styles.title}>Filter Your Feed</Text>

            <View style={styles.list}>
              {feedList.map(feed => (
                <Text
                  style={
                    feedFilters.includes(feed)
                      ? styles.selectedItem
                      : styles.item
                  }
                  key={feed}
                  onPress={() => handleToggle(feed)}>
                  {feed}
                </Text>
              ))}
            </View>

            <View>
              <Text style={styles.label}>Location</Text>
              <View
                style={styles.container}
                onTouchEnd={() => setLocationVisible(true)}>
                <View style={[styles.inputWrapper]}>
                  <Image source={IMAGES.search} style={styles.icon} />
                  <Text>Currect Location ({filter.location.address})</Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Date Range</Text>
              <View style={styles.container}>
                <View
                  style={[styles.inputWrapper]}
                  onTouchEnd={() => setDatePickerVisible(prev => !prev)}>
                  <Image source={IMAGES.calendar} style={styles.icon} />
                  <View style={styles.inputValueWithLabel}>
                    <Text>{`${
                      filter.date[0]
                        ? dayjs(filter.date[0]).format('MM/DD/YY')
                        : ''
                    } - ${
                      filter.date[1]
                        ? dayjs(filter.date[1]).format('MM/DD/YY')
                        : ''
                    }`}</Text>
                    <Image source={IMAGES.downArrow} style={styles.icon} />
                  </View>
                </View>

                {alert && (
                  <Text style={styles.alert}>Please choose an End Date.</Text>
                )}

                {datePickerVisible && (
                  <View style={styles.datePicker}>
                    <DateTimePicker
                      mode="range"
                      startDate={filter.date[0]}
                      endDate={filter.date[1]}
                      headerButtonStyle={styles.headerButtonStyle}
                      selectedItemColor="black"
                      selectedRangeBackgroundColor="lightgray"
                      dayContainerStyle={styles.dayContainerStyle}
                      onChange={({startDate, endDate}) =>
                        setFilter(prev => ({
                          ...prev,
                          date: [startDate, endDate],
                        }))
                      }
                      headerContainerStyle={{marginTop: 16}}
                    />
                  </View>
                )}
              </View>
            </View>

            <Button
              disabled={false}
              style={styles.showResults}
              title={BUTTON_LABLE.SHOW_RESULTS}
              colorTheme="dark"
              onPress={handleShowResults}
            />

            <Button
              disabled={false}
              style={styles.clearFilters}
              title={BUTTON_LABLE.CLEAR_FILTERS}
              onPress={handleClearFilters}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBar: {
    width: horizontalScale(48),
    height: verticalScale(4),
    borderRadius: radiusScale(50),
    backgroundColor: COLORS.tabBorderColor,
    top: -12,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    width: Wp(100),
    fontSize: fontScale(24),
    color: COLORS.black,
    fontFamily: fontFamily.RomieTrial_Bold,
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'center',
    paddingBottom: verticalMarginScale(36),
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedItem: {
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    borderRadius: radiusScale(50),
    borderWidth: 1,
    color: COLORS.white,
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  headerButtonStyle: {
    backgroundColor: COLORS.tabBorderColor,
    borderRadius: radiusScale(100),
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(8),
  },
  alert: {
    color: COLORS.red,
  },
  item: {
    paddingVertical: verticalMarginScale(12),
    paddingHorizontal: horizontalMarginScale(16),
    borderRadius: radiusScale(50),
    borderWidth: 1,
    color: COLORS.black,
    backgroundColor: COLORS.lighter_gray,
    borderColor: COLORS.borderGray,
  },
  label: {
    marginTop: verticalMarginScale(36),
    marginBottom: verticalMarginScale(4),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.grayMiddle,
  },
  modalContent: {
    width: Wp(100),
    backgroundColor: COLORS.white,
    borderRadius: radiusScale(25),
    paddingVertical: verticalMarginScale(20),
    top: '5%',
    height: Hp(90),
  },
  scrollPadding: {
    paddingHorizontal: horizontalMarginScale(20),
  },
  flag: {
    fontSize: fontScale(20),
    marginRight: horizontalMarginScale(10),
  },
  locationName: {
    fontSize: fontScale(16),
  },
  showResults: {
    width: Wp(85),
    marginTop: verticalMarginScale(24),
    borderRadius: radiusScale(100),
  },
  clearFilters: {
    width: Wp(85),
    marginTop: verticalMarginScale(8),
    borderColor: COLORS.black,
    borderWidth: 2,
    borderRadius: radiusScale(100),
  },
  container: {
    backgroundColor: COLORS.white,
  },
  inputValueWithLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: verticalScale(60),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    backgroundColor: COLORS.white,
    paddingLeft: horizontalMarginScale(12),
    paddingRight: horizontalMarginScale(6),
  },
  datePicker: {
    borderRadius: radiusScale(12),
    borderColor: COLORS.borderGray,
    borderWidth: 1,
    marginTop: verticalMarginScale(6),
    paddingBottom: verticalMarginScale(24),
    paddingHorizontal: horizontalMarginScale(12),
  },
  icon: {
    width: horizontalScale(12),
    height: verticalScale(16),
    marginRight: horizontalMarginScale(6),
  },
  input: {
    flex: 1,
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  dayContainerStyle: {
    width: 40,
    height: 40,
    marginHorizontal: 'auto',
  },
});

export default FeedFilter;
