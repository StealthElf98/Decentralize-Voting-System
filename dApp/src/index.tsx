import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes/Routes';
// import Navbar from './Pages/Navbar/Navbar';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
      {/* <Navbar/> */}
      <RouterProvider router={router} />
  </React.StrictMode>
);