import {StyleSheet} from 'react-native';
import {COLORS} from 'src/utils/constants';
import {Wp} from 'src/utils/dimensions';
import {fontFamily} from 'src/utils/functions';

export const styles = StyleSheet.create({
  actionButtonContainer: {
    gap: 4,
    paddingTop: 16,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 99,
  },

  actionContentWrapper: {
    marginHorizontal: Wp(5),
  },
  actionCta: {
    borderRadius: 99,
  },

  //report user
  reportMessage: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginBottom: 32,
    marginTop: 16,
  },
  reportInputLabel: {
    color: COLORS.black,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    height: 160,
    marginTop: 4,
    padding: 12,
    marginBottom: 24,
  },

  //spam user
  title: {
    fontSize: 32,
    fontFamily: fontFamily.RomieTrial_Bold,
    color: COLORS.black,
    textAlign: 'center',
    marginTop: 16,
  },
  markSpamMessage: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginTop: 16,
    marginBottom: 24,
  },
  markSpamCta: {
    backgroundColor: COLORS.errorText,
  },

  //add to list
  listItem: {
    borderWidth: 1,
    borderColor: COLORS.borderGray,
  },
  createListCta: {
    borderWidth: 1,
    borderColor: COLORS.black,
    marginTop: 8,
  },

  //create list
  createListMessage: {
    textAlign: 'center',
    color: COLORS.light_gray,
    marginBottom: 32,
    marginTop: 16,
  },
  listNameInputLabel: {
    color: COLORS.black,
  },
  listNameInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    marginTop: 4,
    padding: 12,
    marginBottom: 24,
  },
});
