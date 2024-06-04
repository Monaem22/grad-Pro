import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import Notfound from './Components/Notfound/Notfound';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Projects from './Components/Projects/Projects';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContextProvider from './Context/userContext';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import ProjectDetails from './Components/ProjectDetails/ProjectDetails';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import VerifyEmail from './Components/VerifyEmail/VerifyEmail';
import MyAccount from './Components/MyAccount/MyAccount';
import { Toaster } from 'react-hot-toast';
import MyWishlist from './Components/MyWishlist/MyWishlist';
import Comments from './Components/Comments/Comments';
import MyProjects from './Components/MyProjects/MyProjects';
import Help from './Components/Help/Help';
import Users from './Components/Users/Users';
import AddUser from './Components/AddUser/AddUser';
import PendingProjects from './Components/PendingProjects/PendingProjects';
import SystemActions from './Components/SystemActions/SystemActions';
import UserProfile from './Components/UserProfile/UserProfile';

const routers = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'forget-password', element: <ForgetPassword /> },
      { path: 'verify-password', element: <VerifyEmail /> },
      { path: 'ResetPassword', element: <ResetPassword /> },
      { path: 'register', element: <Register /> },
      { path: 'projects', element: <Projects /> },
      { path: 'Users', element: <Users /> },
      { path: 'AddUser', element: <AddUser /> },
      { path: 'PendingProjects', element: <PendingProjects /> },
      { path: 'SystemActions', element: <SystemActions /> },
      { path: 'user/:activepage', element: <ProtectedRoute><MyAccount /></ProtectedRoute> },
      { path: 'projectdetails/:id', element: <ProtectedRoute><ProjectDetails /></ProtectedRoute> },
      { path: 'MyWishlist', element: <ProtectedRoute><MyWishlist /></ProtectedRoute> },
      { path: 'Help', element: <ProtectedRoute><Help /></ProtectedRoute> },
      { path: 'MyProjects', element: <ProtectedRoute><MyProjects /></ProtectedRoute> },
      { path: 'Comments', element: <ProtectedRoute><Comments /></ProtectedRoute> },
      { path: 'projectdetails/:id/UserProfile/:id', element: <ProtectedRoute><UserProfile /></ProtectedRoute> },
      { path: '*', element: <Notfound /> },
    ],
  },
]);

function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={routers} />
      <Toaster />
    </UserContextProvider>
  );
}

export default App;
