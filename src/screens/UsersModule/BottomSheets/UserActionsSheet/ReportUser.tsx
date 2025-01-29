import React from 'react';
import {TextInput, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import {styles} from './style';

const ReportUser = ({
  onPressBack,
  onSuccess,
}: {
  onPressBack: () => void;
  onSuccess: () => {};
}) => {
  return (
    <View>
      <Header
        headerTitle="Report User"
        showBackButton={true}
        showProgressBar={false}
        onPress={onPressBack}
      />
      <View style={styles.actionContentWrapper}>
        <CustomText style={styles.reportMessage}>
          {
            'Please share more details in the report message below. Your report will be shared with the Rumor Admin team for review.'
          }
        </CustomText>

        <CustomText style={styles.reportInputLabel}>
          {'Report Message'}
        </CustomText>
        <TextInput
          style={styles.reportInput}
          placeholder="What would you like to report?"
          verticalAlign="top"
          multiline
        />
        <Button
          title="Submit Report"
          colorTheme="dark"
          style={styles.actionCta}
          onPress={onSuccess}
        />
      </View>
    </View>
  );
};

export default ReportUser;
