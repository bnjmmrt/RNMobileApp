import IMAGES from '../../assets/images';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface FeedFilterItemProps {
  content: string;
  handleClear: () => void;
}

const FeedFilterItem: React.FC<FeedFilterItemProps> = ({
  content,
  handleClear,
}) => {
  if (!content || content === ' - ') return null;

  return (
    <View style={styles.container}>
      <Text style={styles.content}>{content}</Text>
      <View onTouchEnd={handleClear} style={styles.closeContainer}>
        <Image source={IMAGES.filterClose} alt="close" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 100,
    borderColor: '#E1E1E1',
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 8,
    backgroundColor: '#F1F1F1',
    marginHorizontal: 8,
    height: 48,
  },
  content: {
    color: 'black',
    lineHeight: 16,
  },
  closeContainer: {
    padding: 8,
  },
});

export default FeedFilterItem;
