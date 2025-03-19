import React, { useCallback, useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';
import { COLORS, ERROR_MESSAGE, EVENT, LABLE } from 'src/utils/constants';
import Input from 'src/component/Input/Input';
import Button from 'src/component/Button';
import {
  fontScale,
  radiusScale,
  verticalMarginScale,
} from 'src/utils/dimensions';
import ShowInfoComponent from 'src/component/ShowInfoComponent';
import { CustomText } from 'src/component/CustomText';
import { fontFamily, removeSignature } from 'src/utils/functions';
import GradientSeprator from 'src/component/GradientSeprator';
import { Collaborator, Event } from 'src/types';
import FastImage from '@d11/react-native-fast-image';
import IMAGES from '@images/index';

interface EditEventSettingsProps {
  event: Event;
}

const EditEventSettings: React.FC<EditEventSettingsProps> = ({ event }) => {
  const userId = useSelector((state: RootState) => state.auth.userId);

  const collabrators = useMemo(() => {
    const owner = {
      ...event?.owner,
      name: event?.owner?.companyName,
      role: { id: event?.owner?.id, name: 'host' },
    };
    return [owner, ...(event?.collaborators || [])];
  }, [event]);

  const onConfirmClick = useCallback(async () => {
    Linking.openURL('https://stagehost.therumor.com/events');
  }, []);

  const getUserRole = useCallback(
    (item: Collaborator) => {
      if (!item || !userId) return '';
      return item?.id === userId
        ? 'HOST'
        : item?.role?.name?.toUpperCase().replace('_', '-') || '';
    },
    [userId],
  );

  const renderInputView = useCallback(
    (title: string, value: string) => (
      <Input
        editable={false}
        otherStyle={{
          marginTop: title ? verticalMarginScale(15) : verticalMarginScale(10),
        }}
        inputFieldContainerStyle={{
          paddingHorizontal: verticalMarginScale(10),
        }}
        label={title}
        errorMessage={ERROR_MESSAGE.FIRST_NAME}
        defaultValue={value}
      />
    ),
    [],
  );

  const renderCollabratorItem = useCallback(
    (item: Collaborator) => (
      <View style={styles.talentItem} key={item.id}>
        <FastImage
          source={{ uri: item.companyLogo }}
          resizeMode={FastImage.resizeMode.center}
          defaultSource={IMAGES.revolve}
          style={styles.icon}
        />
        <CustomText style={styles.name}>{item.name}</CustomText>
        <View style={styles.roleContainer}>
          <CustomText style={styles.roleText}>{getUserRole(item)}</CustomText>
        </View>
      </View>
    ),
    [getUserRole],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <ShowInfoComponent title={LABLE.EVENT_SETTING_INFO} />
          {renderInputView(
            EVENT.VISIBILITY,
            event?.isPrivate ? 'Private' : 'Public',
          )}
          {renderInputView(EVENT.EVENT_TYPE, event?.eventType?.name || '')}
          {renderInputView(EVENT.PLUS_1_LIMIT, `Up to ${event?.limitOnePlus}`)}
          {renderInputView(EVENT.AGE_LIMIT, `${event?.ageLimit?.minAge}+`)}
          {renderInputView(
            EVENT.EVENT_PUBLISH_SETTINGS,
            event?.autoPublished
              ? 'Publish automatically once approved'
              : 'Publish manually once approved',
          )}

          <GradientSepratorWithTitle title={EVENT.TICKET_TYPES} />
          {event?.ticketTypes?.map(ticket => renderInputView('', ticket?.name))}

          {renderInputView(
            EVENT.UTILIZE_QR_CODES_FOR_EVENT_CHECK_IN,
            event?.useQr ? 'Yes' : 'No',
          )}

          <GradientSepratorWithTitle title={EVENT.EVENT_COLLABORATORS} />
          {collabrators.map(renderCollabratorItem)}

          <GradientSepratorWithTitle title={EVENT.QUESTIONNAIRE} />
          {event?.quizQuestions?.map(qus => renderInputView('', qus?.question))}
        </View>
      </ScrollView>

      <Button
        disabled={false}
        style={styles.btnStyle}
        title={EVENT.UPDATE_SETTINGS_ON_WEB}
        colorTheme="dark"
        onPress={onConfirmClick}
        rightImageSource={IMAGES.arrow_go}
        rightImageStyle={{ width: 20, height: 20 }}
      />
    </View>
  );
};

const GradientSepratorWithTitle = ({ title }: { title: string }) => (
  <View style={styles.separatorContainer}>
    <GradientSeprator />
    <CustomText style={styles.separatorTitle}>{title}</CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContainer: { paddingBottom: verticalMarginScale(40) },
  contentContainer: { flex: 1 },
  roleContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 3,
    borderColor: COLORS.black,
    paddingVertical: 2,
    paddingHorizontal: 5,
    position: 'absolute',
    right: 1,
    alignSelf: 'center',
    marginRight: 10,
  },
  roleText: {
    color: COLORS.black,
    fontSize: fontScale(12),
    textAlign: 'center',
  },
  icon: {
    height: 48,
    width: 48,
    borderRadius: 25,
    backgroundColor: COLORS.black,
  },
  talentItem: {
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: COLORS.borderGray,
  },
  name: {
    color: COLORS.neutral_disabled,
    fontSize: fontScale(14),
    padding: 10,
    flex: 1,
    fontFamily: fontFamily.ABCDiatype_Bold,
  },
  btnStyle: { borderRadius: radiusScale(100), bottom: verticalMarginScale(20) },
  separatorContainer: {
    alignItems: 'center',
    marginVertical: verticalMarginScale(20),
  },
  separatorTitle: {
    fontFamily: fontFamily.RomieTrial_Bold,
    fontSize: fontScale(24),
    marginTop: verticalMarginScale(20),
  },
});

export default EditEventSettings;
