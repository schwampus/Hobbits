import './App.css'
import ProtectedRoute from './components/ProtectedRoute';

import { BrowserRouter,  Routes, Route } from 'react-router-dom'
import Home from './routes/home'
import LogIn from './routes/login_Route'     
import SignUp from './routes/signup_Route'
import Dashboard from './routes/dashboard_Route'

function App() {
  return (
    <BrowserRouter> 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  </BrowserRouter>
  )
}
export default App