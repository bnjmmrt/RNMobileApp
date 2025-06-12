import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { COLORS } from 'src/utils/constants';
import { CustomText } from './CustomText';
import RNFS from 'react-native-fs';

export default function FileDetails({
  title,
  type,
  fileUrl,
}: {
  title: string;
  type: string;
  fileUrl: string;
}) {
  const [fileSize, setFileSize] = React.useState<string>('');
  const getFileSizeFromUrl = async (fileUrl: string) => {
    let size = '';
    try {
      const localPath = `${RNFS.DocumentDirectoryPath}/temp.pdf`;

      const file = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localPath,
      }).promise;

      if (file && file.bytesWritten) {
        size = file.bytesWritten.toString();
      } else {
        const statResult = await RNFS.stat(localPath);
        size = statResult.size.toString();
      }
    } catch (error) {
      console.error('Error getting file size:', error);
      return '';
    } finally {
      // delete the file after getting the size
      await RNFS.unlink(`${RNFS.DocumentDirectoryPath}/temp.pdf`);
    }
    const sizeInBytes = parseFloat(size);
    if (isNaN(sizeInBytes)) {
      return '';
    }
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1048576) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else if (sizeInBytes < 1073741824) {
      return `${(sizeInBytes / 1048576).toFixed(2)} MB`;
    }
    return `${(sizeInBytes / 1073741824).toFixed(2)} GB`;
  };

  const removeExtFromTitle = (title: string) => {
    const lastDotIndex = title.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return title.substring(0, lastDotIndex);
    }
    return title;
  };
  title = removeExtFromTitle(title);

  useEffect(() => {
    const fetchFileSize = async () => {
      const size = await getFileSizeFromUrl(fileUrl);
      setFileSize(size);
    };
    fetchFileSize();
  }, [fileUrl]);
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>{title}</CustomText>
      <CustomText style={styles.subtitle}>
        .{type} | {fileSize || '0'}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    padding: 8,
    borderRadius: 4,
    backgroundColor: COLORS.lighter_gray,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    gap: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: 500,
    color: '#BDBDBD',
    textTransform: 'uppercase',
  },
});
