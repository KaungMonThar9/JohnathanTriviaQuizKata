import React from 'react';
import { toast } from 'react-toastify';
import Axios from 'axios';
import './SubmitButton.css';

export const SubmitButton = ({ questAmt, catNum, questDiff, questType, timeLimit, onSubmit }) => {
  const handleClick = () => {
    if (questAmt < 1) {
      toast.error('Please enter at least 1 question!');
      return;
    }
    else if (questAmt > 50) {
      toast.error('Number of questions cannot be more than 50!');
      return;
    } 
    let apiUrl = `https://opentdb.com/api.php?amount=${questAmt}`;
    
    if (catNum && catNum !== 0) {
      apiUrl += `&category=${catNum}`;
    }
    if (questDiff) {
      apiUrl += `&difficulty=${questDiff}`;
    }
    if (questType) {
      apiUrl += `&type=${questType}`;
    }
    
    if (onSubmit) {
      onSubmit(apiUrl, timeLimit);
    }
  };

  return (
    <button className='submit-button' onClick={handleClick}>
      Create Quiz
    </button>
  );
};
