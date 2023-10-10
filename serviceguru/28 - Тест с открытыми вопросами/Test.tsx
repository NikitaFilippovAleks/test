import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Platform } from 'react-native';

import { Box, Button, Center, Image, Input, KeyboardAvoidingView, Pressable, Row, ScrollView, Text, TextArea } from 'native-base';
import reactotron from 'reactotron-react-native';
import moment from 'moment';
import { FlashList } from '@shopify/flash-list';
import update from 'immutability-helper';
import lodash from 'lodash';

import CloseIcon from 'svg/Close.svg';

import { apiWrapper } from 'config/api';
import Tick from 'svg/Tick';
import RadioCheckbox from 'helpers/RadioCheckbox';
import MainButton from './MainButton';
import { useTranslation } from 'react-i18next';
import { InterfaceTest } from 'models/Tests';
import { useNavigation } from '@react-navigation/native';

const apiUrls = {
  login: '/login',
  login_check: '/login/check',
  announcements: {
    allNews: '/announcements',
    specificNews: (id: string): string => `/announcements/${id}`
  },
  courses: {
    list: '/courses',
    specificCourse: (id: string): string => `/courses/${id}`,
    watched: (id: string): string => `/courses/${id}/watched`,
    tests: {
      one: (id: string): string => `/courses/tests/${id}`,
      results: (id: string): string => `/courses/tests/${id}/results`
    }
  }
};

// Форматирование оставшегося времени
export function formatTimeLeft(time: number, format = 'm:ss'): string {
  const timeLeft = time < 0 ? 0 : time;
  const timerDuration = moment.duration(timeLeft, 'seconds');

  return moment(timerDuration.asMilliseconds()).format(format);
}

interface InterfaceProps {
  testData: InterfaceTest,
  onClose: () => void
}

