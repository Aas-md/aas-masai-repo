import { useState } from "react";
import { AuthProvider, useAuth } from "./authContext";
import { loadProjects, saveProjects } from "./store";

function AppContent() {
  const { isLoggedIn, login, logout } = useAuth();
  const [projects, setProjects] = useState(loadProjects());
  const [title, setTitle] = useState("");
  const [taskText, setTaskText] = useState("");
  const [activeProject, setActiveProject] = useState(null);

  const addProject = () => {
    if (!title.trim()) return;
    const newProjects = [...projects, { id: Date.now(), title, tasks: [] }];
    setProjects(newProjects);
    saveProjects(newProjects);
    setTitle("");
  };

  const addTask = () => {
    if (!taskText.trim() || activeProject === null) return;

    const updated = projects.map((p) =>
      p.id === activeProject
        ? { ...p, tasks: [...p.tasks, { id: Date.now(), text: taskText }] }
        : p
    );

    setProjects(updated);
    saveProjects(updated);
    setTaskText("");
  };

  if (!isLoggedIn)
    return (
      <div style={{ padding: 20 }}>
        <h2>Please Login</h2>
        <button onClick={login}>Login</button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Logout</button>

      <h2>Projects</h2>
      <input
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addProject}>Add Project</button>

      <ul>
        {projects.map((p) => (
          <li key={p.id} onClick={() => setActiveProject(p.id)}>
            {p.title}
          </li>
        ))}
      </ul>

      {activeProject && (
        <div>
          <h3>Tasks</h3>
          <input
            placeholder="Task..."
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <button onClick={addTask}>Add Task</button>

          <ul>
            {projects
              .find((p) => p.id === activeProject)
              .tasks.map((t) => (
                <li key={t.id}>{t.text}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
