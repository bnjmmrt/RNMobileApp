import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Image} from 'react-native-animatable';
import IMAGES from '../../assets/images';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';
import { fontScale, horizontalMarginScale, horizontalScale, radiusScale, verticalMarginScale, verticalScale } from '../../utils/dimensions';

interface FeedSearchInputProps {
  handleChange: (text: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
  handleFilter: () => void;
  filterLength: number;
}

const FeedSearchInput: React.FC<FeedSearchInputProps> = ({
  handleChange,
  handleSearch,
  handleClear,
  handleFilter,
  filterLength,
}) => {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    handleChange(text);
  };

  const handleClearClick = () => {
    handleClear();
    handleTextChange('');
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
        <Image source={IMAGES.search} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Search for an event..."
          keyboardType="default"
          value={searchText}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchText && (
          <TouchableOpacity onPress={handleClearClick}>
            <Image source={IMAGES.clear} style={styles.clearIcon} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleFilter} style={styles.filter}>
          {filterLength > 0 && <Text style={styles.black}>{filterLength}</Text>}
          <Image source={IMAGES.filter} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
    marginBottom: verticalMarginScale(20),
    backgroundColor: COLORS.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: horizontalScale(50),
    borderWidth: 1,
    flex: 1,
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(10),
    backgroundColor: COLORS.white,
    paddingHorizontal: horizontalMarginScale(20),
  },
  inputWrapperFocused: {
    borderColor: COLORS.grayFeed,
  },
  icon: {
    marginRight: horizontalMarginScale(10),
  },
  clearIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  filter: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(30),
    gap: 4,
    paddingHorizontal: horizontalMarginScale(8),
    marginLeft: horizontalMarginScale(6),
    backgroundColor: COLORS.tabBorderColor,
    borderRadius: radiusScale(100),
    color: COLORS.black,
  },
  filterIcon: {
    width: horizontalScale(16),
    height: verticalScale(16),
  },
  input: {
    flex: 1,
    fontSize: fontScale(14),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
  black: {
    color: COLORS.black,
  },
});

export default FeedSearchInput;
