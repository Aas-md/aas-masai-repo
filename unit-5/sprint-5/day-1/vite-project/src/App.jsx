import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/***********************
 FAKE FIREBASE DATA STORE
************************/

const store = {
  artifacts: [],
  creatures: [],
  logs: []
};

const listeners = {
  artifacts: [],
  creatures: [],
  logs: []
};

function subscribe(universe, cb) {
  listeners[universe].push(cb);
}

function pushUpdate(universe) {
  const data = [...store[universe]];
  listeners[universe].forEach(cb => cb(data));
}

function addItem(universe, text) {
  const item = { id: Date.now(), text };
  store[universe].push(item);
  pushUpdate(universe);
}

/***********************
 TAB COMPONENT
************************/

function UniverseTab({ universe }) {
  const PAGE_SIZE = 5;

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [freeze, setFreeze] = useState(false);
  const [pulse, setPulse] = useState(false);

  const scrollRef = useRef(0);
  const freezeRef = useRef(false);
  const bufferRef = useRef([]);
  const offlineRef = useRef(false);
  const offlineQueueRef = useRef([]);

  // Load saved state
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("NV-" + universe) || "{}");
    if (saved.page) setPage(saved.page);
    if (saved.filter) setFilter(saved.filter);
    if (saved.freeze) {
      setFreeze(saved.freeze);
      freezeRef.current = saved.freeze;
    }
    if (saved.scroll) {
      setTimeout(() => {
        window.scrollTo(0, saved.scroll);
      }, 50);
    }
  }, [universe]);

  // Save state
  useEffect(() => {
    localStorage.setItem(
      "NV-" + universe,
      JSON.stringify({
        page,
        filter,
        freeze,
        scroll: scrollRef.current
      })
    );
  }, [page, filter, freeze, universe]);

  // Scroll save
  useEffect(() => {
    const h = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  // Realtime subscription
  useEffect(() => {
    subscribe(universe, data => {
      if (freezeRef.current) {
        bufferRef.current.push(...data);
      } else {
        setItems(data);
        triggerPulse();
      }
    });
  }, [universe]);

  function triggerPulse() {
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  }

  // Add new item
  function handleAdd() {
    const text = prompt("Enter new item:");
    if (!text) return;

    if (offlineRef.current) {
      offlineQueueRef.current.push({ universe, text });
      alert("Offline → queued");
      return;
    }

    addItem(universe, text);
  }

  // Fake reconnect
  function goOnline() {
    offlineRef.current = false;
    offlineQueueRef.current.forEach(q => addItem(q.universe, q.text));
    offlineQueueRef.current = [];
  }

  // Pagination + filtering
  const filtered = items.filter(i =>
    i.text.toLowerCase().includes(filter.toLowerCase())
  );

  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {universe.toUpperCase()}{" "}
        <span className={`pulse ${pulse ? "active" : ""}`}></span>
      </h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          placeholder="Search..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
        <label>
          <input
            type="checkbox"
            checked={freeze}
            onChange={e => {
              const val = e.target.checked;
              setFreeze(val);
              freezeRef.current = val;

              if (!val) {
                // flush
                if (bufferRef.current.length > 0) {
                  setItems(bufferRef.current);
                  bufferRef.current = [];
                  triggerPulse();
                }
              }
            }}
          />
          Freeze
        </label>
        <button onClick={() => (offlineRef.current = true)}>Go Offline</button>
        <button onClick={goOnline}>Go Online</button>
      </div>

      {paginated.map(item => (
        <div key={item.id} className="card">
          {item.text}
        </div>
      ))}

      {/* Pagination */}
      <div style={{ marginTop: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button
          disabled={start + PAGE_SIZE >= filtered.length}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/***********************
 MAIN APP
************************/

export default function App() {
  const [tab, setTab] = useState("artifacts");

  return (
    <div>
      <div className="tabs">
        {["artifacts", "creatures", "logs"].map(t => (
          <button
            key={t}
            className={tab === t ? "active-tab" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <UniverseTab universe={tab} />
    </div>
  );
}
