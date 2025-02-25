import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from 'src/utils/constants';

const { width } = Dimensions.get('window');
const TooltipComponent = () => {
  // const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.tooltipContainer}>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
          This QR code is valid for [User Full Name] only. If you have additional guests in your party, they will receive a link to download Rumor and view their ticket.
          </Text>
          <View style={styles.tooltipArrow} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width:"100%"
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 20, 
    
  },
  tooltip: {
    backgroundColor: COLORS.black,
    padding: 10,
    borderRadius: 8,
    width: width*0.90,
    alignItems: 'center',
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -6,
    left: '52%',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
  },
});

export default TooltipComponent;
