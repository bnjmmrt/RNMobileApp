import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../src/utils/constants';
import { fontFamily } from '../../../src/utils/functions';

type AvatarInitialsProps = {
  name: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
};

const AvatarInitials: React.FC<AvatarInitialsProps> = ({
  name,
  size = 48,
  backgroundColor = COLORS.tabBorderColor,
  textColor = COLORS.black,
}) => {
  // Function to extract initials from the name
  const getInitials = (name: string): string => {
    if (!name) return '';

    const nameParts = name.trim().split(' ');
    const initials = nameParts
      .slice(0, 2) // Get the first two parts (e.g., first and last name)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return initials;
  };

  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: size / 2.5 }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily:fontFamily.ABCDiatype_Regular
  },
});

export default AvatarInitials;
