import React from 'react';
import {View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import {styles} from './style';

const MarkAsSpam = ({
  onPressBack,
  onSuccess,
}: {
  onPressBack: () => void;
  onSuccess: () => {};
}) => {
  return (
    <View>
      <View style={styles.actionContentWrapper}>
        <CustomText style={styles.title}>{'Mark as Spam'}</CustomText>
        <CustomText style={styles.markSpamMessage}>
          {'Are you sure you want to mark the selected user as spam?'}
          {'\n\n'}
          {
            'If they request access to your events in the future, they will automatically be moved to the declined tab.'
          }
        </CustomText>

        <Button
          title="Mark as Spam"
          colorTheme="dark"
          style={[styles.actionCta, styles.markSpamCta]}
          onPress={onSuccess}
        />
      </View>
    </View>
  );
};

export default MarkAsSpam;
