import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { NumericFormat } from "react-number-format";

function CardInformation(){

  const location = useLocation();
  const {user, jwt, passwordLogin} = location.state || {};
  const [newCardBalance, setNewCardBalance] = useState(null);
  const [accountNumber, setAccountNumber] = useState(user.accountNumber);
  const cvvRef = useRef(null);
  const cvvEyeIcon = useRef(null);
  const loader = useRef(null);

  let navigate = useNavigate();

  const displayLoader = () =>{
     if(loader.current){
      loader.current.style.display = loader.current.style.display =       loader.current.style.display === "none" ? "block": "none";

        document.body.style.overflow = "hidden"; 
        setTimeout(
      
      function(){
        navigate("/dashboard", {state:{user, jwt, passwordLogin}});
        document.body.style.overflow = "scroll";
      }, 1000
      
      );
     }
  };
  
  //function to load the new card balance once the user makes a deposit
  const getNewBalance = async () => {
      const basesUrl = "http://localhost:8080/banking/findByAccountNumber";
      
      const requestResult = await axios.get(`${basesUrl}/${user.accountNumber}
      `);
  
      const newUserBalance = requestResult.data;
  
      setNewCardBalance(newUserBalance.cardBalance);
    }

    useEffect(()=>{
      
      getNewBalance();
    });

    const showCvv = () =>{
      if(cvvRef.current){
        const cvvCurrentContent = cvvRef.current.innerHTML;

        if(cvvEyeIcon.current.classList.contains("fa-eye-slash")){
           cvvEyeIcon.current.classList.remove("fa-eye-slash");
           cvvEyeIcon.current.classList.add("fa-eye");
        }else{
          cvvEyeIcon.current.classList.remove("fa-eye");
           cvvEyeIcon.current.classList.add("fa-eye-slash");
        }

        if(cvvCurrentContent.includes("cvv")){
          cvvRef.current.innerHTML = user.cardVerificationValue;
        }
        else{
          cvvRef.current.innerHTML = "cvv"
        }


      }
    }

    return(
      <>
        <div className="card-information-container">
         <div className="token-validation" style={{display: "none"}} ref={loader}><div className="spin"></div></div>
            
      <nav class="navbar card-information-navbar">
        <div class="container-fluid">
          <a class="navbar-brand fs-1 text-light" href="#">
            AG-Bank
          </a>
                     
            <button
              class="log-out-btn btn btn-lg text-light"
              onClick={displayLoader}
            >
              Dashboard
            </button>
         
        </div>
      </nav>

      
      <div className="card-info-container container">
        <h2 className="text-center card-info-title">Card details</h2>
        <i class="fa-solid fa-credit-card card-icon text-center"></i>
        
        
        <div className="card-number-container mt-5">
            <p className="card-number-title">Card number</p>
            <p className="card-number">{user.cardNumber}</p>
            <hr></hr>

            <div>
            <p className="card-expiration-title">Exp</p>
            <p className="card-expiration-date">{user.expirationMonth}/{user.expirationYear}</p>
            </div>

            <hr></hr>
            <div>
              <p className="cvv-title" ref={cvvRef}>cvv</p>
              <p className="cvv" onClick={showCvv}><i class="fa-solid fa-eye-slash" ref={cvvEyeIcon}></i></p>
            </div>
            
        </div>

        <div className="card-balance-container mt-5">
            <span className="card-balance">US <NumericFormat value={newCardBalance} displayType={"text"} thousandSeparator="," prefix="$"/>
            </span>
            <p className="card-balance-title">Available balance</p>
        </div>

        
        
      </div>
         
        </div>

       <Footer />
        </>
    );

}
export default CardInformation;