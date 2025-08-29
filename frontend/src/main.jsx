// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'

// import App from './App.jsx'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Login from './pages/Login.jsx';
// const router = createBrowserRouter([
//   {
//     path: "/", element: <App/>,
//     children:[
//       {
//         path: "/Login", element: <Login/>
//       }
//     ]
//   }
// ])

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     
//     <RouterProvider router={router}/>
      
    
//   </StrictMode>,
// )

import React from 'react';
import { createRoot } from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
// import { Toaster } from 'react-hot-toast';


// import App from './App';
// import Login from './pages/Login';
// import AddStudent from './components/AddStudent';
// import Dashboard from './components/Dashboard';
// import ViewStudent from './components/ViewStudent';
// import Logout from './components/Logout';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './hooks/useUser';

// const router = createBrowserRouter([
//   {
//     path: '/login',
//     element: <Login />  // No Sidebar here
//   },
//   {
//     path: '/',
//     element: <App />, // This contains Sidebar + Outlet
//     children: [
//       { path: 'Add-Student', element: <AddStudent /> },
//       { path: 'dashboard', element: <Dashboard /> },
//       { path: 'view-student', element: <ViewStudent /> },
//       { path: 'logout', element: <Logout /> }
//     ]
//   }
// ]);

import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import AddStudent from './components/AddStudent.jsx';
import ViewStudent from './components/ViewStudent.jsx';
import Attendance from './components/Attendance.jsx';
import AbsentStudentsList from './components/AbsentStudentsList.jsx';
import Bills from './components/Bills.jsx';



const router = createBrowserRouter([
  {
    path: "/", element: <App/>,
    children:[
      
        { path: '/login', 
          element: <Login /> },
        { path: '/Add-Student', 
          element: <AddStudent /> },

        { path: '/dashboard', 
          element: <Dashboard /> },
         { path: '/view-student', 
          element: <ViewStudent /> },
          { path: '/attendance', 
          element: <Attendance /> },
          { path: '/absent-students', 
          element: <AbsentStudentsList /> },
          { path: '/bills', 
          element: <Bills /> }

    ]
  
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>

    <Toaster />
    <RouterProvider router={router} />
    </UserProvider>

  </React.StrictMode>
);
