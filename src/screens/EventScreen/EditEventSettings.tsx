import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { COLORS, ERROR_MESSAGE, EVENT, LABLE } from 'src/utils/constants';
import Input from 'src/component/Input/Input';
import Button from 'src/component/Button';
import { fontScale, radiusScale, verticalMarginScale } from 'src/utils/dimensions';
import ShowInfoComponent from 'src/component/ShowInfoComponent';
import { CustomText } from 'src/component/CustomText';
import { fontFamily } from 'src/utils/functions';
import GradientSeprator from 'src/component/GradientSeprator';
import { Event } from 'src/types';


interface EditEventSettingsProps {
  event: Event;
}

const EditEventSettings: React.FC<EditEventSettingsProps> = ({ event }) => {
  const profileData = useSelector(
    (state: RootState) => state.appFlowApiData?.profileData,
  );
  const userId = useSelector((state: RootState) => state.auth.userId);


  const onConfirmClick = async () => {
  };

  const renderInputView = (title: string, value: string) => {
    return (
      <Input
        editable={false}
        otherStyle={{ marginTop: verticalMarginScale(15) }}
        inputFieldContainerStyle={{ paddingHorizontal: verticalMarginScale(10) }}
        label={title}
        errorMessage={ERROR_MESSAGE.FIRST_NAME}
        defaultValue={value}
      />
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <ShowInfoComponent title={LABLE.EVENT_SETTING_INFO} />
          {renderInputView(EVENT.VISIBILITY, event?.isPrivate ? "Private" : "public")}
          {renderInputView(EVENT.EVENT_TYPE, event?.eventType?.name || '')}
          {renderInputView(EVENT.PLUS_1_LIMIT, `Up to ${event?.limitOnePlus}` || '')}
          {renderInputView(EVENT.AGE_LIMIT, `${event?.ageLimit?.minAge}+` || '')}
          {renderInputView(EVENT.EVENT_PUBLISH_SETTINGS, event?.autoPublished ? 'Publish automatically once approved' : 'Publish manually once approved')}


          <View style={{ alignItems: 'center', marginVertical: verticalMarginScale(20) }}>
            <GradientSeprator />
            <CustomText style={{ fontFamily: fontFamily.RomieTrial_Bold, fontSize: fontScale(24), marginTop: verticalMarginScale(20) }}>{EVENT.TICKET_TYPES}</CustomText>
          </View>

          {renderInputView(EVENT.UTILIZE_QR_CODES_FOR_EVENT_CHECK_IN, event?.useQr ? 'Yes' : 'No')}


          <View style={{ alignItems: 'center', marginVertical: verticalMarginScale(20) }}>
            <GradientSeprator />
            <CustomText style={{ fontFamily: fontFamily.RomieTrial_Bold, fontSize: fontScale(24), marginTop: verticalMarginScale(20) }}>{EVENT.EVENT_COLLABORATORS}</CustomText>
          </View>


        </View>

      </ScrollView>


      <Button
        disabled={false}
        style={styles.btnStyle}
        title={EVENT.UPDATE_SETTINGS_ON_WEB}
        colorTheme="dark"
        onPress={onConfirmClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // paddingBottom: 20
  },
  btnStyle: {
    borderRadius: radiusScale(100),
    bottom: verticalMarginScale(20),
  },
  contentContainer: {
    flex: 1,
    // paddingVertical: verticalMarginScale(10),
    // paddingHorizontal: horizontalMarginScale(20),
  },
  scrollContainer: { paddingBottom: verticalMarginScale(40) },
  label: {
    // paddingVertical: horizontalMarginScale(2),
    fontSize: fontScale(14),
    paddingTop: verticalMarginScale(20),
    color: COLORS.black,
    fontWeight: '500',
    lineHeight: 16,
  },
});

export default EditEventSettings;
