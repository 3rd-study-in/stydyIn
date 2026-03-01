//

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import AuthSystem from './shared/components/Auth/AuthSystem.jsx';
import ResetPasswordPage from './shared/components/Auth/ResetPasswordPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-bg font-sans antialiased">
        <main className="flex">
          {/* <Routes> */}
          {/* <Route path="/" element={<AuthSystem />} /> */}
          <ResetPasswordPage></ResetPasswordPage>
          {/* </Routes> */}
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;
