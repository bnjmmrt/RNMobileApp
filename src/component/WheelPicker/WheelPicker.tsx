import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import WheelScrollPicker from './WheelScrollPicker';
import { COLORS } from 'src/utils/constants';
import { fontScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface WheelPickerProps {
  data: string[];
  selectedValue: string;
  onValueChange?: (value: string, index: number) => void;
  style?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  wrapperHeight?: number;
  highlightBorderWidth?: number;
  highlightColor?: string;
  itemHeight?: number;
  [key: string]: any;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
  data = [],
  selectedValue,
  onValueChange,
  style,
  itemStyle,
  contentStyle,
  wrapperHeight,
  highlightBorderWidth,
  highlightColor,
  itemHeight,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <WheelScrollPicker
        dataSource={data}
        loop={false}
        selectedIndex={data.indexOf(selectedValue)}
        onValueChange={(value: string, index: number) => {
          if (onValueChange) {
            onValueChange(value, index);
          }
        }}
        wrapperBackground="#FFF"
        highlightColor={highlightColor || COLORS.text}
        highlightBorderWidth={highlightBorderWidth}
        wrapperHeight={wrapperHeight}
        itemHeight={itemHeight}
        style={itemStyle}
        {...props}
        renderItem={(item: string, index: number) => (
          <View key={index} style={contentStyle}>
            <Text
              style={{
                fontSize: fontScale(20),
                fontFamily: fontFamily.RomieTrial,
                color: selectedValue === item ? COLORS.black : COLORS.text,
                textAlign: 'center',
              }}
            >
              {item}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WheelPicker;
