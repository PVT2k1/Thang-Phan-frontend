import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [currencyList, setCurrencyList] = useState({});
  const [convertedAmount, setConvertedAmount] = useState('');

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

  useEffect(() => {
    async function Convert() {
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );
      const data = await res.json();
      setConvertedAmount(data.rates[toCurrency]);
    }

    if (amount === '' || amount === '0')
      return setConvertedAmount('');

    if (fromCurrency === toCurrency)
      setConvertedAmount(amount);
    else
      Convert();
  }, [amount, fromCurrency, toCurrency])

  return (
    <div className='currency-converter'>
      <div>
        <input
          type='text'
          value={amount}
          placeholder={fromCurrency}
          onChange={(e) => setAmount(e.target.value)}
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
      </div>

      {convertedAmount !== '' && <p>{convertedAmount} {toCurrency}</p>}
    </div>
  )
}

export default App;
