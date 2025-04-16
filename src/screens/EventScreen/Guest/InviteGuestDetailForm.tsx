/* eslint-disable react-native/no-inline-styles */
import IMAGES from '@images/index';
import moment from 'moment';
import React, { useRef } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { COLORS, EVENT } from 'src/utils/constants';
import {
  fontScale,
  horizontalMarginScale,
  horizontalScale,
  radiusScale,
  verticalMarginScale,
  verticalScale,
} from 'src/utils/dimensions';
import { fontFamily } from 'src/utils/functions';
import Button from '../../../component/Button';
import Counter from '../../../component/Counter';
import { CustomText } from '../../../component/CustomText';
import Input, { InputRefMethods } from '../../../component/Input/Input';
import CollapseWrap from './CollapseWrap';
import { convertUTCToTimeZoneFormat } from 'src/utils/dateFunctions';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/redux/slices';

export interface TicketType {
  id: string;
  name: string;
}

interface InviteDetailsProps {
  isCollapsible?: boolean;
  selectedTicketType?: TicketType;
  onTicketTypePress?: () => void;
  additionalGuests: number;
  onAdditionalGuestsChange: (value: number) => void;
  inviteMessage: string;
  onInviteMessageChange: (message: string) => void;
  guestNote: string;
  onGuestNoteChange: (note: string) => void;
  eventName?: string;
  eventStartDate?: string;
  directlySendToConfirm: boolean;
  onDirectlySendToConfirmChange: (value: boolean) => void;
  maxAdditionalGuests?: number;
  ticketTypeError: string;
  status?: string;
  timeZone?: string;
  onFocusGuestNote?: () => void;
  onFocusInviteMessage?: () => void;
  declinedBy?: string;
  declinedReason?: string;
  spammedByHost?: boolean;
  isPastEvent?: boolean;
}

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const InviteDetails: React.FC<InviteDetailsProps> = ({
  isCollapsible = false,
  selectedTicketType,
  onTicketTypePress,
  additionalGuests,
  onAdditionalGuestsChange,
  inviteMessage,
  onInviteMessageChange,
  guestNote,
  onGuestNoteChange,
  eventName,
  eventStartDate,
  directlySendToConfirm,
  onDirectlySendToConfirmChange,
  maxAdditionalGuests,
  ticketTypeError,
  status,
  timeZone,
  onFocusGuestNote = () => { },
  onFocusInviteMessage = () => { },
  declinedBy,
  declinedReason,
  isPastEvent,
  spammedByHost,
}) => {
  const inviteMessageRef = useRef<InputRefMethods>(null);
  const guestNoteRef = useRef<InputRefMethods>(null);

  const { userId } = useSelector(
    (state: RootState) => ({
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const formatedDate = convertUTCToTimeZoneFormat(
    eventStartDate,
    timeZone,
    `MMM DD, yyyy [at] h:mm A`,
  );

  const isDeclinedByHost = userId == declinedBy;
  let disableTicketType = false;
  let disableAdditionalguest = false;
  let disableGuestNote = false;
  let disableInviteMessage = false;
  let showInviteMessage = true;
  let showBypassRegistration = true;

  if (declinedBy) {
    if (isDeclinedByHost) {
      disableTicketType = false;
      disableAdditionalguest = false;
      disableGuestNote = false;
      disableInviteMessage = false;
      showInviteMessage = true;
      showBypassRegistration = true;
    } else {
      disableTicketType = true;
      disableAdditionalguest = true;
      disableGuestNote = true;
      disableInviteMessage = true;
      showInviteMessage = false;
      showBypassRegistration = false;
    }
  }

  if (isPastEvent) {
    disableTicketType = true;
    disableAdditionalguest = true;
    disableGuestNote = true;
    disableInviteMessage = true;
  }
  if (status === 'INVITED') {
    disableInviteMessage = true;
  }

  const renderContent = () => (
    <View style={{ gap: verticalMarginScale(24) }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: horizontalMarginScale(8),
        }}>
        <View style={{ flex: 1 }}>
          <CustomText style={styles.label}>
            {EVENT.TICKET_TYPE}
            <CustomText style={[styles.label, { color: COLORS.errorText }]}>
              {' *'}
            </CustomText>
          </CustomText>
          <TouchableOpacity
            style={[
              styles.selectTicketTypeContainer,
              disableTicketType && styles.disabledSelectTicketTypeContainer,
            ]}
            onPress={onTicketTypePress}
            disabled={disableTicketType}>
            <CustomText
              style={disableTicketType && { color: COLORS.neutral_disabled }}>
              {selectedTicketType?.name || EVENT.SELECT_TICKET_TYPE}
            </CustomText>
            <Image
              source={IMAGES.arrowRight}
              style={[
                {
                  height: verticalScale(16),
                  width: horizontalScale(16),
                  transform: [{ rotate: '90deg' }],
                  resizeMode: 'contain'
                },
                disableTicketType && { tintColor: COLORS.neutral_disabled },
              ]}
            />
          </TouchableOpacity>
          {ticketTypeError ? (
            <CustomText style={styles.errorText}>{ticketTypeError}</CustomText>
          ) : null}
        </View>

        <View>
          <CustomText style={styles.label}>{EVENT.ADDITIONAL_GUEST}</CustomText>
          <Counter
            counterValue={additionalGuests}
            onPressMinus={() =>
              onAdditionalGuestsChange(Math.max(0, additionalGuests - 1))
            }
            onPressPlus={() => onAdditionalGuestsChange(additionalGuests + 1)}
            disabled={disableAdditionalguest}
          />
        </View>
      </View>

      {status !== 'CONFIRMED' && (
        <>
          {showInviteMessage ? (
            <View>
              <CustomText style={styles.label}>{EVENT.INVITE_MSG}</CustomText>
              <View
                style={[
                  styles.inviteMessageInputContainer,
                  disableInviteMessage && {
                    backgroundColor: COLORS.bgGray,
                  },
                ]}>
                <CustomText
                  style={[
                    styles.inviteMessagePrototype,
                    disableInviteMessage && {
                      color: COLORS.neutral_disabled,
                    },
                  ]}>
                  {`Hi, you're invited to ${eventName || '[Event Name]'
                    } on ${formatedDate}`}
                </CustomText>
                <View style={styles.seperator} />
                <Input
                  ref={inviteMessageRef}
                  defaultValue={inviteMessage}
                  errorMessage=""
                  placeholder={EVENT.ADD_MSG}
                  multiline
                  inputFieldContainerStyle={{
                    borderWidth: 0,
                    borderBottomLeftRadius: radiusScale(16),
                    borderBottomRightRadius: radiusScale(16),
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                  }}
                  otherStyle={{ marginTop: 0 }}
                  editable={!disableInviteMessage}
                  onChangeText={onInviteMessageChange}
                  onFocus={onFocusInviteMessage}
                />
              </View>
            </View>
          ) : null}

          <Input
            ref={guestNoteRef}
            label="Guest Note"
            defaultValue={guestNote}
            errorMessage=""
            placeholder={EVENT.ADD_NOTE}
            multiline
            inputFieldContainerStyle={{ borderRadius: radiusScale(8) }}
            otherStyle={{ marginTop: 0 }}
            onChangeText={onGuestNoteChange}
            onFocus={onFocusGuestNote}
            editable={!disableGuestNote}
          />

          {showBypassRegistration ? (
            <>
              {directlySendToConfirm ? (
                <View
                  style={[
                    styles.bypassTextContainer,
                    {
                      paddingVertical: verticalMarginScale(8),
                      paddingHorizontal: horizontalMarginScale(8),
                      borderRadius: radiusScale(8),
                    },
                  ]}>
                  <Image
                    source={IMAGES.info}
                    style={styles.bypassInfo}
                    resizeMode="contain"
                  />
                  <CustomText style={{ flex: 1, fontSize: fontScale(14) }}>
                    {EVENT.DIRECTLY_ADD}
                  </CustomText>
                  <Button
                    onPress={() =>
                      onDirectlySendToConfirmChange(!directlySendToConfirm)
                    }
                    title="Undo"
                    imageSource={IMAGES.corner_up_left}
                    leftImageStyle={{
                      height: verticalScale(16),
                      width: horizontalScale(16),
                    }}
                    buttonType="stripe"
                    style={styles.undoCta}
                  />
                </View>
              ) : (
                <View>
                  <CustomText style={styles.bypassLabel}>
                    {EVENT.BYPASS_REGISTRATION}
                  </CustomText>
                  <TouchableOpacity
                    style={styles.bypassTextContainer}
                    onPress={() =>
                      onDirectlySendToConfirmChange(!directlySendToConfirm)
                    }>
                    <CustomText style={styles.bypassText}>
                      {EVENT.ADD_DIRECTLY}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : null}

          {declinedReason ? (
            <View>
              <CustomText style={styles.label}>{EVENT.DECLINE_REASON}</CustomText>
              <View style={styles.inviteMessageInputContainer}>
                <CustomText
                  style={[
                    styles.inviteMessagePrototype,
                    { color: COLORS.placeHodler },
                  ]}>
                  {declinedReason}
                </CustomText>
              </View>
            </View>
          ) : null}
        </>
      )}
    </View>
  );

  return (
    <CollapseWrap title={EVENT.INVITE_DETAIL} isCollapsible={isCollapsible}>
      {renderContent()}
    </CollapseWrap>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: verticalMarginScale(4),
    fontFamily: fontFamily.ABCDiatype_Medium,
  },
  inviteMessageInputContainer: {
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    borderWidth: verticalScale(1),
  },
  inviteMessagePrototype: {
    marginHorizontal: horizontalMarginScale(16),
    marginVertical: verticalMarginScale(16),
  },
  seperator: {
    borderBottomWidth: verticalScale(1),
    borderBottomColor: COLORS.tabBorderColor,
  },
  bypassLabel: {
    fontSize: fontScale(12),
  },
  bypassTextContainer: {
    marginTop: verticalMarginScale(6),
    backgroundColor: COLORS.bgBlue,
    alignSelf: 'flex-start',
    paddingHorizontal: horizontalMarginScale(8),
    paddingVertical: verticalMarginScale(4),
    borderRadius: radiusScale(99),
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalMarginScale(8),
  },
  bypassText: {
    fontSize: fontScale(11),
    color: COLORS.blueDark,
  },
  bypassInfo: {
    height: verticalScale(16),
    width: verticalScale(16),
    tintColor: COLORS.blueDark,
  },
  undoCta: {
    backgroundColor: undefined,
    width: undefined,
    height: undefined,
    paddingVertical: verticalMarginScale(6),
    paddingHorizontal: horizontalMarginScale(12),
  },

  selectTicketTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: verticalScale(1),
    borderColor: COLORS.borderGray,
    borderRadius: radiusScale(8),
    paddingHorizontal: horizontalMarginScale(12),
    height: verticalScale(40),
    justifyContent: 'space-between',
  },
  disabledSelectTicketTypeContainer: {
    backgroundColor: COLORS.bgGray,
  },
  errorText: {
    fontSize: fontScale(12),
    marginTop: verticalMarginScale(5),
    color: COLORS.errorText,
  },
});

export default InviteDetails;
