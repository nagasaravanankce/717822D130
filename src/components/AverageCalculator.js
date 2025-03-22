import React, { useState } from 'react';

const API_BASE = "http://20.244.56.144/test/";
const WINDOW_SIZE = 10;


const BEARER_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNjI3NzAzLCJpYXQiOjE3NDI2Mjc0MDMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjEzN2EzYzNkLTQwYjctNGE5MS04Zjc1LWU4MjY1MGQ4NjI1OCIsInN1YiI6IjcxNzgyMmQxMzBAa2NlLmFjLmluIn0sImNvbXBhbnlOYW1lIjoiSW5zdGFncmFtIiwiY2xpZW50SUQiOiIxMzdhM2MzZC00MGI3LTRhOTEtOGY3NS1lODI2NTBkODYyNTgiLCJjbGllbnRTZWNyZXQiOiJheHhHZmhHZlBJU1RRR1JGIiwib3duZXJOYW1lIjoiTi5OQUdBU0FSQVZBTkFOIiwib3duZXJFbWFpbCI6IjcxNzgyMmQxMzBAa2NlLmFjLmluIiwicm9sbE5vIjoiNzE3ODIyRDEzMCJ9.BlaNA6uDcIERMFrp4STtwVu7RyYvyEpXFfKhWsDo9b8";

const AverageCalculator = () => {
  const [window, setWindow] = useState([]);
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async (type) => {
    setLoading(true);
    setWindowPrevState([...window]);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 500);

      const response = await fetch(`${API_BASE}${type}`, {
        method: 'GET',
        headers: {
          'Authorization': BEARER_TOKEN
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const nums = data.numbers || [];

      const uniqueNums = nums.filter(n => !window.includes(n));

      let newWindow = [...window, ...uniqueNums];
      if (newWindow.length > WINDOW_SIZE) {
        newWindow = newWindow.slice(newWindow.length - WINDOW_SIZE);
      }

      const avg = newWindow.reduce((acc, curr) => acc + curr, 0) / newWindow.length;

      setFetchedNumbers(nums);
      setWindow(newWindow);
      setAverage(avg.toFixed(2));
    } catch (err) {
      console.log('Request failed or timed out:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-container">
      <div className="buttons">
        <button onClick={() => fetchNumbers('primes')} disabled={loading}>Fetch Primes (p)</button>
        <button onClick={() => fetchNumbers('fibo')} disabled={loading}>Fetch Fibonacci (f)</button>
        <button onClick={() => fetchNumbers('rand')} disabled={loading}>Fetch Evens (e)</button>
        <button onClick={() => fetchNumbers('r')} disabled={loading}>Fetch Random (r)</button>
      </div>

      <div className="results">
        <h3>Window Previous State: {JSON.stringify(windowPrevState)}</h3>
        <h3>Fetched Numbers: {JSON.stringify(fetchedNumbers)}</h3>
        <h3>Window Current State: {JSON.stringify(window)}</h3>
        <h3>Average: {average}</h3>
      </div>
    </div>
  );
}

export default AverageCalculator;
