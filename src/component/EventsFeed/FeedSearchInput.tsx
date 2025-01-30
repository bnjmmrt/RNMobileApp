import React, {useState} from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Image} from 'react-native-animatable';
import IMAGES from '../../assets/images';
import {COLORS} from '../../utils/constants';
import {fontFamily} from '../../utils/functions';

interface FeedSearchInputProps {
  handleChange: (text: string) => void;
  handleSearch: () => void;
  handleClear: () => void;
  handleFilter: () => void;
}

const FeedSearchInput: React.FC<FeedSearchInputProps> = ({
  handleChange,
  handleSearch,
  handleClear,
  handleFilter,
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
            <Image source={IMAGES.filter} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    flex: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  inputWrapperFocused: {
    borderColor: '#222222',
  },
  icon: {
    marginRight: 10,
  },
  clearIcon: {
    width: 16,
    height: 16,
  },
  filter: {
    width: 30,
    height: 30,
    marginLeft: 6,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D8D8D8',
    borderRadius: 100,
  },
  filterIcon: {
    width: 16,
    height: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default FeedSearchInput;
