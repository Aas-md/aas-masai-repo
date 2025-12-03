import { useState, useEffect, useRef } from "react";

// --------------------------
// 🔥 Custom Hook: useTimer
// --------------------------
function useTimer() {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);   // interval ko track karne ke liye

  // Start timer
  function startTimer() {
    if (isRunning) return;            // already running → dobara mat chalao
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  }

  // Stop timer
  function stopTimer() {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }

  // Reset timer
  function resetTimer() {
    setTimer(0);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }

  // Cleanup (component unmount)
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { timer, isRunning, startTimer, stopTimer, resetTimer };
}

// --------------------------
// 🔥 Component using custom hook
// --------------------------
export default function App() {
  const { timer, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  return (
    <div style={{ padding: "20px"}}>
      <h2>useTimer Custom Hook</h2>
      
      <h1>{timer} sec</h1>
      <p>Status: {isRunning ? "Running" : "Stopped"}</p>

      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer} style={{ marginLeft: "10px" }}>Stop</button>
      <button onClick={resetTimer} style={{ marginLeft: "10px" }}>Reset</button>
    </div>
  );
}
