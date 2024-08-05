import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axios/axiosconfig';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';

const EditQuiz = () => {
  useAuthRedirect();

  const { quizId } = useParams(); // Correctly retrieve the quizId parameter
  const username = useSelector((state) => state.user.username);
  const navigate = useNavigate();
  const [adminID, setAdminID] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryID: ''
  });
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [removedQuestions, setRemovedQuestions] = useState([]);
  const [removedAnswers, setRemovedAnswers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/category/titles');
        const categoryTitles = response.data.$values;
        setCategories(categoryTitles);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAdminID = async () => {
      try {
        const response = await axios.get(`/admin/get-admin-id?username=${username}`);
        setAdminID(response.data);
      } catch (error) {
        console.error('Error fetching admin ID:', error);
      }
    };

    fetchAdminID();
  }, [username]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/quiz/${quizId}`);
        const quizData = response.data;
        console.log('Fetched Quiz Data:', quizData); // Log the quiz data

        setFormData({
          title: quizData.title,
          description: quizData.description,
          categoryID: quizData.categoryID
        });

        // Extract the questions array from the $values property
        const questionsArray = Array.isArray(quizData.questions.$values) ? quizData.questions.$values : [];

        setQuestions(questionsArray.map(question => ({
          questionID: question.questionID,
          questionText: question.questionText,
          answers: Array.isArray(question.answers.$values) ? question.answers.$values.map(answer => ({
            answerID: answer.answerID,
            answerText: answer.answerText,
            isCorrect: answer.isCorrect
          })) : []
        })));
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: '' });
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
    setErrors({ ...errors, [`question-${index}`]: '' });
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].answerText = value;
    setQuestions(newQuestions);
    setErrors({ ...errors, [`answer-${questionIndex}-${answerIndex}`]: '' });
  };

  const handleToggleCorrect = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === answerIndex
    }));
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', answers: [{ answerText: '', isCorrect: true }, { answerText: '', isCorrect: false }] }]);
  };

  const handleRemoveQuestion = (index) => {
    const questionToRemove = questions[index];
    if (questionToRemove.questionID) {
      setRemovedQuestions([...removedQuestions, questionToRemove.questionID]);
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ answerText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const answerToRemove = questions[questionIndex].answers[answerIndex];
    if (answerToRemove.answerID) {
      setRemovedAnswers([...removedAnswers, answerToRemove.answerID]);
    }
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.splice(answerIndex, 1);
    setQuestions(newQuestions);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'This field is required';
    if (!formData.description) newErrors.description = 'This field is required';
    if (!formData.categoryID) newErrors.categoryID = 'This field is required';

    questions.forEach((question, questionIndex) => {
      if (!question.questionText) newErrors[`question-${questionIndex}`] = 'This field is required';
      let hasTrueAnswer = false;
      question.answers.forEach((answer, answerIndex) => {
        if (!answer.answerText) newErrors[`answer-${questionIndex}-${answerIndex}`] = 'This field is required';
        if (answer.isCorrect) hasTrueAnswer = true;
      });
      if (!hasTrueAnswer) newErrors[`question-${questionIndex}-true`] = 'At least one answer must be true';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateQuiz = async () => {
    if (!validateForm()) return;

    try {
      // Delete removed questions and answers
      for (const questionID of removedQuestions) {
        await axios.delete(`/question/${questionID}`);
      }
      for (const answerID of removedAnswers) {
        await axios.delete(`/answer/${answerID}`);
      }

      const response = await axios.put(`/quiz/update-quiz/${quizId}`, {
        quizID: quizId,
        adminID: adminID,
        title: formData.title,
        description: formData.description,
        categoryID: formData.categoryID,
        questions: questions.map((question) => ({
          questionID: question.questionID,
          questionText: question.questionText,
          quizID: quizId,
          answers: question.answers.map((answer) => ({
            answerID: answer.answerID,
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
            questionID: question.questionID
          }))
        }))
      });
      console.log('Quiz updated successfully:', response.data);
      navigate('/see-my-quizzes');
    } catch (error) {
      console.error('Error updating quiz:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Quiz</h1>
        <form>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryID">
              Category
            </label>
            <select
              id="categoryID"
              value={formData.categoryID}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={index} value={index + 1}>
                  {category}
                </option>
              ))}
            </select>
            {errors.categoryID && <p className="text-red-500 text-xs italic">{errors.categoryID}</p>}
          </div>
          <div className="mb-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add Questions</h2>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`question-${questionIndex}`}>
                  Question {questionIndex + 1}
                </label>
                <input
                  type="text"
                  id={`question-${questionIndex}`}
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {errors[`question-${questionIndex}`] && <p className="text-red-500 text-xs italic">{errors[`question-${questionIndex}`]}</p>}
                {question.answers.map((answer, answerIndex) => (
                  <div key={answerIndex} className="flex items-center mt-4">
                    <input
                      type="text"
                      value={answer.answerText}
                      onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                      className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                      required
                    />
                    <button
                      type="button"
                      className={`shadow appearance-none border rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${answer.isCorrect ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                      onClick={() => handleToggleCorrect(questionIndex, answerIndex)}
                    >
                      {answer.isCorrect ? 'True' : 'False'}
                    </button>
                    {errors[`answer-${questionIndex}-${answerIndex}`] && <p className="text-red-500 text-xs italic ml-2">{errors[`answer-${questionIndex}-${answerIndex}`]}</p>}
                    <button
                      type="button"
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleRemoveAnswer(questionIndex, answerIndex)}
                    >
                      Remove Answer
                    </button>
                  </div>
                ))}
                {errors[`question-${questionIndex}-true`] && <p className="text-red-500 text-xs italic">{errors[`question-${questionIndex}-true`]}</p>}
                <div className="flex space-x-4 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => handleAddAnswer(questionIndex)}
                  >
                    Add Answer
                  </button>
                  {question.answers.length > 2 && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white rounded"
                      onClick={() => handleRemoveQuestion(questionIndex)}
                    >
                      Remove Question
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex space-x-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleRemoveQuestion(questions.length - 1)}
                >
                  Remove Question
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="button"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
              onClick={handleUpdateQuiz}
            >
              Update Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;