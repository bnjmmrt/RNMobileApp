import React from 'react';
import {
  FlatList,
  TextInput,
  View,
  Text,
  Animated,
  Dimensions,
  Easing,
  Platform,
  Keyboard,
  ViewStyle,
  Modal,
  TextStyle,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import {
  CountryItem,
  ItemTemplateProps,
  Style,
  ListHeaderComponentProps,
} from '../../../node_modules/react-native-country-codes-picker/types/Types';
import { useKeyboardStatus } from '../../../node_modules/react-native-country-codes-picker/helpers/useKeyboardStatus';
import { CountryButton } from '../../../node_modules/react-native-country-codes-picker/components/CountryButton';
import { countriesRemover } from '../../../node_modules/react-native-country-codes-picker/helpers/countriesRemover';
import { removeDiacritics } from '../../../node_modules/react-native-country-codes-picker/helpers/diacriticsRemover';
import { fontFamily } from '../../utils/functions';
import IMAGES from '../../assets/images';
import { verticalMarginScale } from 'src/utils/dimensions';
import { COLORS } from 'src/utils/constants';
import EventEmptyRecord from '../EmptyRecord/EventEmptyRecord';

export { countryCodes } from '../../../node_modules/react-native-country-codes-picker/constants/countryCodes';
export { CountryButton } from '../../../node_modules/react-native-country-codes-picker/components/CountryButton';
export type {
  CountryItem,
  ItemTemplateProps,
  Style,
  ListHeaderComponentProps,
} from '../../../node_modules/react-native-country-codes-picker/types/Types';

const height = Dimensions.get('window').height;

/**
 * Country picker component
 * @param {?boolean} show Hide or show component by using this props
 * @param {?boolean} disableBackdrop Hide or show component by using this props
 * @param {?boolean} enableModalAvoiding Is modal should avoid keyboard ? On android to work required to use with androidWindowSoftInputMode with value pan, by default android will avoid keyboard by itself
 * @param {?string} androidWindowSoftInputMode Hide or show component by using this props
 * @param {?string} inputPlaceholder Text to showing in input
 * @param {?string} searchMessage Text to show user when no country to show
 * @param {?string} lang Current selected lang by user
 * @param {?string} initialState Here you should define initial dial code
 * @param {?array} excludedCountries Array of countries which should be excluded from picker
 * @param {Function} pickerButtonOnPress Function to receive selected country
 * @param {Function} onBackdropPress Function to receive selected country
 * @param {Function} onRequestClose Function to receive selected country
 * @param {?Object} style Styles
 * @param {?React.ReactNode} itemTemplate Country list template
 * @param rest
 */

interface Props {
  excludedCountries?: string[];
  showOnly?: string[];
  popularCountries?: string[];

  style?: Style;

  show: boolean;
  enableModalAvoiding?: boolean;
  disableBackdrop?: boolean;

  onBackdropPress?: (...args: any) => any;
  pickerButtonOnPress: (item: CountryItem) => any;
  closeCountryModal: () => void;
  itemTemplate?: (props: ItemTemplateProps) => JSX.Element;
  ListHeaderComponent?: (props: ListHeaderComponentProps) => JSX.Element;
  onRequestClose?: (...args: any) => any;

  lang: string;
  inputPlaceholder?: string;
  inputPlaceholderTextColor?: TextStyle['color'];
  searchMessage?: string;
  androidWindowSoftInputMode?: string;
  initialState?: string;
  selectedCountry?: any
}

export const CountryPicker = ({
  show,
  popularCountries,
  pickerButtonOnPress,
  closeCountryModal,
  inputPlaceholder,
  inputPlaceholderTextColor,
  searchMessage,
  lang = 'en',
  style,
  enableModalAvoiding,
  androidWindowSoftInputMode,
  onBackdropPress,
  disableBackdrop,
  excludedCountries,
  initialState,
  onRequestClose,
  showOnly,
  ListHeaderComponent,
  itemTemplate: ItemTemplate = CountryButton,
  selectedCountry,
  ...rest
}: Props) => {
  // ToDo refactor exclude and showOnly props to objects
  let filteredCodes = countriesRemover(excludedCountries);
  const keyboardStatus = useKeyboardStatus();
  const animationDriver = React.useRef(new Animated.Value(0)).current;
  const animatedMargin = React.useRef(new Animated.Value(0)).current;
  const [searchValue, setSearchValue] = React.useState<string>(
    initialState || '',
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (show) {
      setShowModal(true);
    } else {
      closeModal();
    }
  }, [show]);

  React.useEffect(() => {
    if (
      enableModalAvoiding &&
      (keyboardStatus.keyboardPlatform === 'ios' ||
        (keyboardStatus.keyboardPlatform === 'android' &&
          androidWindowSoftInputMode === 'pan'))
    ) {
      if (keyboardStatus.isOpen)
        Animated.timing(animatedMargin, {
          toValue: keyboardStatus.keyboardHeight,
          duration: 190,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();

      if (!keyboardStatus.isOpen)
        Animated.timing(animatedMargin, {
          toValue: 0,
          duration: 190,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start();
    }
  }, [keyboardStatus.isOpen]);

  const preparedPopularCountries = React.useMemo(() => {
    return filteredCodes?.filter(country => {
      return popularCountries?.find(
        short => country?.code === short?.toUpperCase(),
      );
    });
  }, [popularCountries]);

  const codes = React.useMemo(() => {
    let newCodes = filteredCodes;

    if (showOnly?.length) {
      newCodes = filteredCodes?.filter(country => {
        return showOnly?.find(short => country?.code === short?.toUpperCase());
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
        country?.name[lang || 'en'].toLowerCase().includes(lowerSearchValue) ||
        removeDiacritics(country?.name[lang || 'en'].toLowerCase()).includes(
          lowerSearchValue,
        )
      ) {
        return country;
      }
    });
  }, [searchValue]);

  const modalPosition = animationDriver.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
    extrapolate: 'clamp',
  });

  const modalBackdropFade = animationDriver.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const openModal = () => {
    Animated.timing(animationDriver, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setSearchValue('')
    Animated.timing(animationDriver, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowModal(false));
  };

  const renderItem = ({ item, index }: { item: CountryItem; index: number }) => {
    let itemName = item?.name[lang];
    let checkName = itemName?.length ? itemName : item?.name['en'];
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 10,
          borderColor: '#E1E1E1',
          borderWidth: 1,
          borderRadius: 10,
          marginBottom: 5,
          alignItems: 'center',
          paddingHorizontal: 20,
        }} // Combine default and passed styles
        onPress={() => {
          Keyboard.dismiss();
          typeof pickerButtonOnPress === 'function' &&
            pickerButtonOnPress(item);
        }}>
        <Text style={[style?.flag, { fontSize: 25, marginEnd: 10 }]}>
          {item.flag}
        </Text>
        <Text
          style={[
            style?.countryName,
            {
              flex: 1,
              color: '#1F1F1F',
              fontFamily: fontFamily.ABCDiatype_Regular,
            },
          ]}>
          {itemName}
        </Text>
        <Text
          style={[
            style?.dialCode,
            { color: '#838282', fontFamily: fontFamily.ABCDiatype_Regular },
          ]}>
          {item.dial_code}
        </Text>
      </TouchableOpacity>
    );
  };

  const onStartShouldSetResponder = () => {
    onBackdropPress?.();
    return false;
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onShow={openModal}
      onRequestClose={onRequestClose}>
      <Pressable
        onPress={() => {
          Keyboard.dismiss();
          typeof closeCountryModal === 'function' &&
            closeCountryModal();
        }}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
        }}>
        {!disableBackdrop && (
          <Animated.View
            onStartShouldSetResponder={onStartShouldSetResponder}
            style={[
              {
                flex: 1,
                opacity: modalBackdropFade,
                backgroundColor: 'rgba(0,0,0,0.45)',
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'flex-end',
              },
              style?.backdrop,
            ]}
          />
        )}
        <Animated.View
          style={[
            styles.modal,
            style?.modal,
            {
              transform: [
                {
                  translateY: modalPosition,
                },
              ],
            },
          ]}>
          <View style={{ alignSelf: 'center', padding: 2.5, borderRadius: 10, width: 50, borderColor: COLORS.borderGray, backgroundColor: COLORS.borderGray }} />
          <Pressable
            style={{ flexDirection: 'column' }}>
            <Text
              style={{
                fontSize: 32,
                alignSelf: 'center',
                margin: 20,
                color: '#1F1F1F',
                fontFamily: fontFamily.RomieTrial_Bold,
              }}>
              Select a Country
            </Text>

            <View
              style={[
                style?.textInput,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}>
              <Image source={IMAGES.search} style={{ marginStart: 20 }} />

              <TextInput
                style={[
                  styles.searchBar,
                  {
                    fontSize: 16,
                    fontFamily: fontFamily.ABCDiatype_Regular,
                    backgroundColor: '#FFFFFF',
                  },
                ]}
                value={searchValue}
                onChangeText={setSearchValue}
                placeholder={inputPlaceholder || 'Search location'}
                placeholderTextColor={inputPlaceholderTextColor || '#A2A1A1'}
                testID="countryCodesPickerSearchInput"
                {...rest}
              />
            </View>
          </Pressable>

          {resultCountries.length === 0 ? (
            <View
              style={[styles.countryMessage, style?.countryMessageContainer]}>
             <View style={{
                marginTop: verticalMarginScale(180)
              }}>
                <EventEmptyRecord
                  title={"No Results"}
                  subTitle={"Please refine your search."}
                  isLoading={false}
                />
              </View>

            </View>
          ) : (
            <View style={{ marginTop: 15 }}>
              {selectedCountry != '' &&
                <View>
                  <TouchableOpacity
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      paddingVertical: 10,
                      borderColor: '#E1E1E1',
                      borderWidth: 1,
                      borderRadius: 10,
                      marginBottom: 5,
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }} // Combine default and passed styles
                    onPress={() => {
                      Keyboard.dismiss();
                      typeof pickerButtonOnPress === 'function' &&
                        pickerButtonOnPress(selectedCountry);
                    }}>
                    <Text style={[style?.flag, { fontSize: 25, marginEnd: 10 }]}>
                      {selectedCountry?.flag}
                    </Text>
                    <Text
                      style={[
                        style?.countryName,
                        {
                          flex: 1,
                          color: '#1F1F1F',
                          fontFamily: fontFamily.ABCDiatype_Regular,
                        },
                      ]}>
                      {selectedCountry?.name[lang]}
                    </Text>
                    <Text
                      style={[
                        style?.dialCode,
                        { color: '#838282', fontFamily: fontFamily.ABCDiatype_Regular },
                      ]}>
                      {selectedCountry.dial_code}
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.line, style?.line]} />
                </View>
              }
              <FlatList
                showsVerticalScrollIndicator={false}
                data={resultCountries || codes}
                keyExtractor={(item, index) => '' + item + index}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                style={[style?.itemsList]}
                keyboardShouldPersistTaps={'handled'}
                renderItem={renderItem}
                testID="countryCodesPickerFlatList"
                ListHeaderComponent={
                  popularCountries && ListHeaderComponent && !searchValue ? (
                    <ListHeaderComponent
                      countries={preparedPopularCountries}
                      lang={lang}
                      onPress={(item: CountryItem) => {
                        Keyboard.dismiss();
                        typeof pickerButtonOnPress === 'function' &&
                          pickerButtonOnPress(item);
                      }}
                    />
                  ) : null
                }
                {...rest}
              />
            </View>

          )}
        </Animated.View>
        <Animated.View
          style={[
            styles.modalInner,
            style?.modalInner,
            {
              height: animatedMargin,
            },
          ]}
        />
      </Pressable>
    </Modal>
  );
};

