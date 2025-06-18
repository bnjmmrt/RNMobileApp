import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';
import { COLORS } from 'src/utils/constants';

type Props = {
  uri: string;
  style?: StyleProp<ViewStyle>;
  page?: number;
  singlePage?: boolean;
};
export default function CustomPDFView({ uri, style, page, singlePage }: Props) {
  return (
    <Pdf
      source={{
        uri: uri,
        cache: true,
        expiration: 3600 * 24 * 3,
        cacheFileName: uri,
      }}
      renderActivityIndicator={() => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'transparant',
          }}>
          <ActivityIndicator size="small" color={COLORS.darkBlue} />
        </View>
      )}
      style={style}
      page={page}
      singlePage={singlePage}
    />
  );
}
