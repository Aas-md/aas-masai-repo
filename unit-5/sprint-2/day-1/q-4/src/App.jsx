import { useEffect, useState, useRef } from "react";

export default function App() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const audioRef = useRef(
    new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3")
  );

  useEffect(() => {
    let interval = null;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup
    return () => clearInterval(interval);
  }, [running]);

  // Play sound when it reaches 10 seconds
  useEffect(() => {
    if (seconds === 10) {
      audioRef.current.play(); // sound
      // console.log("Reached 10 seconds!"); // backup
    }
  }, [seconds]);

  const start = () => setRunning(true);
  const stop = () => setRunning(false);
  const reset = () => {
    setSeconds(0);
    setRunning(false);
  };

  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
        fontFamily: "Arial",
      }}
    >
      <h1>Stopwatch</h1>

      <div
        style={{
          fontSize: "40px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        {seconds} s
      </div>

      <button
        onClick={start}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        Start
      </button>

      <button
        onClick={stop}
        style={{
          padding: "10px 20px",
          marginRight: "10px",
          cursor: "pointer",
        }}
      >
        Stop
      </button>

      <button
        onClick={reset}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}
