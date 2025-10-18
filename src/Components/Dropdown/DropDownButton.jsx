import React, { useState } from 'react';
import './SelectionMenu.css';

export const DropDownButton = ({ optionsArray = [], onSelect, title }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option.name);
    if (onSelect) onSelect(option);
  };

  return (
    <div className='dropdown'>
      <button 
        type='button' 
        className='dropdown-button dropdown-toggle' 
        data-bs-toggle='dropdown' 
        aria-expanded='false'
      >
        {selected || title}
      </button>
      <ul className='dropdown-menu' id='dropdownMenu'>
        {optionsArray.map((option) => (
          <li key={option.name}>
            <button 
              className='dropdown-item' 
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
