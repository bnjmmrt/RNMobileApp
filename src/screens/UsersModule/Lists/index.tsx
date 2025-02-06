import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import DeleteListSheet from '../BottomSheets/DeleteListSheet';
import ListItem from '../ListItem';
import createStyle from './style';
import {AppStackParamList} from 'src/navigation/AppStack';
import {useFetchAllUsersQuery} from 'src/redux/actions/usersApiAction';

interface ListsProps {}

const Lists: React.FC<ListsProps> = ({}) => {
  const styles = createStyle();
  const navigation = useNavigation<NavigationProp<AppStackParamList>>();
  const deleteListSheetRef = useRef(null);

  const [allCustomLists, setAllCustomLists] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const {data, isLoading} = useFetchAllUsersQuery({
    take: 10,
    skip: (currentPage - 1) * 10,
  });

  useEffect(() => {
    if (data) {
      setAllCustomLists(prev =>
        currentPage === 1 ? data.data : [...prev, ...data.data],
      );
    }
  }, [data]);

  console.log(allCustomLists);

  const loadMore = () => {
    if (data?.totalCount < data?.users?.length && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const renderItem = useCallback(
    ({item, index}: {item: number; index: number}) => {
      return (
        <ListItem
          showDelete={true}
          index={index}
          title={'List ' + (index + 1)}
          onPressDelete={() => {
            deleteListSheetRef?.current?.open();
          }}
        />
      );
    },
    [],
  );

  return (
    <View style={styles.container}>
      <View style={{gap: 8}}>
        <ListItem showDelete={false} index={12} title="My Followers" />
        <ListItem showDelete={false} index={13} title="My Favorites" />
      </View>
      <View style={styles.seprator} />
      <FlatList
        data={[1, 2, 3, 4]}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{gap: 10}}
        contentContainerStyle={{gap: 16}}
        ListFooterComponent={<View />}
      />

      <DeleteListSheet ref={deleteListSheetRef} />
    </View>
  );
};

export default Lists;
