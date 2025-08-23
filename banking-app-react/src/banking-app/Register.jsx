import axios from "axios";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  let navigate = useNavigate();
  const [value, setValue] = useState("");
  const [blockCursor, setBlockCursor] = useState(false);
  const accountCreatedMessageRef = useRef(null);

  //ensures that the phone number input accept only number (0-9)
  const handlePhoneNumberInputChange = (e) => {
    
    const value = e.target.value;
    if (/^\d*$/.test(value)) {// just digits (0-9)
      
      setValue(value);
    }
    setUser({...user, [e.target.name]: e.target.value.trim()});
  };
    const [user, setUser] = useState({
        fName:"",
        lName:"",
        phone:"",
        email:"",
        password:""

    });

    const {fName, lName, phone, email, password} = user;

     const handleInputChange = (e)=>{
         setUser({...user, [e.target.name]: e.target.value.trim()});
     }

     
     const onSubmit = async (e)=>{
        e.preventDefault();
        const baseUrl = "http://localhost:8080/banking/saveNewUser";
        await axios.post(baseUrl, user);
        
        setBlockCursor(true);
        if(accountCreatedMessageRef.current){
         accountCreatedMessageRef.current.style.display = accountCreatedMessageRef.current.style.display = "none" ? "block" : "none";
      }
        setTimeout(()=>{
          navigate("/login");
          
        }, 3000);
        

     }

  return (
    <div className="register-container">
      <div className="nav-container">
        <nav className="navbar navbar-expand-lg bg-dark">
          <div class="container-fluid">
            <a className="navbar-brand fs-1 text-light" href="/">
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
                  <a
                    class="nav-link text-light fs-4"
                    href="/about"
                    aria-expanded="false"
                  >
                    About us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="crete-account-message bg-light" ref={accountCreatedMessageRef} style={{display: "none"}}><p className="crete-account-message-title text-center mt-3">Account successfully created</p></div>
      
      <div className="register-form-container container bg-light">
        <form onSubmit={(e)=> onSubmit(e)}>
          <h2 className="text-center mb-5 register-form-title">
            Create new account
          </h2>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              First Name
            </label>
            <input
              type="text"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              title="Just letters and white spaces"
              class="form-control mb-4 fs-5"
              id="exampleInputEmail1"
              value={fName}
              name="fName"
              onChange={(e)=> handleInputChange(e)}
              required
            />

            <label for="exampleInputEmail1" class="form-label">
              Last Name
            </label>
            <input
              type="text"
              pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
              title="Just letters and white spaces"
              class="form-control mb-4 fs-5"
              value={lName}
              name="lName"
              onChange={(e)=> handleInputChange(e)}
              required
            />

            <label for="exampleInputEmail1" class="form-label">
              Phone Number
            </label>
            <input
              type="text"
              class="form-control mb-4 fs-5"
              value={value}
              name="phone"
              onChange={(e)=>handlePhoneNumberInputChange(e)}
              minLength={10}
              maxLength={10}
              required
            />

            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control mb-4 fs-5"
              id="exampleInputEmail1"
              value={email}
              name="email"
              onChange={(e)=> handleInputChange(e)}
              required
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type="password"
              class="form-control mb-4 fs-5"
              id="exampleInputPassword1"
              value={password}
              name="password"
              onChange={(e)=> handleInputChange(e)}
              required
            />
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
              required="true"
            />
            <label class="form-check-label" for="exampleCheck1">
              Accept and continue
            </label>
          </div>
          <button
            type="submit"
            class="btn bg-dark text-light btn-lg register-submit-btn"
            disabled={blockCursor}
            style={{cursor: blockCursor}}
            
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default Register;
