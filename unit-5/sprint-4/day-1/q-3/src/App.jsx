import { useState } from "react";

// ----------------------------
// 🔥 Custom Hook: useToggleItems
// ----------------------------
function useToggleItems(initialValue = [], initialPosition = 0) {
  // initialPosition optional hai → default 0
  const [index, setIndex] = useState(initialPosition);

  function toggleState() {
    setIndex((prev) => (prev + 1) % initialValue.length);  
  }

  // current selected item
  const currentItem = initialValue[index];

  return [currentItem, toggleState];
}

// ----------------------------
// 🔥 Component using the hook
// ----------------------------
export default function App() {
  // Example from assignment:
  const [state, toggleState] = useToggleItems(["A", "B", "C"], 1);

  return (
    <div style={{ padding: "20px" }}>
      <h2>useToggleItems Custom Hook</h2>

      <h1>Current: {state}</h1>

      <button onClick={toggleState}>Toggle</button>
      
      <p>
        Flow: B → C → A → B → C → A … (because initial position = 1)
      </p>
    </div>
  );
}
