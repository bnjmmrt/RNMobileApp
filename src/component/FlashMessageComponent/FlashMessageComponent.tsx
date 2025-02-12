import { showMessage } from 'react-native-flash-message';
import { changeSafeAreaViewConfig } from 'src/utils/functions';
import { SAFEWAREAVIEW_CONFIG } from 'src/utils/safeAreaViewConfig';

export type MessageType = 'success' | 'error' | 'info' | 'warning';

export const getFlashMessageBackgroundColor = (type: MessageType) => {
  let backgroundColor: string;
  switch (type) {
    case 'success':
      backgroundColor = '#1F1F1F';
      break;
    case 'error':
      backgroundColor = '#EE6055';
      break;
    case 'info':
      backgroundColor = '#2196F3';
      break;
    case 'warning':
      backgroundColor = '#FFC107';
      break;
    default:
      backgroundColor = '#000';
  }
  return backgroundColor;
};

export const FlashMessageComponent = {
  show: (type: MessageType, message: string) => {
    // changeSafeAreaViewConfig({
    //   ...SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME,
    //   topSafeAreaViewColor: getFlashMessageBackgroundColor(type),
    // });
    showMessage({
      message,
      type: 'default',
      backgroundColor: getFlashMessageBackgroundColor(type),
      color: '#fff',
    });

    // setTimeout(() => {
    //   changeSafeAreaViewConfig(SAFEWAREAVIEW_CONFIG.DEFAULT_SCHEME);
    // }, 2200);
  },
};
