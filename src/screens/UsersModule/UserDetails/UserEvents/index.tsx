import FastImage from '@d11/react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import createStyle from './style';
import {horizontalMarginScale, verticalMarginScale} from 'src/utils/dimensions';
import SearchInput from 'src/component/SearchInput';

const dummyListData = [
  {
    name: 'Interest 1',
    users: '1233432',
  },
  {
    name: 'Interest 2',
    users: '1233432',
  },
  {
    name: 'Interest 3',
    users: '1233432',
  },
  {
    name: 'Interest 4',
    users: '1233432',
  },
  {
    name: 'Interest 5',
    users: '1233432',
  },
  {
    name: 'Interest 6',
    users: '1233432',
  },
  {
    name: 'Interest 7',
    users: '1233432',
  },
  {
    name: 'Interest 8',
    users: '1233432',
  },
];

interface UserEventsProps {}

const UserEvents: React.FC<UserEventsProps> = ({}) => {
  const styles = createStyle();
  const navigation = useNavigation();
  const searchInputRef = useRef<any>(null);

  const [searchText, setSearchText] = useState<string>('');

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const renderEventItem = useCallback(({item}: {item: any}) => {
    return (
      <View style={styles.userEventWrapper}>
        <FastImage
          source={{
            uri: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsb2ZmaWNlMTBfZmx1aWRfYWJzdHJhY3Rpb25fYmFja2dyb3VuZF9faGludF9vZl9wcmVjaXNpb18wMjk5YmM1ZS0yNjAyLTQxODgtOTExMy1kZTVkZTk1YWVmN2FfMS5qcGc.jpg',
          }}
          style={styles.userEventImage}
          resizeMode="cover"
        />
        <CustomText style={styles.userEventName}>{'Event Name'}</CustomText>
        <CustomText style={styles.userEventTime}>{'May 10, 9:00AM'}</CustomText>
      </View>
    );
  }, []);

  return (
    <View style={{marginTop: verticalMarginScale(6)}}>
      <SearchInput
        ref={searchInputRef}
        onSearchTextChange={handleSearchTextChange}
      />
      <FlatList
        data={dummyListData}
        renderItem={renderEventItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{gap: horizontalMarginScale(16)}}
        columnWrapperStyle={{gap: horizontalMarginScale(16)}}
        style={{
          marginHorizontal: horizontalMarginScale(12),
          marginTop: verticalMarginScale(16),
        }}
        bounces={false}
        numColumns={2}
      />
    </View>
  );
};

export default UserEvents;
