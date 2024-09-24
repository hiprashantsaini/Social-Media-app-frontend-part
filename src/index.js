import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import CreatePost from './components/createPost/CreatePost';
import Home from './components/Home';
import Login from './components/loginUser/Login';
import NotFound from './components/NotFound';
import Profile from './components/profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Signup from './components/signUp/Signup';
import Subscription from './components/subscriptionPlan/Subscription';
import { CLIENT_ID } from './config';
import ContextProvider from './context/AppContext';
import './index.css';
import reportWebVitals from './reportWebVitals';

const appRoutes = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: 'home',
        element: <Home/>
      },

      {
        path: 'subscription',
        element: <Subscription />
      },
      {
        path:'createpost',
        element:<CreatePost/>
      },
      {
        path:'profile',
        element:<Profile/>
      }
    ]
  },

  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
  ,
  {
    path: '*',
    element: <NotFound />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // </React.StrictMode>//// Rendering two times but important to use for production

  <ContextProvider>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <RouterProvider router={appRoutes} />
    </GoogleOAuthProvider>
  </ContextProvider>

);

reportWebVitals();
