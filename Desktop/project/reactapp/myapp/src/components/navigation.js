import { BrowserRouter,Routes, Route } from "react-router-dom"
import LoginForm from "./prelogin";
import RegistrationForm from "./postlogin";

const Navigates = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm/>} />
        <Route path="/Login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Navigates;
