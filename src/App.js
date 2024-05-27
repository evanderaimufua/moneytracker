import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }
  //handles new transactions and sends to the backend
  function handleNewTransaction(event) {
    event.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ number, name, description, dateTime }),
    }).then((response) => {
      response.json().then((json) => {
        setNumber("");
        setName("");
        setDateTime("");
        setDescription("");
        console.log("result", json);
      });
    });
  }
  // Format the date and time to show day, month, year, hours, and minutes
  function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} ${formattedTime}`;
  }

  //calculating the overall balance
  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.number;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split(".")[1];
  balance = balance.split(".")[0];

  return (
    <main>
      <div className="price-container">
        <h1>
          ${balance}
          <span>.{fraction}</span>
        </h1>
      </div>
      <form onSubmit={handleNewTransaction}>
        <div className="input-container">
          <input
            type="text"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder={"+/- Price"}
          />
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={"Name"}
          />
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
          />
        </div>
        <div className="description-box">
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={"Description"}
          />
        </div>
        <button type="submit"> Add New Transaction</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction-container">
              <div className="transactions-container-left">
                <div className="item-name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="transactions-container-right">
                <div
                  className={
                    "price " + (transaction.number < 0 ? "red" : "green")
                  }
                >
                  {transaction.number}
                </div>
                <div className="datetime">
                  {formatDateTime(transaction.dateTime)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
