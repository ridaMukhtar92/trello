"use client";
import { useState } from 'react';

interface NewListButtonProps {
  boardId: string;
  onChange?: () => void; // make optional to match different prop names
  onCreated?: () => void; // added to accept onCreated prop
}

export function NewListButton({ boardId, onChange, onCreated }: NewListButtonProps) {
  const [loading, setLoading] = useState(false);

  const addList = async () => {
    setLoading(true);
    const res = await fetch('/api/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId, title: 'New List' })
    });
    setLoading(false);
    if (res.ok) {
      if (onChange) onChange();
      if (onCreated) onCreated();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to create list');
    }
  };

  return (
    <button onClick={addList} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={loading}>
      {loading ? 'Adding...' : '+ Add List'}
    </button>
  );
}
