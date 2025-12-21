import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [meds, setMeds] = useState([]);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("medications"));
    if (data) setMeds(data);
  }, []);

  useEffect(() => {
    localStorage.setItem("medications", JSON.stringify(meds));
  }, [meds]);

  function addMedication() {
    if (!name || !dosage || !time) return;

    setMeds([
      ...meds,
      {
        id: Date.now(),
        name,
        dosage,
        time,
        status: "Pending",
        history: []
      }
    ]);

    setName("");
    setDosage("");
    setTime("");
  }

  function updateStatus(id, status) {
    setMeds(
      meds.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              history: [
                ...m.history,
                { date: new Date().toLocaleString(), status }
              ]
            }
          : m
      )
    );
  }

  return (
    <div className="container">
      <h1>Medication Management Tool</h1>

      <div className="form">
        <input
          placeholder="Medicine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Dosage"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <button onClick={addMedication}>Add</button>
      </div>

      <div className="cards">
        {meds.map((m) => (
          <div className="card" key={m.id}>
            <h3>{m.name}</h3>
            <p>Dosage: {m.dosage}</p>
            <p>Time: {m.time}</p>
            <p>Status: <b>{m.status}</b></p>

            <div className="btns">
              <button onClick={() => updateStatus(m.id, "Taken")}>
                Taken
              </button>
              <button onClick={() => updateStatus(m.id, "Missed")}>
                Missed
              </button>
            </div>

            {m.history.length > 0 && (
              <div className="history">
                <h4>History</h4>
                {m.history.map((h, i) => (
                  <p key={i}>{h.date} - {h.status}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
