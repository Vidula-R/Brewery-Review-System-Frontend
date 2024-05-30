import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 

import LoginPage from './LoginPage';
import SearchPage from './SearchPage';
import BreweryList from './BreweryList'; 
import SignupPage from './signup';
import SubmitRating from './SubmitRating';

function App() {
  return (
    <Router>
      <Routes> {}
        <Route path="/" element={<LoginPage />} /> {}
        <Route path="/search" element={<SearchPage />} /> {}
        <Route path="/brewery" element={<BreweryList />} /> {}
        <Route path="/signup" element={<SignupPage />} /> {}
        <Route path="/brewery/submit-review" element={<SubmitRating />} /> {}

        <Route path="/brewery/:breweryId/submit-review" element={<SubmitRating />} />
        
      </Routes>
    </Router>
  );
}

export default App;
