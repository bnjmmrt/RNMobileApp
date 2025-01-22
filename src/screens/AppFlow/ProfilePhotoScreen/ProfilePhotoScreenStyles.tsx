import { StyleSheet } from 'react-native';
import { Wp, Hp } from '../../../utils/dimensions';
import { COLORS } from '../../../utils/constants';

const ProfilePhotoScreenStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    btnStyle: {
      width: Wp(85),
      borderRadius: 100,
    },
    contentContainer: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    genderContainer: {
      marginTop: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    genderButton: {
      paddingVertical: Hp(1.5),
      paddingHorizontal: Wp(5),
      borderRadius: 20,
      backgroundColor: COLORS.lighter_gray,
      marginVertical: Hp(1),
      marginHorizontal: Wp(1),
      alignItems: 'center',
    },
    selectedGenderButton: {
      backgroundColor: COLORS.black,
    },
    genderText: {
      fontSize: 16,
      color: COLORS.black,
    },
    selectedGenderText: {
      color: COLORS.white,
    },
    profilePhotoContainer: {
      height: 100,
      width: 100,
      borderRadius: 50,
      backgroundColor: COLORS.tabBorderColor,
      alignSelf: 'center',
      justifyContent:"center",
      alignItems:"center"
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.black,
      borderRadius: 50,
      width: 32,
      height: 32,
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    ic_pencil: {
      height: 16,
      width: 16,
      tintColor: COLORS.white,
    },
    
  });
};

export default ProfilePhotoScreenStyles;
