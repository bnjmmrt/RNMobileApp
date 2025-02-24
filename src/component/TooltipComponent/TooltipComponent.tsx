import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Tooltip from 'react-native-tooltip-2';
import { COLORS } from 'src/utils/constants';
interface CustomTooltipProps {
content:string,
position:any;
setToolTipVisible:(flag:boolean)=>void
}
const CustomTooltip:React.FC<CustomTooltipProps> = ({ content,position,setToolTipVisible }) => {
  return (
    <Tooltip
    isVisible={true}
    content={<Text>Check this out!</Text>}
    placement={position}
    onClose={() => setToolTipVisible(false)}>
    {/* <Pressable
        style={styles.button}
        onPress={() => setToolTipVisible(true)}>
        <Text>Press me</Text>
    </Pressable> */}
</Tooltip>
  );
};

export default CustomTooltip;
