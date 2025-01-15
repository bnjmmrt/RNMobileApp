import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS} from '../../utils/constants';

const ProgressBar = () => {
  const [progress, setProgress] = useState(2); // dummy value is passed 
  const steps = 5; // Total number of steps

  const progressPercentage = (progress / steps) * 100;

  const handleNextStep = () => {
    if (progress < steps) {
      setProgress(progress + 1); // Increment progress by 1
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, {width: `${progressPercentage}%`}]} />
      </View>
      {/* <TouchableOpacity onPress={handleNextStep}>
        <Text >Next Step</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBarContainer: {
    width: '90%',
    height: 4,
    backgroundColor:COLORS.tabBorderColor,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.black,
    borderRadius: 10,
  },

});

export default ProgressBar;
