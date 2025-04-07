import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { COLORS } from 'src/utils/constants';
import { verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import { styles } from './style';

export type FilterTypes =
  | 'UPCOMING'
  | 'INVITED'
  | 'APPLIED'
  | 'PAST'
  | 'DECLINED'
  | 'UPCOMING,INVITED,APPLIED,PAST,DECLINED';
export type Filter = {
  label: string;
  value: FilterTypes;
};

export interface EventFilterSheetInterface {
  filterData: Filter[];
  selectedFilter: Filter;
  setSelectedFilter: React.Dispatch<React.SetStateAction<Filter>>;
  onPressSave: (selectedFilter: Filter) => void;
}

const EventFilterSheet = forwardRef<
  BottomSheetMethods,
  EventFilterSheetInterface
>(({ selectedFilter, setSelectedFilter, filterData, onPressSave }, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);

  const [tempSelectedFilter, setTempSelectedFilter] = useState<Filter | null>(
    null,
  );

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
  }));

  const closeSheet = () => {
    sheetRef?.current?.close();
  };

  const renderListRow = useCallback(
    ({ item, index }: { item: Filter; index: number }) => {
      const isSelected = item.value === tempSelectedFilter?.value;
      return (
        <Button
          title={item.label}
          style={[
            styles.actionButton,
            isSelected && { borderColor: COLORS.black },
          ]}
          onPress={() => setTempSelectedFilter(item)}
        />
      );
    },
    [tempSelectedFilter],
  );

  useEffect(() => {
    setTempSelectedFilter(selectedFilter);
  }, [selectedFilter]);

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={['60%', '70%']}
      enableDynamicSizing={false}
      onClose={() => {
        closeSheet();
      }}
      footer={
        <Button
          title="Save"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={() => {
            if (tempSelectedFilter) {
              onPressSave(tempSelectedFilter);
            }
          }}
          disabled={!tempSelectedFilter}
        />
      }>
      <BottomSheetView style={{ flex: 1 }}>
        <BottomSheetFlatList
          data={filterData}
          renderItem={renderListRow}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: verticalScale(8) }}
          ListFooterComponent={<></>}
          ListHeaderComponent={<></>}
          windowSize={4}
        />
      </BottomSheetView>
    </BottomSheetComponent>
  );
});

export default EventFilterSheet;
