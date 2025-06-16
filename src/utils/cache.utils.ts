import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { MMKV } from 'react-native-mmkv';
import { FileDetailsCache } from 'types/cache.types';

export const storage = new MMKV();
const hashUrl = (url: string) => {
  let hash = 5381;

  for (let i = 0; i < url.length; i++) {
    hash = (hash * 33) ^ url.charCodeAt(i);
  }

  return (hash >>> 0).toString(16);
};

export const getCachedFileDetails = async (
  url: string,
  opts?: { isPDF?: boolean },
): Promise<FileDetailsCache> => {
  try {
    const keyPrefix = 'CACHED_FILE_DETAILS';
    const hash = hashUrl(url);
    const key = `${keyPrefix}:${hash}`;

    const data = storage.getString(key);
    if (data) {
      const parsedData = JSON.parse(data);
      cacheFileDetails(url, key, opts);
      return {
        ...parsedData,
      };
    } else {
      return cacheFileDetails(url, key, opts);
    }
  } catch {
    return {
      url,
      filePath: null,
    };
  }
};

const cacheFileDetails = async (
  url: string,
  key: string,
  opts?: { isPDF?: boolean },
): Promise<FileDetailsCache> => {
  let dimensions = { width: 0, height: 0 };
  const size = await getFileSizeFromUrl(url);
  if (!opts?.isPDF) {
    await Image.getSize(url).then(({ height, width }) => {
      dimensions = { width, height };
    });
  }

  const fileDetails = {
    url,
    size,
    dimensions,
  };
  storage.set(key, JSON.stringify(fileDetails));
  return fileDetails;
};

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
