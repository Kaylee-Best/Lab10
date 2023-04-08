import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { ButtonGroup, CheckBox } from "react-native-elements";
import data from './Questions.JSON';

const Question = ({ route, navigation }) => {
  const { questions, answers, index } = route.params;
  const question = questions[index];

  // add state variable to store the selected answer index
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(
    answers[index]
  );

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    if (question.type === "multiple-choice") {
      // For questions with a single correct answer
      newAnswers[index] = answer;
    } else if (question.type === "multiple-answer") {
      // For questions with multiple correct answers
      if (!Array.isArray(newAnswers[index])) {
        newAnswers[index] = [];
      }

      const answerIndex = newAnswers[index].indexOf(answer);
      if (answerIndex !== -1) {
        newAnswers[index].splice(answerIndex, 1);
      } else {
        newAnswers[index].push(answer);
      }
    } else if (question.type === "true-false") {
      newAnswers[index] = answer;
    }
    navigation.setParams({ answers: newAnswers });
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      navigation.push("Question", { questions, answers, index: index + 1 });
    } else {
      navigation.push("Summary", { questions, answers });
    }
  };

  const renderChoices = () => {
    if (question.type === "true-false") {
      return (
        <ButtonGroup
          onPress={(index) => {
            handleAnswer(index);
            setSelectedAnswerIndex(index);
          }}
          selectedIndex={answers[index]}
          buttons={question.choices}
          containerStyle={{ height: 100 }}
          selectedTextStyle={styles.selectedText}
          testID="choices"
        />
      );
    } else if (question.type === "multiple-choice") {
      return (
        <View>
          {question.choices.map((choice, index) => (
            <Button
              key={index}
              title={choice}
              onPress={() => {
                handleAnswer(index);
                setSelectedAnswerIndex(index);
              }}
              buttonStyle={
                selectedAnswerIndex === index
                  ? styles.selectedButton
                  : styles.unselectedButton
              }
            />
          ))}
        </View>
      );
    } else if (question.type === "multiple-answer") {
      return (
        <View>
          {question.choices.map((choice, index) => (
            <CheckBox
              key={index}
              title={choice}
              checked={
                Array.isArray(answers[index]) && answers[index].includes(index)
              }
              onPress={() => handleAnswer(index)}
              containerStyle={{ backgroundColor: "transparent" }}
            />
          ))}
        </View>
      );
    }
  };

  return (
    <View>
      <Text>{question.prompt}</Text>
      {renderChoices()}
      {/* show selected answer */}
      <Text style={styles.selectedAnswer}>
        You selected:{" "}
        {question.type === "multiple-answer"
          ? answers[index]?.sort().join(", ")
          : selectedAnswerIndex}
      </Text>
      <Button title="Next" onPress={handleNext} testID="next-question" />
    </View>
  );
};

const styles = StyleSheet.create({
  selectedText: {
    backgroundColor: "green",
  },
  selectedAnswer: {
    marginVertical: 10,
  },
});

export default Question;