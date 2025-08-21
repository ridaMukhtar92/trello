"use client";
import { createBrowserSupabase } from "@/lib/supabase-client";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NewTaskButton } from "./new-task-button";
import { TaskCard } from "./task-card";

type Task = { id: string; title: string; description?: string };

export function ListColumn({
  list,
  tasks: initialTasks,
  onChange,
}: {
  list: { id: string; title: string };
  tasks: Array<{ taskId: string; title: string; description?: string }>;
  onChange: () => void;
}) {
  const [title, setTitle] = useState(list.title);

  // Initialize tasks
  const [tasks, setTasks] = useState<Task[]>(
    (initialTasks || []).map((t) => ({
      id: t.taskId ?? (t as any).id,
      title: t.title,
      description: t.description,
    }))
  );

  const supabase = createBrowserSupabase;

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("list_id", list.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setTasks((prev) => {
        const newTasks = data as Task[];

        // Merge old and new tasks (avoid duplicates)
        const mergedTasks = [
          ...prev.filter(
            (task) => !newTasks.some((newTask) => newTask.id === task.id)
          ),
          ...newTasks,
        ];
        return mergedTasks;
      });
    }
  };

  // Fetch tasks only on mount
  useEffect(() => {
    fetchTasks();
  }, [list.id]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`tasks-list-${list.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `list_id=eq.${list.id}`,
        },
        (payload: any) => {
          console.log("Real-time update:", payload);
          setTasks((prev) => {
            const newTask = payload.new
              ? {
                  id: payload.new.id,
                  title: payload.new.title,
                  description: payload.new.description,
                }
              : null;
            const oldTask = payload.old
              ? {
                  id: payload.old.id,
                  title: payload.old.title,
                  description: payload.old.description,
                }
              : null;

            switch (payload.eventType) {
              case "INSERT":
                if (!newTask) return prev;
                if (prev.some((t) => t.id === newTask.id)) return prev;
                return [...prev, newTask];
              case "UPDATE":
                if (!newTask) return prev;
                return prev.map((t) => (t.id === newTask.id ? newTask : t));
              case "DELETE":
                if (!oldTask) return prev;
                return prev.filter((t) => t.id !== oldTask.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [list.id]);

  // Save list title
  const saveTitle = async () => {
    if (title === list.title) return;
    await fetch(`/api/lists/${list.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    onChange();
  };

  const handleDeleteList = async () => {
    const res = await fetch(`/api/lists/${list.id}`, {
      method: 'DELETE',
    });
  
    if (res.ok) {
      console.log('List and its tasks deleted successfully');
      toast.success("List deleted successfully!"); // Show success toast
      onChange();  // Call the onChange prop to update the parent state and reflect the deletion
    } else {
      console.error('Failed to delete list');
    }
  };

  // Add task locally (used in NewTaskButton)
  const handleNewTask = async (task: Task) => {
    console.log("Received task in handleNewTask:", task); // Log the task to verify

    // Ensure task has all valid properties
    if (!task.id || !task.title) {
      console.error("Invalid task data:", task);
      return;
    }

    setTasks((prev) => [...prev, task]);

    await fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        // Remove task from local state after successful deletion
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        alert('Failed to delete task');
      }
  };

  // Handle task update locally
  const handleUpdateTask = (updatedTask: { id: string; title: string; description?: string }) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task))  // Update the task in state
    );
  };

  return (
    <div className="min-w-[280px] max-w-[320px] bg-zinc-50 rounded-xl p-3 shadow-sm">
      <div className="flex justify-between items-center">
        <input
          className="w-full bg-transparent font-medium focus:outline-none focus:ring-2 focus:ring-zinc-300 rounded px-2 py-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveTitle}
        />
        <button onClick={handleDeleteList} className="ml-2 text-red-600 font-bold">
        <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onDelete={handleDeleteTask} // Call handleDeleteTask instead of fetchTasks
            onUpdate={handleUpdateTask}
          />
        ))}
        <NewTaskButton
          listId={list.id}
          onCreated={(task: Task) => handleNewTask(task)}
        />
      </div>
    </div>
  );
}
