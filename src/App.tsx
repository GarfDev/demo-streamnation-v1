import React from 'react';
import usePlayerDuo from './hooks/usePlayerDuo';
import Donation from './modules/donation';
// import './App.css'

const App: React.FC = () => {
  const {} = usePlayerDuo();

  return (
    <div id="App">
      <Donation />
    </div>
  );
};

export default App;
