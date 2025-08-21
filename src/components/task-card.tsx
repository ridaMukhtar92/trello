import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TaskCardProps {
  task: { id: string; title: string; description?: string };
  onDelete: (taskId: string) => void; // Optional callback to refresh the list of tasks
  onUpdate: (updatedTask: {
    id: string;
    title: string;
    description?: string;
  }) => void;
}

export function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDescription, setNewDescription] = useState(task.description);

  // Handle save of the edited task
  const handleUpdate = async () => {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription || "",
      }),
    });
    console.log(res);
    if (res.ok) {
      console.log("Task updated");
      toast.success("Task updated!"); // Show success toast
      onUpdate({
        id: task.id,
        title: newTitle,
        description: newDescription || "",
      }); // Update task in parent state
      setIsEditing(false); // Exit editing mode
    } else {
      console.error("Failed to update task");
    }
  };

  const handleDelete = async () => {
    // Make DELETE request to backend API
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      console.log("Task deleted");
      toast.success("Task deleted successfully!"); // Show success toast
      onDelete(task.id); // Call onDelete from parent to update the local state
    } else {
      console.error("Failed to delete task");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg mb-4 transition-all transform hover:scale-105 hover:shadow-2xl">
      {isEditing ? (
        <div className="space-y-4">
          <input
            className="border-2 p-2 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter task title"
          />
          <textarea
            className="border-2 p-2 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Enter task description"
          />
          <div className="flex justify-between items-center">
            <button
              onClick={handleUpdate}
              className="px-4 p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 p-1 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
          <p className="text-gray-600 mt-2">
            {task.description || "No description provided."}
          </p>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-all focus:outline-none"
            >
              <PencilIcon className="w-6 h-6" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all focus:outline-none"
            >
              <TrashIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
