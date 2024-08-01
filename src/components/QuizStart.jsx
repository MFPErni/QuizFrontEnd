import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';

const QuizStart = () => {
  const location = useLocation();
  const { quizID, quizTitle, quizDescription, quizCategoryTitle } = location.state;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // State to store answers for each question
  const [selectedAnswer, setSelectedAnswer] = useState(null); // State to track the selected answer
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // State to track the current question index

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/question/questions-by-quiz/${quizID}`);
        const questionData = response.data.$values; // Extract the values
        setQuestions(questionData);

        // Fetch answers for each question
        questionData.forEach(async (question) => {
          const answerResponse = await axios.get(`/answer/answers-by-question/${question.questionID}`);
          const answersData = answerResponse.data.$values; // Extract the values
          setAnswers(prevState => ({
            ...prevState,
            [question.questionID]: answersData
          }));
        });
      } catch (error) {
        console.error('Error fetching questions or answers:', error);
      }
    };

    fetchQuestions();
  }, [quizID]);

  const handleAnswerClick = (questionID, answerID, answerText, isCorrect) => {
    console.log('Answer Text:', answerText);
    console.log('Is Correct:', isCorrect);

    setSelectedAnswer({ questionID, answerID, isCorrect });

    // Move to the next question after a short delay
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null); // Reset selected answer for the next question
    }, 1000); // Adjust the delay as needed
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <NavigationBar />
      <div className="p-4">
        <h2 className="text-xl font-bold">{quizTitle}</h2>
        {currentQuestion && (
          <div className="mt-4">
            <div className="py-2 border-b border-gray-200">
              <p>{currentQuestion.questionText}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {answers[currentQuestion.questionID] && answers[currentQuestion.questionID].map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className={`p-4 shadow rounded-lg cursor-pointer ${
                      selectedAnswer && selectedAnswer.questionID === currentQuestion.questionID && selectedAnswer.answerID === answer.answerID
                        ? selectedAnswer.isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-white'
                    }`}
                    onClick={() => handleAnswerClick(currentQuestion.questionID, answer.answerID, answer.answerText, answer.isCorrect)}
                  >
                    <h3 className="text-lg font-bold">{answer.answerText}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!currentQuestion && (
          <div className="mt-4">
            <p className="text-xl font-bold">Quiz Completed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizStart;