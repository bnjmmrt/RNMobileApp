import React, {forwardRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../utils/constants';
import BottomSheetComponent from '../../component/BottomSheet/BottomSheet';
import {
  fontScale,
  horizontalMarginScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';

interface ListComponentBottomSheetProps {
  selectedItem: (item: any) => void;
  list: any[];
  snapPoints?: any;
}

const ListComponentBottomSheet = forwardRef(
  (props: ListComponentBottomSheetProps, ref:any) => {
    const handleSelect = (item: any) => {
      props.selectedItem(item);
      ref.current?.close();
    };

    return (
      <BottomSheetComponent
        ref={ref}
        snapPoints={props.snapPoints}
        onClose={() => console.log(ref)}>
        <View style={styles.container}>
          {props.list.map(item => {
            return (
              <TouchableOpacity
                key={item.id.toString()}
                style={styles.button}
                onPress={() => handleSelect(item)}>
                <Text style={styles.buttonText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheetComponent>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalMarginScale(12),
  },
  button: {
    borderWidth: verticalScale(1),
    borderColor: COLORS.lighter_gray,
    borderRadius: radiusScale(25),
    backgroundColor: COLORS.white,
    marginTop: verticalMarginScale(5),
  },
  buttonText: {
    fontSize: fontScale(14),
    color: COLORS.black,
    textAlign: 'center',
    padding: verticalScale(14),
    lineHeight: verticalScale(16),
  },
});
export default ListComponentBottomSheet;
