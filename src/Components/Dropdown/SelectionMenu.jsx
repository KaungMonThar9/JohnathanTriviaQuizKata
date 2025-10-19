import React, { useEffect, useState } from 'react';
import { DropDownButton } from './DropDownButton';
import { SubmitButton } from './SubmitButton';
import { difficulties, types } from './DropDownItem';
import './SelectionMenu.css';
import Axios from 'axios';
import { toast } from 'react-toastify';

export const SelectionMenu = ({ onSubmit }) => {
  const [questAmt, setQuestAmt] = useState(0);
  const [catNum, setCatNum] = useState(0);
  const [categories, setCategories] = useState([]);
  const [questDiff, setQuestDiff] = useState('');
  const [questType, setQuestType] = useState('');
  const [timeLimit, setTimeLimit] = useState(0);
  const invalidChars = ['-', 'e', 'E', '+', '.'];

  useEffect(() => {
    Axios.get('https://opentdb.com/api_category.php')
      .then((res) => {
        setCategories([{ id: 0, name: 'Any Category' }, ...res.data.trivia_categories]);
      })
      .catch(() => {
        toast.error('Failed to fetch categories, please try again!');
      });
  }, []);

  const handleQuestAmtChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 50) {
      event.target.value = 50;
      setQuestAmt(50);
      toast.error('Number of questions cannot be more than 50');
    } else {
      setQuestAmt(value);
    }
  };

  const handleTimeLimitChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 60) {
      event.target.value = 60;
      setTimeLimit(60);
      toast.error('Time limit cannot be more than 60 minutes');
    } else {
      setTimeLimit(value);
    }
  };

  const handleInvalidChars = (event) => {
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
      toast.error('Invalid character! Please only enter numbers!');
      return;
    }
  };

  return (
    <div className='selectionMenu'>
      <input 
        className='input-field' 
        type='number' 
        min='1'
        max='50'
        placeholder='Number of Questions: 1-50' 
        onChange={handleQuestAmtChange}
        onKeyDown={handleInvalidChars}
      />
      <DropDownButton 
        title='Categories' 
        optionsArray={categories} 
        onSelect={(option) => setCatNum(option.id)}
      />
      <DropDownButton 
        title='Difficulty' 
        optionsArray={difficulties} 
        onSelect={(option) => setQuestDiff(option.value)}
      />
      <DropDownButton 
        title='Question Type' 
        optionsArray={types} 
        onSelect={(option) => setQuestType(option.value)}
      />
      <input 
        className='input-field' 
        type='number' 
        min='1'
        max='60'
        placeholder='Time limit(in minutes)' 
        onChange={(event) => handleTimeLimitChange(event)}
        onKeyDown={handleInvalidChars}
      />
      <SubmitButton 
        questAmt={questAmt} 
        catNum={catNum} 
        questDiff={questDiff} 
        questType={questType} 
        timeLimit={timeLimit}
        onSubmit={onSubmit}
      />
    </div>
  );
};
