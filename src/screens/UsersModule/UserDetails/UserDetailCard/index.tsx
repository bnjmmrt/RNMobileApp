import React from 'react';
import {View} from 'react-native';
import {CustomText} from 'src/component/CustomText';
import createStyle from './style';

interface UserDetailCardProps {
  children: React.ReactNode;
  title?: string;
}

const UserDetailCard: React.FC<UserDetailCardProps> = ({children, title}) => {
  const styles = createStyle();

  return (
    <View style={styles.container}>
      {title ? <CustomText style={styles.title}>{title}</CustomText> : null}
      {title ? <View style={styles.seprator} /> : null}
      {children}
    </View>
  );
};

export default UserDetailCard;
