import React from 'react';
import {TextInput, View} from 'react-native';
import Button from 'src/component/Button';
import {CustomText} from 'src/component/CustomText';
import Header from 'src/component/Header/Header';
import {styles} from './style';
import Input from 'src/component/Input/Input';
import {verticalMarginScale, verticalScale} from 'src/utils/dimensions';

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

        <Input
          multiline
          placeholder="What would you like to report?"
          label="Report Message"
          defaultValue=""
          errorMessage=""
          otherStyle={{marginTop: 0, marginBottom: verticalMarginScale(24)}}
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
