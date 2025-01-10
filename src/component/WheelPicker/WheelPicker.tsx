import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import WheelScrollPicker from 'react-native-wheel-scrollview-picker';

interface WheelPickerProps {
  data: string[]; // Array of string values to be displayed in the picker
  selectedValue: string; // Currently selected value
  onValueChange?: (value: string, index: number) => void; // Callback when value changes
  style?: StyleProp<ViewStyle>; // Custom style for the picker container
  itemStyle?: StyleProp<ViewStyle>; // Custom style for picker items
  contentStyle?: StyleProp<TextStyle>; // Custom style for item text content
  wrapperHeight?: number; // Height of the picker wrapper
  highlightBorderWidth?: number; // Width of the highlight border
  highlightColor?: string; // Color of the highlight border
  itemHeight?: number; // Height of individual picker items
  [key: string]: any; // Allow other props to pass through
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
        selectedIndex={data.indexOf(selectedValue)}
        onValueChange={(value: string, index: number) => {
          if (onValueChange) {
            onValueChange(value, index);
          }
        }}
        wrapperBackground="#FFF"
        highlightColor={highlightColor}
        highlightBorderWidth={highlightBorderWidth}
        wrapperHeight={wrapperHeight}
        itemHeight={itemHeight}
        style={itemStyle}
        {...props}
        renderItem={(item: string, index: number) => (
          <View key={index} style={contentStyle}>
            <Text
              style={{
                fontSize: 18,
                color: selectedValue === item ? '#000000' : '#8A8A93',
                // fontWeight: selectedValue === item ? 'bold' : '400',
                textAlign: 'center',
                fontWeight: selectedValue === item ? Platform.OS === 'ios' ? 'bold' : '500' : '500'
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
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WheelPicker;
