// src/components/new-task-button.tsx
"use client";
import { useState } from "react";

interface NewTaskButtonProps {
  listId: string;
  onCreated?: (task: { id: string; title: string; description?: string }) => void;
}

export function NewTaskButton({ listId, onCreated }: NewTaskButtonProps) {
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    const title = prompt("Enter task title");
    if (!title) return;
  
    setLoading(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listId, title, description: "" }),
    });
    setLoading(false);
  
    if (res.ok) {
      const data = await res.json();
      console.log('Backend response after task creation:', data);
  
      // Ensure we are extracting the first task if the response is an array
      const newTask = data[0];
      if (newTask) {
        console.log('Task passed to onCreated:', newTask); // Check the data here
        if (onCreated) {
          onCreated({
            id: newTask.id,
            title: newTask.title,
            description: newTask.description || "",
          });
        }
      } else {
        console.error('No task data found in response');
      }
    } else {
      const data = await res.json();
      alert(data.error || "Failed to create task");
    }
  };
  
  

  return (
    <button
      onClick={addTask}
      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
      disabled={loading}
    >
      {loading ? "Adding..." : "+ Add Task"}
    </button>
  );
}
