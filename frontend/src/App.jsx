import { useEffect } from 'react'

import Navbar from "./components/Navbar.jsx";

import { Navigate, Route,Routes} from 'react-router-dom';

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx"
import SettingsPage from "./pages/SettingsPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"

import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';

import { Toaster } from 'react-hot-toast';

import daisyui from "daisyui";




const App = () => {
  const {authUser, checkAuth , isCheckingAuth , onlineUsers }  = useAuthStore();
  const { theme } = useThemeStore(); // Get the authenticated user -> defined in store/useAuthStore.js
  
// console.log(onlineUsers);

  //this checks the user authentication before rendering the app / routes
  useEffect(() => {
    checkAuth(); // Check if user is authenticated on app load
  }, [checkAuth]); // checkAuth on app load  

  //show loading animation while checking authentication
  if(isCheckingAuth && !authUser) {
    return(
      <div className='flex items-center justify-center h-screen'>
        <span className="loading loading-bars loading-xl"></span>
      </div>
    )}

    //show app if user is authenticated
  return (
    <div data-theme={theme}>
        <Navbar />

        <Routes>
          <Route path='/' element= { authUser ? <HomePage /> : <Navigate to="/login"/>} />  {/* it checks if the user exsists then forword to home page -> else redirect them to login page */}
          <Route path='/signup' element= { !authUser ? <SignUpPage /> : <Navigate to="/" />} />  {/* it checks if the user does not exsist then forword to signup page -> else redirect them to home page */}
          <Route path='/login' element= {  !authUser ? <LoginPage /> :  <Navigate to="/" />} />
          <Route path='/settings' element= {<SettingsPage />} />
          <Route path='/profile' element= { authUser ? <ProfilePage /> : <Navigate to="/login"/> } />
        </Routes>

        <Toaster />
    </div>
  )
}


export default App

