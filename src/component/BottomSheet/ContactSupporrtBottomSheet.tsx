import React, {useRef, forwardRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {COLORS} from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';

interface ContactSupporrtBottomSheetProps {
  setIsShown: (ishown: boolean) => void;
}
const ContactSupporrtBottomSheet: React.FC<ContactSupporrtBottomSheetProps> = ({
  setIsShown,
}) => {
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
      <View style={styles.container}>
        <LinearGradient
          colors={
            Platform.OS === 'android'
              ? ['#000', '#000', '#fff', '#fff', '#fff']
              : ['#000', '#000', '#303030', '#fff', '#fff', '#fff', '#fff', '#fff']
          }
          style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>rumor</Text>
            <TouchableOpacity onPress={submit}>
              <Text style={styles.closeIcon}>x</Text>
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>
              Hi Sarah <Text style={styles.wave}>👋</Text>
            </Text>
            <Text style={styles.helpText}>How can we help?</Text>
          </View>

          {/* Buttons */}
          <View style={{padding: 10, bottom: 30}}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Messages</Text>
              <Text style={styles.icon}>💬</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Send us a message</Text>
              <Text style={styles.icon}>➤</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.71)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 25,
    overflow: 'hidden',
    top: '5%',
    height: '98%',
  },
  textContainer: {padding: 20},
  headerContainer: {
    backgroundColor: COLORS.black,

    height: 200,
    // iOS Shadow
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 140},
    shadowOpacity: 0.6,
    shadowRadius: 20,

    // Android Shadow
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeIcon: {
    color: COLORS.white,
    fontSize: 22,
  },
  greeting: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  wave: {
    fontSize: 26,
  },
  helpText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentContainer: {
    bottom: 30,
    padding: 10,
  },
  button: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.black,
  },
  icon: {
    fontSize: 18,
  },
});

export default ContactSupporrtBottomSheet;
