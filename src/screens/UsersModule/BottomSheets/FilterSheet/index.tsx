import {BottomSheetView} from '@gorhom/bottom-sheet';
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {verticalScale} from 'src/utils/dimensions';
import AllUsersFilters from './AllUsersFilters';
import {FilterOptionTypes} from './FilterOptions';
import {styles} from './style';

export type SelectedSingleFilter = {
  type: FilterOptionTypes;
  value: {id: string; name: string}[];
};
export type SelectedFilters = {
  [id: string]: SelectedSingleFilter;
};

const FiltersSheet = forwardRef<
  BottomSheetMethods,
  {
    onApplyFilter: (query: string, numberOfFiltersApplied: number) => void;
    onClearFilter: () => void;
    from: 'allUsersList';
    showBottomSafeAreaView: boolean;
  }
>(({onApplyFilter, onClearFilter, from, showBottomSafeAreaView}, ref) => {
  const sheetRef = useRef<BottomSheetMethods>(null);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.open(),
    close: () => sheetRef.current?.close(),
    showFlashMessage: (type, message) =>
      sheetRef.current?.showFlashMessage(type, message),
  }));

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
  const [disableApplyCta, setDisableApplyCta] = useState<boolean>(false);

  const onPressApplyFilter = async () => {
    const queryString = Object.entries(selectedFilters)
      .map(([key, filter]) => {
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          const values = filter.value.map((item: any) => item.id).join(',');
          return `${key}=${values}`;
        }
        return null;
      })
      .filter(Boolean)
      .join('&');

    const appliedFiltersCount = Object.values(selectedFilters).filter(
      filter => Array.isArray(filter.value) && filter.value.length > 0,
    ).length;

    onApplyFilter(queryString, appliedFiltersCount);
    sheetRef?.current?.close();
  };
  const onPressClearFilter = async () => {
    setSelectedFilters({});
    onClearFilter();
    sheetRef?.current?.close();
  };

  return (
    <BottomSheetComponent
      ref={sheetRef}
      snapPoints={[`${verticalScale(85)}%`]}
      enableDynamicSizing={false}
      onClose={() => {}}
      showBottomSafeAreaView={showBottomSafeAreaView}>
      <BottomSheetView style={styles.container}>
        <CustomText style={styles.title}>{'Filters'}</CustomText>

        {from === 'allUsersList' ? (
          <AllUsersFilters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setDisableApplyCta={setDisableApplyCta}
          />
        ) : null}

        <BottomSheetView style={styles.actionsContainer}>
          <Button
            title="Clear All"
            style={styles.clearAllCta}
            onPress={onPressClearFilter}
          />
          <Button
            title="Apply"
            colorTheme="dark"
            style={styles.applyCta}
            onPress={onPressApplyFilter}
            disabled={disableApplyCta}
          />
        </BottomSheetView>
      </BottomSheetView>
    </BottomSheetComponent>
  );
});

export default FiltersSheet;
