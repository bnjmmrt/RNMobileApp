import React, {useState} from 'react';
import {Modal, View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {BUTTON_LABLE, COLORS, feedList} from '../../utils/constants';
import {Wp} from '../../utils/dimensions';
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

  const handleToggle = (feed: string) => {
    if (feedFilters.includes(feed))
      setFeedFilters(prev => prev.filter(f => f !== feed));
    else setFeedFilters(prev => [...prev, feed]);
  };

  const handleShowResults = () => {
    setFilter(prev => ({
      ...prev,
      categories: feedFilters,
    }));
    setFilterVisible(false);
  };

  const handleClearFilters = () => {
    setFilter({
      location: '',
      categories: [],
      date: ['', ''],
    });
    setFeedFilters([]);
  };

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
                  <Text>Currect Location ({filter.location})</Text>
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
                    <Text>{`${dayjs(filter.date[0]).format(
                      'MM/DD/YY',
                    )} - ${dayjs(filter.date[1]).format('MM/DD/YY')}`}</Text>
                    <Image source={IMAGES.downArrow} style={styles.icon} />
                  </View>
                </View>
                {datePickerVisible && (
                  <View style={styles.datePicker}>
                    <DateTimePicker
                      mode="range"
                      startDate={filter.date[0]}
                      endDate={filter.date[1]}
                      headerButtonStyle={{
                        backgroundColor: '#D8D8D8',
                        borderRadius: 100,
                        padding: 8,
                      }}
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
    width: 48,
    height: 4,
    borderRadius: 50,
    backgroundColor: '#D8D8D8',
    top: -12,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    width: '100%',
    fontSize: 24,
    color: 'black',
    fontFamily: 'Times New Roman',
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'center',
    paddingBottom: 36,
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedItem: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 50,
    borderWidth: 1,
    color: 'white',
    backgroundColor: '#1F1F1F',
    borderColor: '#1F1F1F',
  },
  item: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 50,
    borderWidth: 1,
    color: 'black',
    backgroundColor: '#EEEEEE',
    borderColor: '#E1E1E1',
  },
  label: {
    marginTop: 36,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 20,
    top: '5%',
    height: '90%',
  },
  scrollPadding: {
    paddingHorizontal: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  locationName: {
    fontSize: 16,
  },
  showResults: {
    width: Wp(85),
    marginTop: 24,
    borderRadius: 100,
  },
  clearFilters: {
    width: Wp(85),
    marginTop: 8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 100,
  },
  container: {
    backgroundColor: 'white',
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
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingLeft: 12,
    paddingRight: 6,
  },
  datePicker: {
    borderRadius: 12,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    marginTop: 6,
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  icon: {
    width: 16,
    height: 17,
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  dayContainerStyle: {
    width: 40,
    marginHorizontal: 'auto',
    height: 40,
  },
});

export default FeedFilter;
