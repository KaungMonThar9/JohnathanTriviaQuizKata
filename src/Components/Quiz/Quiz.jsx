import React, { useState, useEffect } from 'react';
import './Quiz.css';
import Axios from 'axios';
import DOMPurify from 'dompurify';
import { SelectionMenu } from '../Dropdown/SelectionMenu';
import { toast } from 'react-toastify';


export const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [select, setSelect] = useState(false);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);


  const startQuiz = (url, timeLimit) => {
    if (timeLimit && timeLimit > 0) {
      setTimeLeft(timeLimit * 60);  //minutes to seconds 
      setTimerActive(true);
    }
    Axios.get(url)
      .then((res) => {
        const urlAmount = url.split('amount=')[1];
        const requestedAmount = urlAmount ? parseInt(urlAmount.split('&')[0]) : 10;
        const actualAmount = res.data.results.length;
        
        if (actualAmount < requestedAmount && actualAmount > 0) {
          toast.error(`Only ${actualAmount} questions available (requested ${requestedAmount}). We apologize for the inconvenience.`);
        }
        else if (actualAmount === 0){
          toast.error('No questions available! Please modify your choices.');
          return;
        } 
        setQuizData(res.data.results);
        setQuestion(res.data.results[0]);
        setSelect(true);
      })
      .catch((error) => {
        if (error.response?.status === 429) toast.error('Too many requests! Please try again.')
        else toast.error('Something went wrong! Please try again later!')  
      })
      
  }; 


  const shuffle = (questionArray) => {
    const sortedArray = [...questionArray];
    sortedArray.sort(() => Math.random() - 0.5);
    return sortedArray;
  }

  useEffect(() => {
    if (question) {
      if (!shuffledAnswers[index]) {
        const shuffled = shuffle([question.correct_answer, ...question.incorrect_answers]);
        setAnswers(shuffled);
        setShuffledAnswers(prev => {
          const newShuffled = [...prev];
          newShuffled[index] = shuffled;
          return newShuffled;
        });
      } else {
        setAnswers(shuffledAnswers[index]);
      }
    }
  }, [question, index, shuffledAnswers]); 

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            setResult(true);
            return;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const checkAns = (answer) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      const previousAnswer = newAnswers[index];
      newAnswers[index] = answer;
      const wasCorrect = previousAnswer === question.correct_answer;
      const isCorrect = answer === question.correct_answer;
      
      if (wasCorrect && !isCorrect) {
        setScore(prev => prev - 1);
      } else if (!wasCorrect && isCorrect) {
        setScore(prev => prev + 1);
      }      
      return newAnswers;
    });  
  };

  const next = () => {
    if (index === quizData.length - 1) {
      setResult(true);
      return;
    }
    const newIndex = index + 1;
    setIndex(newIndex);
    setQuestion(quizData[newIndex]);
  };

  const back = () => {
    const newIndex = index - 1;
    setIndex(newIndex);
    setQuestion(quizData[newIndex]);
  };

  const reset = () => {
    setIndex(0);
    setScore(0);
    setSelect(false);
    setQuestion(null);
    setQuizData([]);
    setAnswers([]);
    setResult(false);
    setUserAnswers([]);
    setShuffledAnswers([]);
    setTimeLeft(0);
    setTimerActive(false);
  };

  return (
    <div className={`container ${select && !result ? 'quiz-active' : ''}`}>
      <h1>Test Your Knowledge: Thrilling Trivia!</h1>
      <hr />
      {select ? (
        <>
          {!question ? (
            <h2>Loading...</h2>
          ) : result ? (
            <>
              <h2 id='finalResult'> Final Score: {score} out of {quizData.length}</h2>
              <div style={{maxHeight: '40vh', overflowY: 'auto'}}>
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col'>#</th>
                      <th scope='col'>Question</th>
                      <th scope='col'>Your Answer</th>
                      <th scope='col'>Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizData.map((question, index) => {
                      const isCorrect = question.correct_answer === userAnswers[index];
                    return (
                      <tr key={index} className={isCorrect ? 'table-success' : 'table-danger'}>
                        <th scope='row'>{index + 1}</th>
                        <td dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(question.question)}}></td>
                        <td dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userAnswers[index] || 'Not answered')}}></td>
                        <td dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(question.correct_answer)}}></td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
                <button className='quiz-button' onClick={reset}>Reset</button>
            </>
          ) : (
            <>
              <h2>{index + 1}. <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(question.question)}}></span></h2>
              {timerActive && (
                <div className="timer-display">
                  <span className="timer-text">
                    Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
                <div className='quiz-options'>
                  <ul>
                    {answers.map((ans,i) => {
                        const isSelected = userAnswers[index] === ans;
                        return (
                        <li 
                            key={`${index}-${i}`}
                            className={isSelected ? 'selected-ans' : ''}
                            onClick={() => {checkAns(ans)}}
                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(ans)}}
                        >
                        </li>
                        );
                    })}
                  </ul>
                </div>
              {index === 0 ? (
                <button className='quiz-button' onClick={next}>Next</button>
              ) : index === (quizData.length - 1) ? (
                <div className='quiz-buttons'>
                  <button className='quiz-button' onClick={back}>Back</button>
                  <button className='quiz-button' onClick={next}>Submit</button>
                </div>
              ) : (
                <div className='quiz-buttons'>
                  <button className='quiz-button' onClick={back}>Back</button>
                  <button className='quiz-button' onClick={next}>Next</button>
                </div>
              )}
              <div className="progress">
                <div
                  className="progress-bar progress-bar-striped bg-info progress-bar-animated" 
                  role="progressbar" 
                  style={{width: `${100 * ((index + 1) / (quizData.length))}%`}} 
                  aria-valuenow={`${100 * ((index + 1) / (quizData.length))}%`}
                  aria-valuemin="0" 
                  aria-valuemax="100">
                </div>
              </div>
              <div className='index'>{index + 1} of {quizData.length} questions</div>
            </>
          )}
        </>
      ) : (
        <SelectionMenu onSubmit={startQuiz} />
      )}
    </div>
  );
}