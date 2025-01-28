import React, {useRef, forwardRef, useState} from 'react';
import {View, StyleSheet, Text, Image, Platform, TouchableOpacity, Modal} from 'react-native';

interface ContactSupporrtBottomSheetProps {
 setLocation:(location:Address)=>void,
   setIsShown:(ishown:boolean)=>void
  
}
const ContactSupporrtBottomSheet:React.FC<ContactSupporrtBottomSheetProps> = ({setLocation,setIsShown}) => {
  const [modalVisible, setModalVisible] = useState(true);
  
    const submit=()=>{
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
      {/* Top Dark Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.logo}>rumor</Text>
          <TouchableOpacity>
            <Text style={styles.closeIcon}>✖</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>
          Hi Sarah <Text style={styles.wave}>👋</Text>
        </Text>
        <Text style={styles.helpText}>How can we help?</Text>
      </View>

      {/* White Background Section */}
      <View style={styles.contentContainer}>
        {/* Buttons */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Messages</Text>
          <Text style={styles.icon}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send us a message</Text>
          <Text style={styles.icon}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
      </Modal>
    );
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,

    // justifyContent: 'center',
    // alignItems: 'center',
  },

  headerContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeIcon: {
    color: 'white',
    fontSize: 22,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  wave: {
    fontSize: 26,
  },
  helpText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  contentContainer: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
  icon: {
    fontSize: 18,
  },
  
});

export default ContactSupporrtBottomSheet;
