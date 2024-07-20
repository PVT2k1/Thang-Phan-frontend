import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencyList, setCurrencyList] = useState({});
  const [convertedAmount, setConvertedAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function GetCurrencyList() {
      const res = await fetch(
        'https://api.frankfurter.app/currencies'
      );
      const data = await res.json();
      setCurrencyList(data);
    }

    GetCurrencyList();
  }, [])

  async function Convert() {
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    );
    const data = await res.json();
    if (!data.rates)
      setErrorMessage(data.message);
    else
      setConvertedAmount(data.rates[toCurrency]);
  }
  
  useEffect(() => {
    if (amount === '' || amount === '0')
      return setConvertedAmount('');

    if (fromCurrency === toCurrency)
      setConvertedAmount(amount);
    else
      Convert();
  }, [fromCurrency, toCurrency])

  function TestInput(input) {
    const regex = /^[0-9.]+$/;
    return regex.test(input);
  }

  function ChangeInput(e) {
    if (e.target.value !== '' && !TestInput(e.target.value))
      setErrorMessage('Wrong Input Format');
    else if (errorMessage !== '')
      setErrorMessage('');

    setAmount(e.target.value);
    if (convertedAmount !== '')
      setConvertedAmount('');
  }

  return (
    <div className='currency-converter'>
      <div>
        <h2 style={{color: 'rgb(63,72,143)'}}>Currency Swap Form</h2>

        <label style={{marginRight: '8px'}}>Amout to send:</label>
        <input
          type='text'
          value={amount}
          placeholder={fromCurrency}
          className= {errorMessage !== '' ? 'error' : ''}
          onChange={(e) => ChangeInput(e)}
        />

        <label style={{marginLeft: '8px', marginRight: '8px'}}>from</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {Object.keys(currencyList).map((currency) => (
            <option value={currency} key={currency}>{currency} - {currencyList[currency]}</option>
          ))}
        </select>

        <label style={{marginLeft: '8px', marginRight: '8px'}}>to</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {Object.keys(currencyList).map((currency) => (
            <option value={currency} key={currency}>{currency} - {currencyList[currency]}</option>
          ))}
        </select>

        <button style={{marginLeft: '8px'}} onClick={Convert}>CONFIRM SWAP</button>
      </div>
      <div>
        {convertedAmount !== '' && <p>Amount to receive: {convertedAmount} {toCurrency}</p>}
        {errorMessage !== '' && <p style={{color: '#d82b2b'}}>{errorMessage}</p>}
      </div>
    </div>
  )
}

export default App;
