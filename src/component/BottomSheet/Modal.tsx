import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import GooglePlacesInput from '../GooglePlacesInput/GooglePlacesInput';
import Button from '../Button';
import {BUTTON_LABLE} from '../../utils/constants';
import {Wp} from '../../utils/dimensions';

const LocationPickerModal = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [location, setLocation] = useState('');

  //   const locations = [
  //     { id: "1", flag: "🇺🇸", name: "Los Angeles, California, USA" },
  //     { id: "2", flag: "🇺🇸", name: "Los Gatos, California, USA" },
  //     { id: "3", flag: "🇲🇽", name: "Los Mochis, Sinaloa, Mexico" },
  //     { id: "4", flag: "🇪🇸", name: "Los Realejos, Tenerife, Spain" },
  //   ];

  //   const filteredLocations = locations.filter((location) =>
  //     location.name.toLowerCase().includes(search.toLowerCase())
  //   );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <GooglePlacesInput setLocation={setLocation} />
          <Button
            disabled={false}
            style={styles.btnStyle}
            title={BUTTON_LABLE.SUBMIT}
            colorTheme="dark"
            onPress={() => setModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical:30,
    top:"5%",
    height: '90%',
  },
  
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flag: {
    fontSize: 20,
    marginRight: 10,
  },
  locationName: {
    fontSize: 16,
  },
  btnStyle: {
    width: Wp(85),
    borderRadius: 100,
  },
 
});

export default LocationPickerModal;