interface CountryListProps {
  lang: string;
  searchValue?: string;
  excludedCountries?: string[];
  popularCountries?: string[];
  showOnly?: string[];

  ListHeaderComponent?: (props: ListHeaderComponentProps) => JSX.Element;
  itemTemplate?: (props: ItemTemplateProps) => JSX.Element;
  pickerButtonOnPress: (item: CountryItem) => any;
  closeCountryModal: () => void;
  style?: Style;
}

export const CountryList = ({
  showOnly,
  popularCountries,
  lang = 'en',
  searchValue = '',
  excludedCountries,
  style,
  pickerButtonOnPress,
  closeCountryModal,
  ListHeaderComponent,
  itemTemplate: ItemTemplate = CountryButton,
  ...rest
}: CountryListProps) => {
  // ToDo refactor exclude and showOnly props to objects
  let filteredCodes = countriesRemover(excludedCountries);

  const preparedPopularCountries = React.useMemo(() => {
    return filteredCodes?.filter(country => {
      return popularCountries?.find(
        short => country?.code === short?.toUpperCase(),
      );
    });
  }, [popularCountries]);

  const codes = React.useMemo(() => {
    let newCodes = filteredCodes;

    if (showOnly?.length) {
      newCodes = filteredCodes?.filter(country => {
        return showOnly?.find(short => country?.code === short?.toUpperCase());
      });
    }

    return newCodes;
  }, [showOnly, excludedCountries]);

  const resultCountries = React.useMemo(() => {
    const lowerSearchValue = searchValue.toLowerCase();

    return codes.filter(country => {
      if (
        country?.dial_code.includes(searchValue) ||
        country?.name[lang || 'en']
          .toLowerCase()
          .includes(lowerSearchValue.trim()) ||
        removeDiacritics(country?.name[lang || 'en'].toLowerCase()).includes(
          lowerSearchValue.trim(),
        )
      ) {
        return country;
      }
    });
  }, [searchValue]);

  const renderItem = ({ item, index }: { item: CountryItem; index: number }) => {
    let itemName = item?.name[lang];
    let checkName = itemName.length ? itemName : item?.name['en'];
    return (
      <ItemTemplate
        key={index}
        item={item}
        style={style}
        name={checkName}
        onPress={() => {
          Keyboard.dismiss();
          typeof pickerButtonOnPress === 'function' &&
            pickerButtonOnPress(item);
        }}
      />
    );
  };

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={resultCountries || codes}
        keyExtractor={(item, index) => '' + item + index}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        style={[style?.itemsList]}
        keyboardShouldPersistTaps={'handled'}
        renderItem={renderItem}
        ListHeaderComponent={
          popularCountries &&
          ListHeaderComponent && (
            <ListHeaderComponent
              countries={preparedPopularCountries}
              lang={lang}
              onPress={(item: CountryItem) => {
                Keyboard.dismiss();
                typeof pickerButtonOnPress === 'function' &&
                  pickerButtonOnPress(item);
              }}
            />
          )
        }
        {...rest}
      />
    </View>
  );
};

type StyleKeys =
  | 'container'
  | 'modal'
  | 'modalInner'
  | 'searchBar'
  | 'countryMessage'
  | 'line';

const styles: { [key in StyleKeys]: ViewStyle } = {
  container: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    padding: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    bottom: 0,
    zIndex: 10,
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 10,
  },
  modalInner: {
    zIndex: 99,
    backgroundColor: 'white',
    width: '100%',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: 40,
    padding: 5,
  },
  countryMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
  line: {
    width: '85%',
    height: 1.5,
    borderRadius: 2,
    backgroundColor: '#eceff1',
    alignSelf: 'center',
    marginVertical: verticalMarginScale(15),
  },
};
