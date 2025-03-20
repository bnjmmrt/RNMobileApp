import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import IMAGES from '@images/index';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import Chip from 'src/component/Chip';
import GooglePlacesInput from 'src/component/GooglePlacesInput/GooglePlacesInput';
import Input, { InputRefMethods } from 'src/component/Input/Input';
import { COLORS } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import { SelectedFilters } from '.';
import { CustomText } from '../CustomText';
import { styles } from './style';
import moment from 'moment';

export type FilterOptionTypes =
  | 'checkbox'
  | 'age'
  | 'baseCityFilter'
  | 'location'
  | 'partySize'
  | 'dateRange'
  | 'minStartDate'
  | 'maxEndDate';

export type FilterOption = {
  id: string;
  name: string;
  options: FilterOption[];
};

const FilterOptions = ({
  id,
  optionType,
  options,
  selectedFilters,
  onChangeOptionValue,
  setDisableApplyCta,
  showSelectedLocationChip = true,
  onOpenNestedAccordian,
}: {
  id: string;
  optionType: FilterOptionTypes;
  options: FilterOption[];
  selectedFilters: SelectedFilters;
  onChangeOptionValue: (
    id: string,
    optionType: FilterOptionTypes,
    value: {
      id: string;
      name: string;
      date?: DateType[];
      lat?: string;
      long?: string;
    },
  ) => void;
  setDisableApplyCta: React.Dispatch<React.SetStateAction<boolean>>;
  showSelectedLocationChip?: boolean;
  onOpenNestedAccordian?: () => void;
}) => {
  const minAgeInputRef = useRef<InputRefMethods>(null);
  const maxAgeInputRef = useRef<InputRefMethods>(null);

  const [minAge, setMinAge] = useState<string>(
    ((selectedFilters && selectedFilters?.ageFrom?.value[0].id) as string) ||
      '',
  );
  const [maxAge, setMaxAge] = useState<string>(
    ((selectedFilters && selectedFilters?.ageTo?.value[0].id) as string) || '',
  );

  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (minAge && parseInt(minAge) < 18) {
      minAgeInputRef?.current?.setErrorMessage(
        'Minimum age must be 18 or older',
      );
      setDisableApplyCta(true);
    } else {
      minAgeInputRef?.current?.setErrorMessage('');
      setDisableApplyCta(false);
    }

    if (maxAge) {
      if (minAge && parseInt(maxAge) < parseInt(minAge)) {
        maxAgeInputRef?.current?.setErrorMessage(
          'Minimum age must be greater than or equal to "From" age',
        );
        setDisableApplyCta(true);
      } else {
        maxAgeInputRef?.current?.setErrorMessage('');
        setDisableApplyCta(false);
      }
    }
  }, [minAge, maxAge, setDisableApplyCta]);
  const minStartDate = selectedFilters['minStartDate']?.value[0]?.id;
  const maxEndDate = selectedFilters['maxEndDate']?.value[0]?.id;

  const formattedMinDate = dayjs(minStartDate).isValid()
    ? dayjs(minStartDate).format('DD/MM/YY')
    : '';
  const formattedMaxDate = dayjs(maxEndDate).isValid()
    ? dayjs(maxEndDate).format('DD/MM/YY')
    : 'No max date';

  console.log('selectedFilters', JSON.stringify(selectedFilters));

  return (
    <BottomSheetView>
      {optionType === 'checkbox' ? (
        <BottomSheetScrollView
          contentContainerStyle={{
            gap: horizontalMarginScale(4),
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          scrollEnabled={false}>
          {options.map((item: FilterOption, index: number) => {
            return (
              <Chip
                title={item.name}
                isSelected={
                  selectedFilters
                    ? selectedFilters[id]?.value?.some(
                        innerItem => innerItem.id === item.id,
                      )
                    : false || false
                }
                onPress={optionId => {
                  onChangeOptionValue(id, optionType, {
                    id: optionId,
                    name: item.name,
                  });
                }}
                id={item.id}
              />
            );
          })}
        </BottomSheetScrollView>
      ) : null}

      {optionType === 'dateRange' ? (
        <BottomSheetView style={styles.container}>
          <TouchableOpacity
            style={[styles.inputWrapper]}
            onPress={() => {
              setDatePickerVisible(prev => !prev);
              if (onOpenNestedAccordian) {
                onOpenNestedAccordian();
              }
            }}>
            <Image
              source={IMAGES.calendar}
              style={styles.icon}
              resizeMode="contain"
            />
            <BottomSheetView style={styles.inputValueWithLabel}>
              <CustomText>{`${formattedMinDate} - ${formattedMaxDate}`}</CustomText>
              <Image
                source={IMAGES.downArrow}
                style={styles.icon}
                resizeMode="contain"
              />
            </BottomSheetView>
          </TouchableOpacity>

          {datePickerVisible && (
            <BottomSheetView style={styles.datePicker}>
              <DateTimePicker
                mode="range"
                startDate={
                  selectedFilters['minStartDate']?.value[0]
                    ? selectedFilters['minStartDate']?.value[0]?.date ||
                      undefined
                    : undefined
                }
                endDate={
                  selectedFilters['maxEndDate']?.value[0]
                    ? selectedFilters['maxEndDate']?.value[0]?.date || undefined
                    : undefined
                }
                headerButtonStyle={styles.headerButtonStyle}
                headerContainerStyle={{ marginTop: 16 }}
                headerTextStyle={{
                  fontFamily: fontFamily.ABCDiatype_Regular,
                  fontSize: fontScale(14),
                }}
                minDate={new Date()}
                weekDaysTextStyle={{
                  fontFamily: fontFamily.ABCDiatype_Bold,
                  fontSize: fontScale(14),
                }}
                calendarTextStyle={{
                  fontFamily: fontFamily.ABCDiatype_Regular,
                  fontSize: fontScale(14),
                }}
                selectedItemColor={COLORS.black}
                selectedRangeBackgroundColor="lightgray"
                dayContainerStyle={styles.dayContainerStyle}
                buttonNextIcon={<Image source={IMAGES.arrowRight} />}
                buttonPrevIcon={
                  <Image
                    source={IMAGES.arrowRight}
                    style={{ transform: [{ rotate: '180deg' }] }}
                  />
                }
                onChange={({ startDate, endDate }) => {
                  onChangeOptionValue(id, optionType, {
                    id: id,
                    date: [startDate, endDate],
                    name: id,
                  });
                }}
              />
            </BottomSheetView>
          )}
        </BottomSheetView>
      ) : null}

      {optionType === 'age' ? (
        <BottomSheetView style={styles.optionAgeContainer}>
          <Input
            ref={minAgeInputRef}
            defaultValue={minAge}
            placeholder=""
            label="From"
            errorMessage=""
            forBottomSheet={true}
            otherStyle={{ flex: 1, marginTop: 0 }}
            inputFieldContainerStyle={{ height: verticalScale(40) }}
            onChangeText={text => {
              setMinAge(text);
              onChangeOptionValue('ageFrom', optionType, {
                id: text,
                name: text,
              });
            }}
            keyboardType="number-pad"
          />
          <Input
            ref={maxAgeInputRef}
            defaultValue={maxAge}
            placeholder=""
            label="To"
            errorMessage="Minimum age must be greater than or equal to 'From' age"
            forBottomSheet={true}
            otherStyle={{ flex: 1, marginTop: 0 }}
            inputFieldContainerStyle={{ height: verticalScale(40) }}
            onChangeText={text => {
              setMaxAge(text);
              onChangeOptionValue('ageTo', optionType, {
                id: text,
                name: text,
              });
            }}
            keyboardType="number-pad"
          />
        </BottomSheetView>
      ) : null}

      {optionType === 'baseCityFilter' || optionType === 'location' ? (
        <BottomSheetView>
          <GooglePlacesInput
            submit={() => {}}
            autoFetchCurrentLocation={true}
            allowFullAddres={false}
            defaultValue={
              optionType === 'baseCityFilter'
                ? selectedFilters &&
                  selectedFilters[id] &&
                  selectedFilters[id].value[0]?.name
                : selectedFilters['longitude']?.value[0]?.name || ''
            }
            setLocation={location => {
              onChangeOptionValue(id, optionType, {
                id: location.placeId,
                name: location.address,
                lat: location.latitude,
                long: location.longitude,
              });
            }}
          />
          {showSelectedLocationChip &&
          selectedFilters &&
          selectedFilters[id] &&
          selectedFilters[id].value ? (
            <BottomSheetScrollView
              contentContainerStyle={{
                gap: horizontalMarginScale(4),
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
              style={{ marginTop: verticalMarginScale(16) }}
              scrollEnabled={false}>
              {selectedFilters[id].value.map(
                (
                  item: {
                    id: string | DateType;
                    name: string;
                    lat?: string;
                    long?: string;
                  },
                  index: number,
                ) => {
                  return (
                    <Chip
                      title={item.name}
                      isSelected={
                        selectedFilters
                          ? selectedFilters[id]?.value?.includes(item)
                          : false || false
                      }
                      onPress={optionId => {
                        onChangeOptionValue(id, optionType, {
                          id: String(item.id),
                          name: item.name,
                        });
                      }}
                      id={String(item.id)}
                    />
                  );
                },
              )}
            </BottomSheetScrollView>
          ) : null}
        </BottomSheetView>
      ) : null}
    </BottomSheetView>
  );
};

export default FilterOptions;
