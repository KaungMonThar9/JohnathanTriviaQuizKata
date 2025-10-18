import React from 'react';
import { Quiz } from './Components/Quiz/Quiz';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      <ToastContainer position='top-center' autoClose={3000} />
      <Quiz />
      <footer className='navbar bottom' style={{
        textAlign: 'left',
        marginTop: '40px',
        backgroundColor: '#f0f2f5',
        borderTop: '1px solid #333',
        fontFamily: 'poppins'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'end'
        }}>
          <div style={{ color: '#666', fontSize: '10px', margin: '0', padding: '0' }}>
            <p style={{ margin: '0', padding: '0' }}>Copyright © 2025 Johnathan Thar TakeHome Kata</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
