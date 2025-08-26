import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // icons librery

function Login() {
  //variable to redirect the customer to another component
  let navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [badCredentials, setBadCredentials] = useState();
  const [showPassword, setShowPassword] = useState(false);

  //function to handle the user login
  const handleLogin = async (e) => {
    //prevent to place the parameters in the url
    e.preventDefault();

    try{
    const baseUrl = "http://localhost:8080/banking/login";
    const requestResult = await axios.post(
      `${baseUrl}/${emailLogin}/${passwordLogin}`
    );
    console.log(requestResult.data);
    
    const { user, jwt } = requestResult.data;
    localStorage.setItem("jwt", jwt);
    setUser(user);
    
    
    
      navigate("/dashboard", {
        state: { user, jwt, emailLogin, passwordLogin },
      });
    
}catch(error){
    if (error.response && error.response.status === 401) {
      setBadCredentials("Email or Password incorrect!");
    }
}
  };

  return (
    <div className="login-container">
      <div className="nav-container">
        <nav className="navbar navbar-expand-lg bg-dark">
          <div class="container-fluid">
            <a className="navbar-brand fs-1 text-light" href="#">
              AG-Bank
            </a>
            <button
              className="navbar-toggler text-light bg-light"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div
              class="collapse navbar-collapse menu-container"
              id="navbarSupportedContent"
            >
              <ul class="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
                <li class="nav-item">
                  <a
                    class="nav-link text-light fs-4"
                    aria-current="page"
                    href="/"
                  >
                    Home
                  </a>
                </li>
                <li class="nav-item">
                  <Link class="nav-link text-light fs-4" to="/services">
                    Services
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    class="nav-link text-light fs-4"
                    to="/about"
                    aria-expanded="false"
                  >
                    About us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="login-form-container container bg-light">
        <h2 className="text-center mb-5 login-form-title">Log in</h2>
        <p className="text-center bad-credentials">{badCredentials}</p>
        <form className="login-form" onSubmit={(e) => handleLogin(e)}>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email
            </label>
            <input
              type="email"
              class="form-control mb-4 fs-5"
              id="exampleInputEmail1"
              name="email"
              required
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value.trim())}
            />
          </div>
          <div class="mb-3 login-password-container">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <span
              class="show-password-icon "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
            <input
              type={showPassword ? "text" : "password"}
              class="form-control mb-4 fs-5 w-full p-2 pr-10 border rounded-lg"
              id="exampleInputPassword1"
              name="password"
              required
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value.trim())}
            />
          </div>

          <button
            type="submit"
            className="btn bg-dark text-light btn-lg login-submit-btn"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;
