import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import BackgroundWrapper from './BackgroundWrapper';

const QuizStart = () => {
  useAuthRedirect();

  const location = useLocation();
  const navigate = useNavigate();
  const { quizID, quizTitle, quizDescription, quizCategoryTitle } = location.state;
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/question/questions-by-quiz/${quizID}`);
        const questionData = response.data.$values;
        setQuestions(questionData);

        questionData.forEach(async (question) => {
          const answerResponse = await axios.get(`/answer/answers-by-question/${question.questionID}`);
          const answersData = answerResponse.data.$values;
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

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }

    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer(null);
    }, 1000);
  };

  const handleBackToCategories = () => {
    navigate('/categories');
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <BackgroundWrapper>
      <NavigationBar />
      <div className="p-4 max-w-4xl mx-auto text-white">
        <h2 className="text-3xl font-poppins font-bold text-shadow-lg mb-4">{quizTitle}</h2>
        {currentQuestion && (
          <div className="mt-4 p-4 bg-black bg-opacity-80 shadow rounded-lg">
            <div className="py-2">
              <p className="text-xl font-poppins font-semibold">{currentQuestion.questionText}</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {answers[currentQuestion.questionID] && answers[currentQuestion.questionID].map((answer, answerIndex) => (
                  <div
                    key={answerIndex}
                    className={`p-4 shadow rounded-lg cursor-pointer font-poppins font-bold text-lg text-shadow-lg ${
                      selectedAnswer && selectedAnswer.questionID === currentQuestion.questionID && selectedAnswer.answerID === answer.answerID
                        ? selectedAnswer.isCorrect
                          ? 'bg-green-500 bg-opacity-80 text-white'
                          : 'bg-red-500 bg-opacity-80 text-white'
                        : 'bg-white text-black font-poppins'
                    }`}
                    onClick={() => handleAnswerClick(currentQuestion.questionID, answer.answerID, answer.answerText, answer.isCorrect)}
                  >
                    <h3>{answer.answerText}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!currentQuestion && (
          <div className="mt-4 p-4 bg-black bg-opacity-80 shadow rounded-lg">
            <p className="text-2xl font-poppins font-bold text-shadow-lg">Quiz Completed!</p>
            <p className="text-xl font-poppins">Final Score: {score}</p>
            <button 
              className="mt-4 px-4 py-2 bg-purple-500 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
              onClick={handleBackToCategories}
            >
              Back to Categories
            </button>
          </div>
        )}
      </div>
    </BackgroundWrapper>
  );
};

export default QuizStart;