import React from 'react'
import Assistant from "./pages/Assistant"
import History from "./pages/History"
import {Routes, Route} from "react-router"
import LandingPage from './pages/LandingPage'
import Levels from "./pages/Levels"
import VocabPracticeRoom from './pages/PracticeRoom'
import Register from './pages/Register'
import Dashboard from "./pages/Dashboard"
import LoginPage from './pages/Login'
import Premium from './pages/Premium'
import Profile from  "./pages/Profile"


function App() {
  return (
    <div>
     <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/level' element={<Levels/>}/>
      <Route path='/room/:levelId' element={<VocabPracticeRoom/>}/>
      <Route path="/assistant" element={<Assistant/>}/>
      <Route path='/history' element={<History/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/premium' element={<Premium/>}/>
      <Route path='/profile' element={<Profile/>}/>
     </Routes>
    </div>
  )
}

export default App
