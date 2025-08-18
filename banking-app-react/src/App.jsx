
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./banking-app/Home"
import Register from "./banking-app/Register"
import Login from "./banking-app/Login";
import Dashboard from "./banking-app/Dashboard";
import CardInformation from "./banking-app/CardInformation";
function App() {
  
  return (
   
     <BrowserRouter>

     <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/login" element={<Login />}/>
        <Route exact path="/dashboard" element={<Dashboard />}/>
        <Route exact path="/cardInformation" element={<CardInformation />}/>
     </Routes>
     
     </BrowserRouter>
      
    
  )
}

export default App
