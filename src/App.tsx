import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from 'screens/index';
import { initLogging } from 'utils/logger';

function App() {
  useEffect(() => {
    initLogging();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
