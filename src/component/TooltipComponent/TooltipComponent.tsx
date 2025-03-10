import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from 'src/utils/constants';

const { width } = Dimensions.get('window');
type Position= 'Top' | 'Bottom';

interface TooltipComponentProps{
message:string;
visible:boolean;
position?:Position,
style?:any
}
const TooltipComponent:React.FC<TooltipComponentProps> = ({message,visible,position="Bottom",style}) => {
  // const [visible, setVisible] = useState(visible);

  return (
    <>
    {visible && ( <View style={[styles.container,style]}>
    {/* <View style={styles.tooltipContainer}> */}
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>
        {message}
        </Text>
        <View style={[styles.tooltipArrow,position=="Top" && styles.topArrow]} />
      </View>
    {/* </View> */}
  </View>)}
    </>
   
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width:"100%",
    zIndex: 100
  },
  tooltipContainer: {
    // position: 'absolute',
    // bottom: 10, 
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
    fontWeight:'500',
    lineHeight:16
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
  topArrow:{
    position: 'absolute',
    top: -6,
    left: '52%',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderTopWidth:0
  }
});

export default TooltipComponent;
