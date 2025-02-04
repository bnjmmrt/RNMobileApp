import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import Button from 'src/component/Button';
import {styles} from './style';

const AddToList = ({
  onPressBack,
  onSuccess,
  onPressCreateList,
}: {
  onPressBack: () => void;
  onSuccess: () => void;
  onPressCreateList: () => void;
}) => {
  const renderListRow = useCallback(
    ({item, index}: {item: any; index: number}) => {
      return (
        <Button
          title={'List ' + (index + 1)}
          style={[styles.actionButton]}
          onPress={onSuccess}
        />
      );
    },
    [],
  );

  return (
    <View style={styles.actionContentWrapper}>
      <FlatList
        data={[1, 1, 1, 1]}
        renderItem={renderListRow}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{gap: 8}}
        style={{marginBottom: 24, marginTop: 16}}
      />

      <Button
        title="Add to List"
        colorTheme="dark"
        style={styles.actionCta}
        onPress={onSuccess}
      />
      <Button
        title="Create a List"
        // colorTheme="dark"
        style={[styles.actionCta, styles.createListCta]}
        onPress={onPressCreateList}
      />
    </View>
  );
};

export default AddToList;
