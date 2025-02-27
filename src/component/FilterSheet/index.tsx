import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import { verticalScale } from 'src/utils/dimensions';
import AllUsersFilters from './AllUsersFilters';
import DiscoverEventsFilters from './DiscoverEventsFilters';
import { FilterOptionTypes } from './FilterOptions';
import { styles } from './style';
import { DateType } from 'react-native-ui-datepicker';

export type SelectedSingleFilter = {
  type: FilterOptionTypes;
  value: {
    id: string | DateType;
    name: string;
    date?: DateType;
    lat?: string;
    long?: string;
  }[];
};
export type SelectedFilters = {
  [id: string]: SelectedSingleFilter;
};

type FiltersSheetProps = {
  onApplyFilter: (
    query: string,
    numberOfFiltersApplied: number,
    selectedFilters?: SelectedFilters,
  ) => void;
  onClearFilter: () => void;
  from: 'allUsersList' | 'discoverEvents';
  selectedFiltersInParent?: SelectedFilters;
};

export const getFilterQuery = (selectedFilters: SelectedFilters) => {
  const queryString = Object.entries(selectedFilters)
    .map(([key, filter]) => {
      if (Array.isArray(filter.value) && filter.value.length > 0) {
        const values = filter.value
          .map((item: any) => encodeURIComponent(item.id))
          .join(',');
        return `${key}=${values}`;
      }
      return null;
    })
    .filter(Boolean)
    .join('&');

  const filtersCount = Object.values(selectedFilters).filter(
    filter =>
      Array.isArray(filter.value) && filter.value.some(item => item.name),
  ).length;

  return { queryString, filtersCount };
};

const FiltersSheet = forwardRef<BottomSheetMethods, FiltersSheetProps>(
  ({ onApplyFilter, onClearFilter, from, selectedFiltersInParent }, ref) => {
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
      const { queryString, filtersCount } = getFilterQuery(selectedFilters);

      onApplyFilter(
        queryString,
        filtersCount,
        selectedFilters ? selectedFilters : {},
      );
      sheetRef?.current?.close();
    };

    const onPressClearFilter = async () => {
      setSelectedFilters({});
      onClearFilter();
      sheetRef?.current?.close();
    };

    const getHeading = () => {
      switch (from) {
        case 'allUsersList':
          return 'Filters';
        case 'discoverEvents':
          return 'Filter Your Feed';
      }
    };

    useEffect(() => {
      if (selectedFiltersInParent) {
        setSelectedFilters(selectedFiltersInParent);
      }
    }, [selectedFiltersInParent]);

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={[`${verticalScale(88)}%`]}
        enableDynamicSizing={false}
        onClose={() => {}}>
        <BottomSheetView style={styles.container}>
          <CustomText style={styles.title}>{getHeading()}</CustomText>

          {from === 'allUsersList' ? (
            <AllUsersFilters
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              setDisableApplyCta={setDisableApplyCta}
            />
          ) : null}
          {from === 'discoverEvents' ? (
            <DiscoverEventsFilters
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
  },
);

export default FiltersSheet;
