// pages/api/tasks/[taskId].ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';  // Use server-side Supabase client

// Handle PATCH (Update task) and DELETE (Delete task) requests
export async function PATCH(req: NextRequest, { params }: { params: { taskId: string } }) {
  const { taskId } = params;  // Get taskId from URL params
  const body = await req.json();  // Get data from the request body

  const { title, description } = body;

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  try {
    const { data, error } = await createServerSupabase()  // Use server-side Supabase client
      .from('tasks')
      .update({ title, description })
      .eq('id', taskId)  // Match task ID
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data?.length) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task updated successfully', task: data[0] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { taskId } = params;  // Get taskId from URL
  
  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const { error } = await createServerSupabase()  // Use server-side Supabase client
      .from('tasks')
      .delete()
      .match({ id: taskId });  // Delete task with the provided taskId

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });  // Return success message
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
