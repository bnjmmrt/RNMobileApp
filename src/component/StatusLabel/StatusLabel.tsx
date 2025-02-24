import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from 'src/utils/constants';
import { fontScale } from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';

interface StatusLabelProps {
  status: string;
  isFilter?: boolean;
}

export const getStatusColor = (statusText: string) => {
  const statusKey = statusText.toLowerCase();
  switch (statusKey) {
    case 'confirmed':
      return { bg: COLORS.successLight, text: COLORS.success };
    case 'declined':
      return { bg: COLORS.bgRed, text: COLORS.errorText };
    case 'invited':
      return { bg: COLORS.bgBlue, text: COLORS.blueDark };
    case 'drafts':
      return { bg: COLORS.lighter_gray, text: COLORS.black2 };
    case 'requested':
      return { bg: COLORS.black, text: COLORS.white };
    case 'all':
      return { bg: COLORS.lighter_gray, text: COLORS.neutral_disabled };
    default:
      return { bg: COLORS.bgBlue, text: COLORS.blueDark };
  }
};

const StatusLabel: React.FC<StatusLabelProps> = ({
  status,
  isFilter = false,
}) => {
  const colors = getStatusColor(status);

  return (
    <View style={[styles.statusLabelContainer, { backgroundColor: colors.bg }]}>
      <Text
        style={[
          styles.statusLabelText,
          {
            color: colors.text,
            fontSize: isFilter ? fontScale(14) : fontScale(12),
            lineHeight: isFilter ? fontScale(16) : fontScale(14),
          },
        ]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  statusLabelContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusLabelText: {
    fontWeight: '500',
    fontFamily: fontFamily.ABCDiatype_Regular,
  },
});

export default StatusLabel;
