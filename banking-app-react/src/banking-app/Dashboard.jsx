import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

function Dashboard() {
  const location = useLocation();
  const { user, jwt, emailLogin, passwordLogin } = location.state || {};

  const [sender, setSender] = useState(user);
  const [isChecked, setIsChecked] = useState(false);
  const sendOverlayRef = useRef(null);
  const withdrawdOverlayRef = useRef(null);
  const [accountNumber, setAccountNumber] = useState(null);
  const [cardNumber, setCardNumber] = useState(null);
  const [expirationD, setExpirationD] = useState(null);
  const [cardVerificationValue, setCardVerificationValue] = useState(null);
  const [amount, setAmount] = useState();
  const [Id, setId] = useState(user.id);
  const [newBalance, setNewBalance] = useState(null);
  const amountRef = useRef(null);
  const dateRef = useRef(null);
  const [userInfo, setUserInfo] = useState({});
  const sentMoneyMessageRef = useRef(null);
  const withdrawMoneyMessageRef = useRef(null);
  const depositMoneyMessageRef = useRef(null);
  const tokenValidationRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [deletingId, setDeletingId] = useState(null);
  const depositOverlayRef = useRef(null);
  let navigate = useNavigate();

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(`transactions_${Id}`);
    return saved ? JSON.parse(saved) : [];
  });

  //This method is to get the new balance to show it on the user profile
  const getNewBalance = async () => {
    const basesUrl = "http://localhost:8080/banking/findByAccountNumber";

    const requestResult = await axios.get(`${basesUrl}/${user.accountNumber}
    `);

    const newUserBalance = requestResult.data;

    setNewBalance(newUserBalance.balance);
  };

  useEffect(() => {
    getNewBalance();

    if (tokenValidationRef.current) {
      tokenValidationRef.current.style.display = "block";

      document.body.style.overflow = "hidden";
    }
    setTimeout(() => {
      if (tokenValidationRef.current) {
        tokenValidationRef.current.style.display = "none";

        document.body.style.overflow = "scroll";
      }
    }, 2000);
  }, []);

  //Find a user to send them the money
  const findUserByAccountNumber = async (e) => {
    e.preventDefault();

    const basesUrl = "http://localhost:8080/banking/findByAccountNumber";

    const requestResult = await axios.get(`${basesUrl}/${accountNumber}`);

    if (requestResult.data === "User not found") {
      alert("User not found, please verify the account number");
    } else {
      const usuario = requestResult.data;
      setUserInfo(requestResult.data);
      console.log(requestResult.data);
    }
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const displaySendOverlay = () => {
    if (sendOverlayRef.current) {
      sendOverlayRef.current.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

  const displayWithdrawOverlay = () => {
    if (withdrawdOverlayRef.current) {
      withdrawdOverlayRef.current.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };

  const displayDipositOverlay = () => {
    if (depositOverlayRef.current) {
      depositOverlayRef.current.style.display = "block";
      document.body.style.overflow = "hidden";
    }
  };
  /*This function is to display the screen that is going to show when the 
  user clicks the send money button
*/
  const closeSendOverlay = () => {
    if (sendOverlayRef.current) {
      window.location.reload();
      sendOverlayRef.current.style.display = "none";
      document.body.style.overflow = "scroll";
    }
    window.location.reload();
  };

  const closeDepositOverlay = () => {
    window.location.reload();
    if (depositOverlayRef.current) {
      depositOverlayRef.current.style.display = "none";
      document.body.style.overflow = "scroll";
    }
    window.location.reload();
  };

  const closeWithdrawOverlay = () => {
    window.location.reload();
    if (withdrawdOverlayRef.current) {
      withdrawdOverlayRef.current.style.display = "none";
      document.body.style.overflow = "scroll";
    }
    window.location.reload();
  };

  //close the confirm pasword element
  const closeConfirmPassword = () => {
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.style.display = "none";
      document.body.style.overflow = "scroll";
    }
    window.location.reload();
  };

  const deleteTransaction = (idToDelete) => {
    const updatedTransactions = transactions.filter(
      (tx) => tx.id !== idToDelete
    );
    setTransactions(updatedTransactions);
    localStorage.setItem(
      `transactions_${Id}`,
      JSON.stringify(updatedTransactions)
    );
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    const basesUrl = "http://localhost:8080/banking/sendMoney";
    setIsChecked(false);
    const amountWithoutSeparator = amount.replace(/,/g, "");

    try {
      const requestResult = await axios.patch(
        `${basesUrl}/${accountNumber}/${amountWithoutSeparator}/${Id}`
      );

      if (
        requestResult.data ===
        "You are sending money to your same account: please choose the deposit option"
      ) {
        alert(
          "You are sending money to your same account: please choose the deposit option"
        );
        return;
      } else if (requestResult.data === "Account number invalid") {
        alert("Account number invalid");
        return;
      } else if (requestResult.data === "Insufficient balance") {
        alert("Insufficient balance");
        return;
      } else {
        const newTransaction = {
          id: crypto.randomUUID(),
          transactionType: "Send",
          transactionAmount: amount,
          transactionDate: new Date().toLocaleString(),
        };

        const updatedTransactions = [...transactions, newTransaction];

        setTransactions(updatedTransactions);
        localStorage.setItem(
          `transactions_${Id}`,
          JSON.stringify(updatedTransactions)
        );

        console.log("Transacción realizada:", requestResult.data);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

      if (sentMoneyMessageRef.current) {
        sentMoneyMessageRef.current.style.display =
          sentMoneyMessageRef.current.style.display = "none" ? "block" : "none";
      }
    } catch (error) {
      console.error("Error al enviar dinero:", error);
    }
  };

  //Function to handle the withdrawal transaction
  const handleWithdrawMoney = async (e) => {
    e.preventDefault();
    const basesUrl = "http://localhost:8080/banking/withdrawFunds";
    setIsChecked(false);
    const amountWithoutSeparator = amount.replace(/,/g, "");

    try {
      const requestResult = await axios.patch(
        `${basesUrl}/${user.cardNumber}/${amountWithoutSeparator}/${Id}`
      );

      if (requestResult.data === "Insufficient balance") {
        alert("Insufficient balance");
        return;
      } else if (
        requestResult.data ===
        "You don't have a card register to withdraw your funds"
      ) {
        alert("You don't have a card register to withdraw your funds");
        return;
      } else {
        const newTransaction = {
          id: crypto.randomUUID(),
          transactionType: "Withdraw",
          transactionAmount: amount,
          transactionDate: new Date().toLocaleString(),
        };

        const updatedTransactions = [...transactions, newTransaction];

        setTransactions(updatedTransactions);
        localStorage.setItem(
          `transactions_${Id}`,
          JSON.stringify(updatedTransactions)
        );

        console.log(requestResult.data);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }

      if (withdrawMoneyMessageRef.current) {
        withdrawMoneyMessageRef.current.style.display =
          withdrawMoneyMessageRef.current.style.display = "none"
            ? "block"
            : "none";
      }
    } catch (error) {
      console.log("Error while withdrawing money");
    }
  };

  //function to handle the change of the expiration date input
  const handleExpirationInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Just number
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 6);
    }
    setExpirationD(value);
  };

  //function to handle the change of the card number input
  const handleCardNumberInputChange = (e) => {
    //Allow the card number input to accept only numbers
    let value = e.target.value.replace(/\D/g, "");

    //Limit the card number input to only 16 dígits
    value = value.slice(0, 16);

    //Insert a dash after evey 4 dígits
    value = value.replace(/(\d{4})(?=\d)/g, "$1-");

    setCardNumber(value);
  };

  const manejarCambio = (e) => {
    let input = e.target.value;

    // 1️⃣ Eliminar todo lo que no sea número
    input = input.replace(/\D/g, "");

    // 2️⃣ Agregar separador de miles (usando comas, cambia a "." si quieres)
    input = input.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    setAmount(input);
  };

  //Function to handle the deposit money transaction
  const handleDepositMoney = async (e) => {
    e.preventDefault();

    const [month, year] = expirationD.split("/");
    const basesUrl = "http://localhost:8080/banking/depositFunds";
    //this gets the card numbers without the dashes to it send to the DB
    const cardNumberWithoutDashes = cardNumber.replace(/-/g, "");
    const amountWithoutSeparator = amount.replace(/,/g, "");

    try {
      const requestResult = await axios.patch(
        `${basesUrl}/${cardNumberWithoutDashes}/${month}/${year}/${cardVerificationValue}/${amountWithoutSeparator}/${Id}`
      );

      setIsChecked(false);

      if (requestResult.data === "Card information is invalid") {
        alert("Card information is invalid");
      } else if (requestResult.data === "Insufficient balance") {
        alert("Insufficient balance");
      } else {
        const newTransaction = {
          id: crypto.randomUUID(),
          transactionType: "Deposit",
          transactionAmount: amount,
          transactionDate: new Date().toLocaleString(),
        };

        const updatedTransactions = [...transactions, newTransaction];

        setTransactions(updatedTransactions);
        localStorage.setItem(
          `transactions_${Id}`,
          JSON.stringify(updatedTransactions)
        );

        console.log("Transacción realizada:", requestResult.data);

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        if (depositMoneyMessageRef.current) {
          depositMoneyMessageRef.current.style.display =
            depositMoneyMessageRef.current.style.display = "none"
              ? "block"
              : "none";
        }
      }
    } catch (error) {
      console.error("Error al enviar dinero:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(jwt);
    sessionStorage.clear();
    window.location.href = "/login";
    window.history.replaceState(null, "", "/login");

    if (tokenValidationRef.current) {
      tokenValidationRef.current.style.display = "block";

      document.body.style.overflow = "hidden";
    }
    setTimeout(() => {
      if (tokenValidationRef.current) {
        tokenValidationRef.current.style.display = "none";

        document.body.style.overflow = "hidden";
      }
    }, 1000);
  };

  const displayTokenValidation = () => {
    if (jwt) {
      if (tokenValidationRef.current) {
        tokenValidationRef.current.style.display =
          tokenValidationRef.current.style.display === "none"
            ? "block"
            : "none";
        document.body.style.overflow = "hidden";
      }

      setTimeout(function () {
        navigate("/cardInformation", { state: { user, jwt, passwordLogin } });
        document.body.style.overflow = "scroll";
      }, 1000);
    }
  };

  return (
    <div class="dashboar-container">
      <div
        className="token-validation"
        style={{ display: "none" }}
        ref={tokenValidationRef}
      >
        <div className="spin"></div>
      </div>

      <div
        className="password-confirmation-cotaier"
        style={{ display: "none" }}
        ref={confirmPasswordRef}
      >
        <form className="password-confirmation">
          <span
            className="close-enter-password-btn"
            onClick={closeConfirmPassword}
          >
            &times;
          </span>
          <label className="password-confirmation-label">
            Enter your password
          </label>
          <input type="password" className="password-confirmation-input" />

          <button className="password-confirmation-submit btn text-light">
            Submit
          </button>
        </form>
      </div>

      {/*Send money overlay container*/}
      <div
        className="send-overlay"
        ref={sendOverlayRef}
        style={{ display: "none" }}
      >
        <div
          className="send-money-message bg-light"
          ref={sentMoneyMessageRef}
          style={{ display: "none" }}
        >
          <p className="send-money-message-title text-center">
            Money sent successfully{" "}
            <i class="fa-solid fa-check send-money-message-check fs-3"></i>
          </p>
        </div>

        <button className="close-btn" onClick={closeSendOverlay}>
          &times;
        </button>
        <div className="send-overlay-content-container bg-light">
          <h2 className="send-overlay-title text-center">Send money</h2>

          <form
            className="send-money-form"
            onSubmit={(e) => handleSendMoney(e)}
          >
            <label className="send-money-label fs-5">Product Number</label>
            <input
              className="send-money-input mb-3"
              placeholder="Account #"
              name="Account"
              required
              maxLength={9}
              value={accountNumber}
              onChange={(e) =>
                setAccountNumber(e.target.value.replace(/\D/g, ""))
              }
            />
            <label className="send-money-label fs-5">Amount</label>
            <input
              className="send-money-input mb-4"
              placeholder="$$"
              required
              maxLength={6}
              value={amount}
              onChange={manejarCambio}
            />
            <br></br>
            <span
              className="btn bg-primary text-light find-user-btn mb-3"
              onClick={findUserByAccountNumber}
            >
              Find user
            </span>
            <br></br>
            <label className="send-money-label fs-5 mb-3">
              User: {userInfo.fName} {userInfo.lName}
            </label>
            <input
              type="checkbox"
              className="send-money-confirm-btn"
              id="send-check-btn"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />{" "}
            <label className="mb-3 confirm-label" for="send-check-btn">
              Confirm transaction
            </label>
            <br></br>
            <button
              type="submit"
              disabled={!isChecked}
              className="btn bg-success text-light send-form-btn mb-3"
            >
              Send
            </button>
            <br></br>
          </form>
        </div>
      </div>

      {/*Withdraw money overlay ontainer*/}
      <div
        className="width-overlay"
        ref={withdrawdOverlayRef}
        style={{ display: "none" }}
      >
        <div
          className="withdraw-money-message bg-light"
          style={{ display: "none" }}
          ref={withdrawMoneyMessageRef}
        >
          <p className="withdraw-money-message-title text-center">
            Wthdrawal successfully{" "}
            <i class="fa-solid fa-check send-money-message-check fs-3"></i>
          </p>
        </div>

        <button
          className="close-width-overlay-btn"
          onClick={closeWithdrawOverlay}
        >
          &times;
        </button>
        <div className="withdraw-overlay-content-container bg-light">
          <h2 className="withdraw-overlay-title text-center">Withdraw funds</h2>

          <form
            className="withdraw-money-form"
            onSubmit={(e) => handleWithdrawMoney(e)}
          >
            <label className="send-money-label fs-5">
              To card ************{user.cardNumber.slice(12, 16)}
            </label>
            <br></br>
            <label className="send-money-label fs-5">Amount</label>
            <input
              className="send-money-input mb-4"
              placeholder="$$"
              required
              maxLength={6}
              value={amount}
              onChange={manejarCambio}
            />
            <br></br>
            <input
              type="checkbox"
              className="send-money-confirm-btn"
              id="send-check-btn"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />{" "}
            <label className="mb-3 confirm-label" for="send-check-btn">
              Confirm transaction
            </label>
            <br></br>
            <button
              type="submit"
              disabled={!isChecked}
              className="btn bg-success text-light send-form-btn mb-3"
            >
              Send
            </button>
            <br></br>
          </form>
        </div>
      </div>

      {/*Deposit money overlay ontainer*/}
      <div
        className="deposit-overlay"
        ref={depositOverlayRef}
        style={{ display: "none" }}
      >
        <div
          className="send-money-message bg-light"
          ref={depositMoneyMessageRef}
          style={{ display: "none" }}
        >
          <p className="send-money-message-title text-center">
            Deposit successfully{" "}
            <i class="fa-solid fa-check send-money-message-check fs-3"></i>
          </p>
        </div>

        <button className="close-btn" onClick={closeDepositOverlay}>
          &times;
        </button>
        <div className="send-overlay-content-container bg-light">
          <h2 className="send-overlay-title text-center">Deposit money</h2>

          <form className="deposit-money-form" onSubmit={handleDepositMoney}>
            <label className="send-money-label fs-5">Card number</label>
            <input
              className="send-money-input"
              placeholder="xxx-xxxx-xxxx-xxxx"
              required
              maxLength="19"
              value={cardNumber}
              onChange={handleCardNumberInputChange}
            />
            <label className="deposit-expiration-label">Exp</label>
            <br></br>
            <input
              className=" deposit-expiration-input"
              type="text"
              id="exp"
              name="exp"
              placeholder="MM/YY"
              maxlength="7"
              required
              value={expirationD}
              onChange={handleExpirationInputChange}
            />{" "}
            <br></br>
            <label className="deposit-cvv-label">Cvv</label>
            <br></br>
            <input
              className="deposit-cvv-input"
              placeholder="cvv"
              maxLength={3}
              required
              value={cardVerificationValue}
              onChange={(e) =>
                setCardVerificationValue(e.target.value.replace(/\D/g, ""))
              }
            />
            <label className="send-money-label fs-5">Amount</label>
            <input
              className="send-money-amount-input"
              placeholder="$$"
              maxLength={6}
              required
              value={amount}
              onChange={manejarCambio}
            />
            <br></br>
            <input
              type="checkbox"
              className="send-money-confirm-btn"
              id="send-check-btn"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />{" "}
            <label className="mb-3 confirm-label" for="send-check-btn">
              Confirm transaction
            </label>
            <br></br>
            <button
              type="submit"
              disabled={!isChecked}
              className="btn bg-success text-light send-form-btn mb-3"
            >
              Deposit
            </button>
            <br></br>
          </form>
        </div>
      </div>

      <nav class="navbar dashboard-navbar">
        <div class="container-fluid">
          <a class="navbar-brand fs-1 text-light" href="#">
            AG-Bank
          </a>

          <span
            class="log-out-btn btn btn-lg text-light"
            onClick={handleLogout}
          >
            Logout
          </span>
        </div>
      </nav>

      <div class="dashboard-content-container">
        <div class="balance-container container">
          <div className="account-number-container">
            <p className="account-number-title">Account number</p>
            <p className="account-number">{sender.accountNumber}</p>

            <button class=" card-link" onClick={displayTokenValidation}>
              Card <i class="fa-solid fa-credit-card"></i>
            </button>
          </div>

          <div className="user-information">
            <i class="fa-solid fa-user fs-2"></i>{" "}
            <span>
              {user.fName} {user.lName}
            </span>
          </div>

          <div className="balance-details">
            <span className="balance-span">
              {" "}
              US{" "}
              <NumericFormat
                value={newBalance}
                displayType={"text"}
                thousandSeparator=","
                prefix="$"
              />
            </span>
            <p class="balance-title text-dark mb-3">Available balance</p>
          </div>

          <div className="transaction-btn-container">
            <span
              className="btn send-money-btn text-light bg-dark"
              onClick={displaySendOverlay}
            >
              Send
            </span>
            <span
              className="btn  withdraw-money-btn text-light bg-dark"
              onClick={displayWithdrawOverlay}
            >
              Withdraw
            </span>
            <span
              className="btn deposit-money-btn text-light bg-dark"
              onClick={displayDipositOverlay}
            >
              Deposit
            </span>
          </div>
        </div>
      </div>

      <div className="container dashboard-table-container">
        <h2 className="text-center movements-title">Transaction details</h2>
        <table class="table table-striped table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th scope="col">Type</th>
              <th scope="col">Ammount</th>
              <th scope="col">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id || index}>
                <td>{transaction.transactionType}</td>

                <td>
                  <NumericFormat
                    value={transaction.transactionAmount}
                    displayType={"text"}
                    thousandSeparator=","
                    prefix={"$"}
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </td>

                <td>{transaction.transactionDate}</td>
                <td>
                  <button
                    className="btn btn-md btn-danger"
                    onClick={() => deleteTransaction(transaction.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
}
export default Dashboard;
