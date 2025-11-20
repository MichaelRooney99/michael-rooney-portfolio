import React, { useState } from "react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design wireframes",
      category: "Design",
      completed: false,
      priority: "high"
    },
    {
      id: 2,
      title: "Build React components",
      category: "Development",
      completed: true,
      priority: "high"
    },
    {
      id: 3,
      title: "Write documentation",
      category: "Documentation",
      completed: false,
      priority: "medium"
    }
  ]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Development");
  const [selectedPriority, setSelectedPriority] = useState("medium");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          category: selectedCategory,
          completed: false,
          priority: selectedPriority
        }
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    active: tasks.filter((t) => !t.completed).length
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Animated particles */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none"
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              background: "rgba(139, 92, 246, 0.3)",
              borderRadius: "50%",
              filter: "blur(20px)",
              width: `${60 + i * 10}px`,
              height: `${60 + i * 10}px`,
              left: `${10 + i * 20}%`,
              animation: `float${i} 25s infinite ease-in-out`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float0 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-200px) translateX(50px); opacity: 0.5; }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-180px) translateX(-50px); opacity: 0.6; }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-220px) translateX(30px); opacity: 0.5; }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          50% { transform: translateY(-190px) translateX(-30px); opacity: 0.6; }
        }
        @keyframes float4 {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          50% { transform: translateY(-210px) translateX(60px); opacity: 0.5; }
        }

        .task-card {
          transition: all 0.3s ease;
        }

        .task-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(139, 92, 246, 0.3);
        }

        .glass-card {
          background: rgba(30, 41, 59, 0.6);
          backdropFilter: blur(10px);
          border: 1px solid rgba(139, 92, 246, 0.3);
          borderRadius: 16px;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              background:
                "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.5rem"
            }}
          >
            Task Manager
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
            Stay organized and productive
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}
        >
          {[
            { label: "Total Tasks", value: stats.total, icon: "📋" },
            { label: "Active", value: stats.active, icon: "⚡" },
            { label: "Completed", value: stats.completed, icon: "✅" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{ padding: "1.5rem", textAlign: "center" }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {stat.value}
              </div>
              <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Form */}
        <div
          className="glass-card"
          style={{ padding: "2rem", marginBottom: "2rem" }}
        >
          <h2
            style={{
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              color: "#8b5cf6"
            }}
          >
            ➕ Add New Task
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              placeholder="Enter task title..."
              style={{
                background: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                borderRadius: "8px",
                padding: "0.875rem",
                color: "#e2e8f0",
                fontSize: "1rem",
                outline: "none"
              }}
            />
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  color: "#e2e8f0",
                  fontSize: "0.9rem",
                  flex: 1,
                  minWidth: "150px"
                }}
              >
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Documentation">Documentation</option>
                <option value="Testing">Testing</option>
                <option value="Meeting">Meeting</option>
              </select>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                style={{
                  background: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "0.75rem",
                  color: "#e2e8f0",
                  fontSize: "0.9rem",
                  flex: 1,
                  minWidth: "150px"
                }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                onClick={addTask}
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 2rem",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  flex: 1,
                  minWidth: "120px"
                }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background:
                  filter === f
                    ? "linear-gradient(135deg, #8b5cf6, #ec4899)"
                    : "transparent",
                border: `2px solid ${
                  filter === f ? "transparent" : "rgba(139, 92, 246, 0.3)"
                }`,
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                color: "white",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize"
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredTasks.length === 0 ? (
            <div
              className="glass-card"
              style={{ padding: "3rem", textAlign: "center" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📝</div>
              <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
                No tasks found
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="glass-card task-card"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    accentColor: "#8b5cf6"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      marginBottom: "0.5rem",
                      textDecoration: task.completed ? "line-through" : "none",
                      opacity: task.completed ? 0.6 : 1
                    }}
                  >
                    {task.title}
                  </h3>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    <span
                      style={{
                        background: "rgba(139, 92, 246, 0.2)",
                        color: "#8b5cf6",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.8rem",
                        border: "1px solid rgba(139, 92, 246, 0.3)"
                      }}
                    >
                      {task.category}
                    </span>
                    <span
                      style={{
                        background:
                          task.priority === "high"
                            ? "rgba(239, 68, 68, 0.2)"
                            : task.priority === "medium"
                            ? "rgba(245, 158, 11, 0.2)"
                            : "rgba(34, 197, 94, 0.2)",
                        color:
                          task.priority === "high"
                            ? "#ef4444"
                            : task.priority === "medium"
                            ? "#f59e0b"
                            : "#22c55e",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "1rem",
                        fontSize: "0.8rem",
                        border: `1px solid ${
                          task.priority === "high"
                            ? "rgba(239, 68, 68, 0.3)"
                            : task.priority === "medium"
                            ? "rgba(245, 158, 11, 0.3)"
                            : "rgba(34, 197, 94, 0.3)"
                        }`,
                        textTransform: "capitalize"
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem",
                    color: "#ef4444",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
