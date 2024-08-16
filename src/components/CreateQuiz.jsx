import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import useAuthRedirect from '../useAuthRedirect';
import axios from '../axios/axiosconfig';
import BackgroundWrapper from './BackgroundWrapper';

const CreateQuiz = () => {
  useAuthRedirect();

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
  const [errors, setErrors] = useState({});
  const [initialSetup, setInitialSetup] = useState({
    numQuestions: 1,
    numAnswers: 2,
    isSetupComplete: false
  });

  // fetch categories
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

  // fetch adminid
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
    setQuestions([...questions, { questionText: '', answers: Array(initialSetup.numAnswers).fill({ answerText: '', isCorrect: false }) }]);
  };

  // atleast 1 question
  const handleRemoveQuestion = () => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.pop();
      setQuestions(newQuestions);
    }
  };

  const handleAddAnswer = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ answerText: '', isCorrect: false });
    setQuestions(newQuestions);
  };

  // atleast 1 answer
  const handleRemoveAnswer = (questionIndex, answerIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].answers.length > 2) {
      if (newQuestions[questionIndex].answers[answerIndex].isCorrect) {
        setErrors({ ...errors, [`answer-${questionIndex}-${answerIndex}`]: "Can't remove the correct answer" });
      } else {
        newQuestions[questionIndex].answers.splice(answerIndex, 1);
        setQuestions(newQuestions);
        const newErrors = { ...errors };
        delete newErrors[`answer-${questionIndex}-${answerIndex}`];
        setErrors(newErrors);
      }
    }
  };

  // validation
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

  const handleCreateQuiz = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5026/api/quiz', {
        adminID: adminID,
        title: formData.title,
        description: formData.description,
        categoryID: formData.categoryID,
        questions: questions.map(question => ({
          questionText: question.questionText,
          answers: question.answers.map(answer => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect
          }))
        }))
      });
      console.log('Quiz created successfully:', response.data);
      navigate('/categories');
    } catch (error) {
      console.error('Error creating quiz:', error.response ? error.response.data : error.message);
    }
  };

  const handleBackClick = () => {
    navigate('/see-my-quizzes');
  };

  const handleInitialSetupSubmit = (e) => {
    e.preventDefault();
    const initialQuestions = Array.from({ length: initialSetup.numQuestions }, () => ({
      questionText: '',
      answers: Array.from({ length: initialSetup.numAnswers }, (v, i) => ({ answerText: '', isCorrect: i === 0 }))
    }));
    setQuestions(initialQuestions);
    setInitialSetup({ ...initialSetup, isSetupComplete: true });
  };

  if (!initialSetup.isSetupComplete) {
    return (
      <BackgroundWrapper>
        <NavigationBar />
        <div className="p-4 max-w-4xl mx-auto text-white">
          <h1 className="text-3xl font-poppins font-bold text-shadow-lg mb-6">Setup Your Quiz</h1>
          <form onSubmit={handleInitialSetupSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-poppins font-bold mb-2" htmlFor="numQuestions">
                Number of Questions
              </label>
              <input
                type="number"
                id="numQuestions"
                value={initialSetup.numQuestions}
                onChange={(e) => setInitialSetup({ ...initialSetup, numQuestions: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-poppins font-bold mb-2" htmlFor="numAnswers">
                Number of Answers per Question
              </label>
              <input
                type="number"
                id="numAnswers"
                value={initialSetup.numAnswers}
                onChange={(e) => setInitialSetup({ ...initialSetup, numAnswers: Number(e.target.value) })}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="2"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-poppins font-bold text-shadow-lg rounded"
            >
              Start Creating
            </button>
          </form>
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <NavigationBar />
      <div className="p-4 max-w-4xl mx-auto text-white">
        <div className="bg-red-800 bg-opacity-95 shadow-lg rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-poppins font-bold text-shadow-lg">Create a New Quiz</h1>
            <button 
              className="px-4 py-2 bg-black bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
              onClick={handleBackClick}
            >
              Back
            </button>
          </div>
          <form>
            <div className="mb-6">
              <label className="block text-sm font-poppins font-bold mb-2" htmlFor="title">
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
              <label className="block text-sm font-poppins font-bold mb-2" htmlFor="description">
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
              <label className="block text-sm font-poppins font-bold mb-2" htmlFor="categoryID">
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
          </form>
        </div>
        <form>
          <div className="mb-6 p-4 bg-black bg-opacity-95 shadow rounded-lg">
            <h2 className="text-2xl font-poppins font-bold mb-4">Add Questions</h2>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-6">
                <label className="block text-sm font-poppins font-bold mb-2" htmlFor={`question-${questionIndex}`}>
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
                  <div key={answerIndex} className="mt-4">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={answer.answerText}
                        onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                        required
                      />
                      <button
                        type="button"
                        className={`shadow appearance-none border rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${answer.isCorrect ? 'bg-green-500 text-white font-poppins font-bold text-shadow-lg' : 'bg-red-500 text-white font-poppins font-bold text-shadow-lg'}`}
                        onClick={() => handleToggleCorrect(questionIndex, answerIndex)}
                      >
                        {answer.isCorrect ? 'True' : 'False'}
                      </button>
                    </div>
                    {errors[`answer-${questionIndex}-${answerIndex}`] && (
                      <p className="text-red-500 text-xs italic mt-2">{errors[`answer-${questionIndex}-${answerIndex}`]}</p>
                    )}
                  </div>
                ))}
                {errors[`question-${questionIndex}-true`] && <p className="text-red-500 text-xs italic">{errors[`question-${questionIndex}-true`]}</p>}
                <div className="flex space-x-4 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-sky-600 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
                    onClick={() => handleAddAnswer(questionIndex)}
                  >
                    +
                  </button>
                  {question.answers.length > 2 && (
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 text-white font-poppins font-bold text-shadow-lg rounded"
                      onClick={() => handleRemoveAnswer(questionIndex, question.answers.length - 1)}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex space-x-4 mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-emerald-500 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded"
                onClick={handleAddQuestion}
              >
                Add Question
              </button>
              {questions.length > 1 && (
                <button
                  type="button"
                  className="px-4 py-2 bg-orange-500 text-white font-poppins font-bold text-shadow-lg rounded"
                  onClick={handleRemoveQuestion}
                >
                  Remove Question
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mt-8">
            <button
              type="button"
              className="px-6 py-3 bg-purple-500 hover:bg-blue-700 bg-opacity-80 text-white font-poppins font-bold text-shadow-lg rounded focus:outline-none focus:shadow-outline"
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </BackgroundWrapper>
  );
};

export default CreateQuiz;