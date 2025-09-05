import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./banking-app/Home";
import Register from "./banking-app/Register";
import Login from "./banking-app/Login";
import Dashboard from "./banking-app/Dashboard";
import CardInformation from "./banking-app/CardInformation";
import Services from "./banking-app/Services";
import AboutUs from "./banking-app/About";
import PrivateRoute from "./banking-app/PrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />}></Route>
        <Route exact path="/login" element={<Login />} />
        <Route
          exact
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route exact path="/cardInformation" element={<CardInformation />} />
        <Route exact path="/services" element={<Services />} />
        <Route exact path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
