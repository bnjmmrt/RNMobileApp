import React, { useRef, forwardRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import LinearGradient from 'react-native-linear-gradient';
import { fontScale, radiusScale, verticalMarginScale, verticalScale } from 'src/utils/dimensions';
import IMAGES from '@images/index';

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
              <Image source={IMAGES.close} tintColor={COLORS.white} />
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
          <View style={{ padding: 10, bottom: 30 }}>
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
    borderRadius: radiusScale(25),
    overflow: 'hidden',
    top: '5%',
    height: '98%',
  },
  textContainer: { padding: verticalMarginScale(20) },
  headerContainer: {
    backgroundColor: COLORS.black,

    height: verticalScale(200),
    // iOS Shadow
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: verticalScale(140) },
    shadowOpacity: 0.6,
    shadowRadius: radiusScale(20),

    // Android Shadow
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: verticalMarginScale(20),
  },
  logo: {
    color: COLORS.white,
    fontSize: fontScale(22),
    fontWeight: 'bold',
  },
  closeIcon: {
    color: COLORS.white,
    fontSize: fontScale(22),
  },
  greeting: {
    color: COLORS.white,
    fontSize: fontScale(24),
    fontWeight: 'bold',
    marginTop: verticalMarginScale(20),
  },
  wave: {
    fontSize: fontScale(26),
  },
  helpText: {
    color: COLORS.white,
    fontSize: fontScale(22),
    fontWeight: 'bold',
    marginBottom: verticalMarginScale(20),
  },
  contentContainer: {
    bottom: verticalMarginScale(30),
    padding: verticalMarginScale(10),
  },
  button: {
    backgroundColor: COLORS.white,
    padding: verticalMarginScale(15),
    borderRadius: radiusScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalMarginScale(10),
  },
  buttonText: {
    fontSize: fontScale(18),
    color: COLORS.black,
  },
  icon: {
    fontSize: fontScale(18),
  },
});

export default ContactSupporrtBottomSheet;
