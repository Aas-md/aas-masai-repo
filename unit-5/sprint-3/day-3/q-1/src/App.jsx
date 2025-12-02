import React, { useEffect, useState } from "react";
import { useAuth } from "./authContext";
import * as store from "./store";
import { dateKey, pastNDates, calcStreak, simpleMarkdownToHtml, computeInsights } from "./utils";

export default function App() {
  const { user, loginAsStudent, loginAsMentor, logout } = useAuth();
  const [dataVersion, setDataVersion] = useState(0); // simple re-render trigger
  const reload = () => setDataVersion(v => v + 1);

  useEffect(() => {
    // small listener to reload if other tab changed storage
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("mindtrack")) reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const state = store.loadAll();
  const logs = state.logs || {};
  const today = dateKey();
  const todaysLog = logs[today] || null;
  const dates = pastNDates(14);
  const streak = calcStreak(logs);
  const insights = computeInsights(logs);

  // Student actions
  const saveToday = (payload) => {
    store.saveLog(today, payload);
    reload();
  };

  const deleteToday = () => {
    store.deleteLog(today);
    reload();
  };

  const addMentorC = (key, text) => {
    store.addMentorComment(key, text);
    reload();
  };

  const toggleOpt = (key, val) => {
    store.toggleOptIn(key, val);
    reload();
  };

  const exportMonth = () => {
    // small printable summary (user can Save as PDF from print dialog)
    const win = window.open("", "_blank");
    const monthKeys = Object.keys(logs).filter(k => k.startsWith(new Date().toISOString().slice(0,7)));
    let html = `<h1>MindTrack Summary (${new Date().toLocaleString()})</h1>`;
    monthKeys.forEach(k => {
      const l = logs[k];
      html += `<h3>${k}</h3><div>Study: ${l.studyHours || ""}h, Sleep: ${l.sleepHours || ""}h, Break: ${l.breakMinutes || ""}min, Stress: ${l.stress || ""}, Focus: ${l.focus || ""}</div>`;
      html += `<div>Reflection:<br/>${simpleMarkdownToHtml(l.reflection || "")}</div><hr/>`;
    });
    win.document.write(html);
    win.print();
    win.close();
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>MindTrack (Demo)</h2>
        <p>Select role to continue:</p>
        <button onClick={() => { loginAsStudent(); }}>Login as Student</button>
        <button onClick={() => { loginAsMentor(); }} style={{ marginLeft: 8 }}>Login as Mentor</button>
        <p style={{ color: "#666", marginTop: 10 }}>This demo uses localStorage only. No backend.</p>
      </div>
    );
  }

  // STUDENT VIEW
  if (user.role === "student") {
    return (
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>MindTrack — Student</h2>
          <div>
            <span style={{ marginRight: 10 }}>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Streak:</strong> {streak} day(s) — {streak >= 7 ? "Great consistency!" : "Keep going!"}
        </div>

        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 12, border: "1px solid #ddd" }}>
            <h3>{todaysLog ? "Edit Today's Log" : "Add Today's Log"}</h3>
            <label>Study hours: <input type="number" defaultValue={todaysLog?.studyHours || ""} id="study" style={{ width: 80 }} /></label><br/>
            <label>Break minutes: <input type="number" defaultValue={todaysLog?.breakMinutes || ""} id="break" style={{ width: 80 }} /></label><br/>
            <label>Sleep hours: <input type="number" defaultValue={todaysLog?.sleepHours || ""} id="sleep" style={{ width: 80 }} /></label><br/>
            <label>Stress:
              <select defaultValue={todaysLog?.stress || "medium"} id="stress">
                <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
              </select>
            </label><br/>
            <label>Focus:
              <select defaultValue={todaysLog?.focus || "medium"} id="focus">
                <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
              </select>
            </label><br/>
            <label>Reflection (markdown allowed):<br/>
              <textarea id="ref" defaultValue={todaysLog?.reflection || ""} rows={5} style={{ width: "100%" }} />
            </label>
            <div style={{ marginTop: 8 }}>
              <label><input type="checkbox" id="opt" defaultChecked={!!todaysLog?.optedIn}/> Allow mentor to view anonymized</label>
            </div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => {
                const payload = {
                  studyHours: Number(document.getElementById("study").value) || 0,
                  breakMinutes: Number(document.getElementById("break").value) || 0,
                  sleepHours: Number(document.getElementById("sleep").value) || 0,
                  stress: document.getElementById("stress").value,
                  focus: document.getElementById("focus").value,
                  reflection: document.getElementById("ref").value || "",
                  optedIn: !!document.getElementById("opt").checked,
                  updatedAt: Date.now()
                };
                store.saveLog(dateKey(), payload);
                reload();
              }}>Save</button>
              <button onClick={() => { deleteToday(); }} style={{ marginLeft: 8 }}>Delete</button>
            </div>
          </div>

          <div style={{ padding: 12, border: "1px solid #ddd" }}>
            <h3>Heatmap (last 14 days)</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {dates.map(d => {
                const l = logs[d];
                return (
                  <div key={d} style={{
                    width: 28, height: 28, borderRadius: 4,
                    background: l ? (l.focus === "high" ? "#2ecc71" : l.focus === "medium" ? "#f1c40f" : "#e74c3c") : "#eee",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10
                  }} title={`${d} ${l ? `${l.studyHours || ""}h` : "no log"}`}>{d.slice(8)}</div>
                );
              })}
            </div>

            <h4 style={{ marginTop: 12 }}>Insights</h4>
            {insights.length === 0 ? <div>Write logs for 7+ days to get insights.</div> : insights.map((s,i)=> <div key={i}>• {s}</div>)}

            <div style={{ marginTop: 12 }}>
              <button onClick={() => {
                // gentle nudge if today's empty
                if (!todaysLog) alert("Gentle Nudge: Take 1 min to log today's study & wellness!");
                else alert("Nice! You logged today.");
              }}>Nudge</button>

              <button onClick={exportMonth} style={{ marginLeft: 8 }}>Export Monthly Summary (Print/PDF)</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MENTOR VIEW
  if (user.role === "mentor") {
    // show anonymized entries that have opted in
    const entries = Object.keys(logs).filter(k => logs[k]?.optedIn).sort((a,b)=> b.localeCompare(a));
    return (
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>MindTrack — Mentor Dashboard</h2>
          <div>
            <span style={{ marginRight: 10 }}>{user.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <h3>Opted-in entries (anonymized)</h3>
          {entries.length === 0 && <div>No opted-in student entries yet.</div>}
          {entries.map(k => {
            const e = logs[k];
            return (
              <div key={k} style={{ border: "1px solid #ddd", padding: 10, marginTop: 8 }}>
                <div style={{ fontSize: 12, color: "#666" }}>{k}</div>
                <div>Study: {e.studyHours}h • Sleep: {e.sleepHours}h • Break: {e.breakMinutes}min</div>
                <div>Stress: {e.stress} • Focus: {e.focus}</div>
                <div style={{ marginTop: 6 }} dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(e.reflection || "") }} />
                <div style={{ marginTop: 6 }}>
                  <strong>Mentor comments:</strong>
                  <ul>
                    {(e.mentorComments || []).map(c => <li key={c.id}>{c.text}</li>)}
                  </ul>
                </div>

                <div style={{ marginTop: 6 }}>
                  <input placeholder="Add positive comment" id={`cm-${k}`} />
                  <button onClick={() => {
                    const v = document.getElementById(`cm-${k}`).value;
                    if (!v.trim()) return alert("write comment");
                    addMentorC(k, v.trim());
                    document.getElementById(`cm-${k}`).value = "";
                  }} style={{ marginLeft: 6 }}>Add</button>

                  <button onClick={() => {
                    // suggest simple focus area
                    const suggestion = "Suggestion: Maintain sleep cycle and short regular breaks.";
                    addMentorC(k, suggestion);
                    alert("Suggestion added.");
                  }} style={{ marginLeft: 8 }}>Suggest Focus Area</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

// small local helpers used inside component
function getDateKey() {
  return new Date().toISOString().slice(0,10);
}
