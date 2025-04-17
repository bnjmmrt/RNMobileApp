import { BottomSheetFlatList, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { Keyboard, TouchableOpacity, View } from 'react-native';
import { countriesRemover } from 'react-native-country-codes-picker/helpers/countriesRemover';
import { removeDiacritics } from 'react-native-country-codes-picker/helpers/diacriticsRemover';
import BottomSheetComponent, {
  BottomSheetMethods,
} from 'src/component/BottomSheet/BottomSheet';
import { CustomText } from 'src/component/CustomText';
import { InputRefMethods } from 'src/component/Input/Input';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  Hp,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import { CountryItem } from '../../../node_modules/react-native-country-codes-picker/types/Types';
import EventEmptyRecord from '../EmptyRecord/EventEmptyRecord';
import GradientSeprator from '../GradientSeprator';
import SearchInput from '../SearchInput';

const CountryPickerBottomSheet = forwardRef<
  BottomSheetMethods,
  {
    excludedCountries?: string[];
    showOnly?: string[];

    pickerButtonOnPress: (item: CountryItem) => any;
    closeCountryModal: () => void;

    lang: string;
    initialState?: string;
    selectedCountry?: any;
  }
>(
  (
    {
      pickerButtonOnPress,
      closeCountryModal,
      lang = 'en',
      excludedCountries,
      initialState,
      showOnly,
      selectedCountry,
    },
    ref,
  ) => {
    const sheetRef = useRef<BottomSheetMethods>(null);
    const searchInputRef = useRef<InputRefMethods>(null);

    let filteredCodes = countriesRemover(excludedCountries);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.open(),
      close: () => sheetRef.current?.close(),
    }));

    const [searchValue, setSearchValue] = React.useState<string>(
      initialState || '',
    );

    const codes = React.useMemo(() => {
      let newCodes = filteredCodes;

      if (showOnly?.length) {
        newCodes = filteredCodes?.filter(country => {
          return showOnly?.find(
            short => country?.code === short?.toUpperCase(),
          );
        });
      }
      newCodes.sort((a, b) =>
        a?.name[lang || 'en'].localeCompare(b?.name[lang || 'en']),
      );

      return newCodes;
    }, [showOnly, excludedCountries, lang]);

    const resultCountries = React.useMemo(() => {
      const lowerSearchValue = searchValue.toLowerCase();

      return codes.filter(country => {
        if (
          country?.dial_code.includes(searchValue) ||
          country?.name[lang || 'en']
            .toLowerCase()
            .includes(lowerSearchValue) ||
          removeDiacritics(country?.name[lang || 'en'].toLowerCase()).includes(
            lowerSearchValue,
          )
        ) {
          return country;
        }
      });
    }, [searchValue]);

    const renderItem = ({
      item,
      index,
    }: {
      item: CountryItem;
      index: number;
    }) => {
      let itemName = item?.name[lang];
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: COLORS.borderGray,
            borderWidth: 1,
            borderRadius: radiusScale(16),
            paddingHorizontal: horizontalMarginScale(16),
            paddingVertical: verticalMarginScale(12),
            marginHorizontal: horizontalMarginScale(12),
            gap: horizontalMarginScale(8),
          }}
          onPress={() => {
            Keyboard.dismiss();
            typeof pickerButtonOnPress === 'function' &&
              pickerButtonOnPress(item);
          }}>
          <CustomText style={{ fontSize: fontScale(24) }}>
            {item.flag}
          </CustomText>
          <CustomText
            style={{
              flex: 1,
              fontFamily: fontFamily.ABCDiatype_Medium,
            }}>
            {itemName}
          </CustomText>
          <CustomText style={{ color: COLORS.light_gray }}>
            {item.dial_code}
          </CustomText>
        </TouchableOpacity>
      );
    };

    return (
      <BottomSheetComponent
        ref={sheetRef}
        snapPoints={['90%']}
        enableDynamicSizing={false}
        onClose={() => sheetRef?.current?.close()}>
        <BottomSheetView style={{ flex: 1 }}>
          <CustomText
            style={{
              fontSize: fontScale(32),
              alignSelf: 'center',
              fontFamily: fontFamily.RomieTrial_Bold,
            }}>
            {'Select a Country'}
          </CustomText>

          <SearchInput
            ref={searchInputRef}
            onSearchTextChange={setSearchValue}
            placeholder={'Search location'}
            placeholderTextColor={COLORS.placeHodler}
            mainContainerStyle={{
              marginHorizontal: horizontalMarginScale(12),
              marginTop: verticalMarginScale(32),
            }}
            defaultValue={searchValue}
          />

          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            data={resultCountries || codes}
            keyExtractor={(item, index) => '' + item + index}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            keyboardDismissMode={'on-drag'}
            style={{ marginTop: verticalMarginScale(16), flex: 1 }}
            contentContainerStyle={{ gap: verticalMarginScale(4) }}
            keyboardShouldPersistTaps={'handled'}
            renderItem={renderItem}
            testID="countryCodesPickerFlatList"
            ListHeaderComponent={
              selectedCountry ? (
                <BottomSheetView>
                  {renderItem({ item: selectedCountry, index: 9999999999 })}
                  <GradientSeprator
                    style={{
                      marginTop: verticalMarginScale(16),
                      marginBottom: verticalMarginScale(12),
                    }}
                  />
                </BottomSheetView>
              ) : null
            }
            ListEmptyComponent={
              <View
                style={{
                  height: Hp(50),
                  justifyContent: 'center',
                }}>
                <EventEmptyRecord
                  title={'No Results'}
                  subTitle={'Please refine your search.'}
                  isLoading={false}
                />
              </View>
            }
          />
        </BottomSheetView>
      </BottomSheetComponent>
    );
  },
);

export default CountryPickerBottomSheet;
