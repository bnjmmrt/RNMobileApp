import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { COLORS } from '../../utils/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import BeforeAppStaticComponent from '../../component/BeforeAppStaticComponent/BeforeAppStaticComponent';

interface BeforeAppStaticScreenProps extends NativeStackScreenProps<any, any> { }

const BeforeAppStaticScreen: React.FC<BeforeAppStaticScreenProps> = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <BeforeAppStaticComponent
        isChatScreen={false}
        showLogout={true} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.black2,
  },
});

export default BeforeAppStaticScreen;
