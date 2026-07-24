import React from 'react'
import Health from "./Health"
import History from "./History"
import {Routes, Route} from "react-router"


function App() {
  return (
    <div>
     <Routes>
      <Route path="/" element={<Health/>}/>
      <Route path='/history' element={<History/>}/>
     </Routes>
    </div>
  )
}

export default App
