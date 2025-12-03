import { useState } from "react";

// ---------------------
// Custom Hook (useForm)
// ---------------------
function useForm(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  function onChange(e) {
    setValue(e.target.value);
  }

  function reset() {
    setValue(initialValue);
  }

  return { value, onChange, reset };
}

// ---------------------
// Component Using Hook
// ---------------------
export default function App() {
  const name = useForm("");   // custom hook used
  const email = useForm("");  // reused again

  return (
    <div style={{ padding: "20px" }}>
      <h2>Custom Hook Demo</h2>

      <input
        placeholder="Enter name"
        value={name.value}
        onChange={name.onChange}
      />

      <br /><br />

      <input
        placeholder="Enter email"
        value={email.value}
        onChange={email.onChange}
      />

      <br /><br />

      <button onClick={name.reset}>Reset Name</button>
      <button onClick={email.reset}>Reset Email</button>

      <br /><br />

      <h3>Output:</h3>
      <p>Name: {name.value}</p>
      <p>Email: {email.value}</p>
    </div>
  );
}
