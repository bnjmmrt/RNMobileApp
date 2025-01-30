import React, {useState} from 'react';
import {Modal, View, StyleSheet, Text, ScrollView, Image} from 'react-native';
import {BUTTON_LABLE, COLORS, feedList} from '../../utils/constants';
import {Wp} from '../../utils/dimensions';
// import DateRangePicker from 'react-native-daterange-picker';
import Button from '../Button';
import {fontFamily} from '../../utils/functions';
import IMAGES from '../../assets/images';
import moment from 'moment';

interface FeedFilterProps {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
  filterVisible: boolean;
  setFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
}

interface DateRange {
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
}

const FeedFilter: React.FC<FeedFilterProps> = ({
  filters,
  setFilters,
  filterVisible,
  setFilterVisible,
  setLocationVisible,
  handleSubmit,
}) => {
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [displayedDate] = useState<moment.Moment>(moment());

  const setDates = (dates: DateRange) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
  };

  const handleToggle = (feed: string) => {
    if (filters.includes(feed))
      setFilters(prev => prev.filter(f => f !== feed));
    else setFilters(prev => [...prev, feed]);
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
                    filters.includes(feed) ? styles.selectedItem : styles.item
                  }
                  key={feed}
                  onPress={() => handleToggle(feed)}>
                  {feed}
                </Text>
              ))}
            </View>

            <View>
              <Text style={styles.label}>Location</Text>
              <View style={styles.container} onTouchEnd={() => setLocationVisible(true)}>
                <View style={[styles.inputWrapper]}>
                  <Image source={IMAGES.search} style={styles.icon} />
                  <Text>Currect Location ()</Text>
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Date Range</Text>
              <View style={styles.container}>
                {/* <DateRangePicker
                  onChange={setDates}
                  endDate={endDate}
                  startDate={startDate}
                  displayedDate={displayedDate}
                  range>
                  <Text>Click me!</Text>
                </DateRangePicker> */}
              </View>
            </View>

            <Button
              disabled={false}
              style={styles.showResults}
              title={BUTTON_LABLE.SHOW_RESULTS}
              colorTheme="dark"
              onPress={handleSubmit}
            />

            <Button
              disabled={false}
              style={styles.clearFilters}
              title={BUTTON_LABLE.CLEAR_FILTERS}
              onPress={handleSubmit}
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
    flexDirection: 'row',
    backgroundColor: 'white',
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
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default FeedFilter;
