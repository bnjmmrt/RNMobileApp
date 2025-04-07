import React from 'react';
import {StyleSheet } from 'react-native';
import FullScreenLoader from '../FullScreenLoader';
import FastImage from '@d11/react-native-fast-image';
import { radiusScale } from 'src/utils/dimensions';

interface ImageProps {
  loading?: boolean;
  imageURL: string;
}
const ImageComponent: React.FC<ImageProps> = ({ loading=false, imageURL }) => {
  return (
    <FullScreenLoader loading={loading} customStyle={styles.mainImage}>
      <FastImage
        source={{ uri: imageURL }}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.mainImage}
      />
    </FullScreenLoader>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    height: '100%',
    width: '100%',
    borderRadius: radiusScale(20),
  },
});

export default ImageComponent;
