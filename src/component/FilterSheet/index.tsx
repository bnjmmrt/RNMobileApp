import { BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { DateType } from 'react-native-ui-datepicker';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import Button from 'src/component/Button';
import { CustomText } from 'src/component/CustomText';
import AllUsersFilters from './AllUsersFilters';
import DiscoverEventsFilters from './DiscoverEventsFilters';
import { FilterOptionTypes } from './FilterOptions';
import { styles } from './style';

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

export type FilterSheetFromType =
  | 'allUsersList'
  | 'discoverEvents'
  | 'listDetail';

type FiltersSheetProps = {
  onApplyFilter: (
    query: string,
    numberOfFiltersApplied: number,
    selectedFilters?: SelectedFilters,
  ) => void;
  onClearFilter: () => void;
  from: FilterSheetFromType;
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
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    const onPressApplyFilter = async () => {
      const { queryString, filtersCount } = getFilterQuery(selectedFilters);
      onApplyFilter(queryString, filtersCount, selectedFilters || {});
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
        case 'listDetail':
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

    useEffect(() => {
      const showEvent =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
      const hideEvent =
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

      const keyboardShowListener = Keyboard.addListener(showEvent, () => {
        setIsKeyboardOpen(true);
      });

      const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
        setIsKeyboardOpen(false);
      });

      return () => {
        keyboardShowListener.remove();
        keyboardHideListener.remove();
      };
    }, []);

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={[`${isKeyboardOpen ? 100 : 88}%`]}
        enableDynamicSizing={false}
        onClose={() => {}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}>
            <BottomSheetView style={styles.container}>
              <CustomText style={styles.title}>{getHeading()}</CustomText>

              {from === 'allUsersList' || from === 'listDetail' ? (
                <AllUsersFilters
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  setDisableApplyCta={setDisableApplyCta}
                  from={from}
                />
              ) : null}
              {from === 'discoverEvents' ? (
                <DiscoverEventsFilters
                  selectedFilters={selectedFilters}
                  setSelectedFilters={setSelectedFilters}
                  setDisableApplyCta={setDisableApplyCta}
                />
              ) : null}

              {!isKeyboardOpen ? (
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
              ) : null}
            </BottomSheetView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </BottomSheetComponent>
    );
  },
);

export default FiltersSheet;
