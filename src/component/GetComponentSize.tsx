import { View, Text, LayoutRectangle } from 'react-native';
import React, { ReactNode, useState } from 'react';
import { screenWidth } from 'src/utils/isTabletConfig';

const GetComponentSize = ({
  children,
  onSizeCapture,
}: {
  children: ReactNode;
  onSizeCapture: (x: LayoutRectangle) => void;
}) => {
  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: -9999 - screenWidth, // Hide off-screen
          top: 0,
        }}
        onLayout={event => {
          onSizeCapture(event.nativeEvent.layout);
        }}>
        {children}
      </View>
      {children}
    </>
  );
};

export default GetComponentSize;
