import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomText } from '../../../component/CustomText';
import CollapseWrap from './CollapseWrap';
import { fontScale, verticalMarginScale } from 'src/utils/dimensions';
import { COLORS } from 'src/utils/constants';
import { fontFamily } from 'src/utils/functions';

interface QuestionnaireProps {
  isCollapsible?: boolean;
  data: {
    question: string;
    answer: string;
  }[];
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  isCollapsible = false,
  data,
}) => {
  const renderQuestionAnswer = (question: string, answer: string) => {
    return (
      <View style={styles.questionContainer}>
        <CustomText
          style={styles.question}
          textProps={{
            numberOfLines: 1,
            ellipsizeMode: 'tail',
          }}>
          {question}
        </CustomText>
        <CustomText style={styles.answer}>{answer || 'N/A'}</CustomText>
      </View>
    );
  };

  return (
    <CollapseWrap title="Questionnaire" isCollapsible={isCollapsible}>
      <View style={styles.content}>
        {data.map((item, index) => (
          <View key={index}>
            {renderQuestionAnswer(item.question, item.answer)}
          </View>
        ))}
      </View>
    </CollapseWrap>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: verticalMarginScale(24),
  },
  questionContainer: {
    gap: verticalMarginScale(8),
  },
  question: {
    fontSize: fontScale(18),
    lineHeight: fontScale(24),
    color: COLORS.black,
    fontFamily: fontFamily.ABCDiatype_Bold,
    flexShrink: 1,
  },
  answer: {
    fontSize: fontScale(14),
    lineHeight: fontScale(16),
    color: COLORS.black,
  },
});

export default Questionnaire;
