import React from 'react';
import { Route, Routes } from 'react-router';

import Donation from './modules/donation';
import Notification from './modules/notification';
// import './App.css'

const App: React.FC = () => {
  return (
    <div id="App">
      <Routes>
        <Route path="/donation" element={<Donation />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </div>
  );
};

export default App;