// Компонент теста
const Test = ({ testData, onClose }: InterfaceProps): ReactElement => {
  const [questionStepIndex, setQuestionStepIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(testData.questions[questionStepIndex].seconds);
  const [currentFreeAnswer, setCurrentFreeAnswer] = useState('');

  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const [resultAnswers, setResultAnswers] = useState([]);

  const [answerChecked, setAnswerChecked] = useState(false);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [isNewAnswerSet, setIsNewAnswerSet] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((time) => {
        if (time === 0 && ((questionStepIndex + 1) < testData.questions_count)) {
          const nextQuestionStepIndex = questionStepIndex + 1;
          setQuestionStepIndex(nextQuestionStepIndex);
          setCurrentTime(testData.questions[nextQuestionStepIndex].seconds);
        }

        return time - 1;
      });
    }, 100000);

    return () => clearInterval(interval);
  }, [questionStepIndex]);

  // Обработка input при свободном вопросе
  const handleTextChange = (text) => setCurrentFreeAnswer(text);

  const getFormData = () => {
    const obj = {
      result: {
        version: 12,
        variant: 2,
        seconds: 40,
        passed_at: 15,
        answers_attributes: [
          {
            score: 0,
            question_id: 9,
            user_text: 'Hello',
            answers_attributes: [
              {
                answer_id: 1
              },
              {
                answer_id: 2
              }
            ]
          },
          {
            score: 1,
            question_id: 10,
            user_text: 'Privet',
            answers_attributes: [
              {
                answer_id: 1
              },
              {
                answer_id: 2
              }
            ]
          }
        ]
      }
    };

    return JSON.stringify(obj);
  };

  //  Получение цвета ответа в зависимости от првильности выбора
  const getCheckedAnswerColor = (answerId) => {
    // const answerSelected =
    // if ()
  };

  // Быстрая проверка ответа
  const fastCheckAnswer = (answers) => {
    const correctAnswers = answers.filter(answer => answer.correct).map(answer => answer.correct);

    return lodash.isEqual(correctAnswers, selectedAnswers);
  };

  // Проверка ответа
  const checkAnswer = () => {
    const correctAnswerAttributes = testData.questions[questionStepIndex].answers.filter(answer => answer.correct);

    if (lodash.isEqual(selectedAnswers, correctAnswerAttributes)) return true;
    return false;
  };

  // Формирование ответа на вопрос
  const generateNewAnswer = (isNewAnswerCorrect: boolean) => {
    const question = testData.questions[questionStepIndex];

    //  Формирование ответа
    const newAnswer = {
      score: fastCheckAnswer(question.answers),
      question_id: question.id,
      user_text: currentFreeAnswer,
      answers_attributes: selectedAnswers
    };

    // Добавление очков за правильный ответ
    newAnswer.score = isNewAnswerCorrect ? courseLevel : 0;

    // Добавление ответа в список ответов
    setResultAnswers([ ...resultAnswers, newAnswer ]);
  };

  // Добавление ответа в resultAnswers, проверка ответа и переход на следующий вопрос
  const nextQuestion = () => {
    const isNewAnswerCorrect = checkAnswer();

    if (testData.show_answers && !answerChecked) {
    // Проверка ответа
      setAnswerChecked(true);
      setCheckedAnswers(prev => [...prev, isNewAnswerCorrect]);
    } else if ((questionStepIndex + 1) < testData.questions_count) {
    // Формирование ответа и пререход к следующему вопросу
      generateNewAnswer(isNewAnswerCorrect);

      const nextQuestionStepIndex = questionStepIndex + 1;
      setQuestionStepIndex(nextQuestionStepIndex);
      setCurrentTime(testData.questions[nextQuestionStepIndex].seconds);
      setSelectedAnswers([]);
      setAnswerChecked(false);
    }
  };

  const fetchFinishTest = async () => {
    const result = await apiWrapper.post(apiUrls.courses.tests.results(12), getFormData());
  };

  // Вывод заголовка
  const renderHeader = () => (
    <Box px={4}>
      <Row h={10} alignItems='center' justifyContent='space-between' borderBottomWidth='1px' borderBottomColor='#EAEAEA'>
        <Pressable w={12} onPress={onClose}>
          <CloseIcon />
        </Pressable>
        <Text fontWeight={500}>Вопрос {questionStepIndex + 1}/{testData.questions_count}</Text>

        <Row w={12} display='flex' justifyContent='flex-end'>
          <Text color='#989898'>{formatTimeLeft(currentTime)}</Text>
        </Row>
      </Row>
    </Box>
  );

  // Вывод элемента полоски прогрессии
  const renderProgressBarElement = (index, progressBarElementWidth) => {
    let barColor = '#9ED8FC';

    if (testData.show_answers && ((index + 1) <= checkedAnswers.length)) {
      barColor = checkedAnswers[index] ? '#5FB95D' : '#EF5050';
    }

    return (
      <Box key={index}
           h={1}
           w={progressBarElementWidth}
           backgroundColor={index <= questionStepIndex ? barColor : '#E3E3E3'} />
    );
  };

  // Вывод полоски прогрессии
  const renderProgressBar = () => {
    const windowWidth = Dimensions.get('window').width;
    const gapWidth = 2;
    const progressBarElementWidth = (windowWidth / testData.questions_count) - (gapWidth * (testData.questions_count - 1));

    return (
      <Row h={1} justifyContent='space-between'>
        {testData.questions.map(( _, index ) => renderProgressBarElement(index, progressBarElementWidth))}
      </Row>
    );
  };

  // Вывод открытого вопроса
  const renderOpenQustionBody = () => {
    const question = testData.questions[questionStepIndex];

    return (
      <Box mt={6} px={4}>
        <Image mb={4} w='100%' h={174} borderRadius={15} alt='QuestionImage' source={{ uri: question.image_url }} />

        <Text mb={1} fontSize='xs' color='#989898'>Свободный ответ</Text>

        <Text mb={6} fontSize='md' fontWeight={500}>{question.name}</Text>

        <Input mb={3}
               pt={3}
               minH={10}
               fontSize='sm'
               borderWidth={0}
               backgroundColor='#F7F7F7'
               borderRadius={8}
               placeholder='Ваш ответ'
               multiline
               value={currentFreeAnswer}
               onChangeText={handleTextChange} />

        {question.comment.length > 0 && (
          <>
            <Text color='#989898' fontWeight={500}>Подсказка:</Text>
            <Text color='#989898' lineHeight={17}>{question.comment}</Text>
          </>
        )}
      </Box>
    );
  };

  // Обработка выбора чекбокса
  const handleCheckboxChange = (item, singleChoice = false) => {
    if (singleChoice) setSelectedAnswers([item]);
    else setSelectedAnswers(lodash.xorBy(selectedAnswers, [item], 'id'));
    // reactotron.log('selectedAnswers:', selectedAnswers);
  };

  const renderSelectQuestionVariant = (item, index, question) => {
    const elementProperties = {
      borderColor: '#55BAF9',
      innerElementColor: '#EFA350',
      labelColor: '#333333',
      correctCheckbox: true
    };
    // reactotron.log('selectedAnswers:', selectedAnswers);
    if (answerChecked) {
      const correctAnswer = item.correct;
      const notSelectedAnswer = !item.correct && (selectedAnswers.findIndex(answer => answer.id === item.id) === -1);

      if (correctAnswer) {
        elementProperties.borderColor = '#5FB95D';
        elementProperties.innerElementColor = '#5FB95D';
        elementProperties.labelColor = '#5FB95D';
      } else if (notSelectedAnswer) {
        elementProperties.borderColor = '#C7C7C7';
        elementProperties.innerElementColor = '#C7C7C7';
        elementProperties.labelColor = '#C7C7C7';
      } else {
        elementProperties.borderColor = '#EF5050';
        elementProperties.innerElementColor = '#EF5050';
        elementProperties.labelColor = '#EF5050';
        elementProperties.correctCheckbox = false;
      }
    }

    return (
      <Box mb={3}>
        <RadioCheckbox checked={selectedAnswers.find(answer => answer.id === item.id)}
                       setChecked={() => handleCheckboxChange(item, question.single_choice)}
                       label={question.answers[index].name}
                       type={question.single_choice ? 'radio' : 'checkbox'}
                       borderColor={elementProperties.borderColor}
                       innerElementColor={elementProperties.innerElementColor}
                       labelColor={elementProperties.labelColor}
                       correctCheckbox={elementProperties.correctCheckbox} />
      </Box>
    );
  };

  // Вывод вопроса с возможностью выбора
  const renderSelectQuestionBody = () => {
    const question = testData.questions[questionStepIndex];

    return (
      <Box mt={6} px={4} h='100%'>
        <Image mb={4} w='100%' h={174} borderRadius={15} alt='QuestionImage' source={{ uri: question.image_url }} />

        <Text mb={1} fontSize='xs' color='#989898'>Свободный ответ</Text>

        <Text mb={6} fontSize='md' fontWeight={500}>{question.name}</Text>

        <FlashList data={question.answers}
                   extraData={[selectedAnswers, answerChecked]}
                   estimatedItemSize={18}
                   renderItem={({ item, index }) => renderSelectQuestionVariant(item, index, question)} />
      </Box>
    );
  };

  // Вывод кнопки обработки ответа
  const renderHandleAnswerButton = () => (
    <Box mb={2} mx={4}>
      <MainButton onPress={nextQuestion}
                  text={
                    (!answerChecked && testData.show_answers) ? t('models.test.check') : t('models.test.next')
                  } />
    </Box>
  );

  const renderContent = () => (
    <KeyboardAvoidingView flex={1}
                          bgColor='light'
                          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                          keyboardVerticalOffset={22}>
      {renderHeader()}

      {renderProgressBar()}

      <ScrollView>
        {renderOpenQustionBody()}
      </ScrollView>

      {selectedAnswers.length > 0 && renderHandleAnswerButton()}
    </KeyboardAvoidingView>
  );

  return renderContent();
};

export default Test;
