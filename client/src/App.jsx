import React from 'react'
import Dashboard from "./pages/Dashboard"
import History from "./pages/History"
import {Routes, Route} from "react-router"
import LandingPage from './pages/LandingPage'
import Levels from "./pages/Levels"
import VocabPracticeRoom from './pages/PracticeRoom'
import Register from './pages/Register'
import Dashhboard from "./pages/Dashhboard"


function App() {
  return (
    <div>
     <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/level' element={<Levels/>}/>
      <Route path='/room/:levelId' element={<VocabPracticeRoom/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path='/history' element={<History/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/dash' element={<Dashhboard/>}/>
     </Routes>
    </div>
  )
}

export default App
