import React, {useState} from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import GooglePlacesInput from '../GooglePlacesInput/GooglePlacesInput';
import {Wp} from '../../utils/dimensions';
import {Address} from '../../redux/slices/appFlowSlice';
import Button from '../Button';
import {BUTTON_LABLE} from '../../utils/constants';

interface LocationPickerModalProps {
  setLocation: (location: Address) => void;
  setIsShown: (ishown: boolean) => void;
  submitVisible?: boolean;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  setLocation,
  setIsShown,
  submitVisible,
}) => {
  console.log('LocationPickerModal');
  const [modalVisible, setModalVisible] = useState(true);

  const submit = () => {
    setModalVisible(false);
    setIsShown(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <GooglePlacesInput submit={submit} setLocation={setLocation} />
          {submitVisible && (
            <Button
              disabled={false}
              style={styles.btnStyle}
              title={BUTTON_LABLE.SUBMIT}
              colorTheme="dark"
              onPress={submit}
            />
          )}
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
    paddingVertical: 30,
    top: '5%',
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
