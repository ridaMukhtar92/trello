import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function DELETE(req: NextRequest, { params }: { params: { listId: string } }) {
  const { listId } = params;  // Get the listId from URL params

  if (!listId) {
    return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
  }

  try {
    // Delete all tasks associated with the list first
    const { error: deleteTasksError } = await createServerSupabase()
      .from('tasks')
      .delete()
      .match({ list_id: listId });

    if (deleteTasksError) {
      return NextResponse.json({ error: 'Failed to delete tasks', details: deleteTasksError.message }, { status: 500 });
    }

    // Now delete the list
    const { error: deleteListError } = await createServerSupabase()
      .from('lists')
      .delete()
      .match({ id: listId });

    if (deleteListError) {
      return NextResponse.json({ error: 'Failed to delete list', details: deleteListError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'List and its tasks deleted successfully' }, { status: 200 });
  } catch (err: unknown) {
    // Type guard to check if the error is an instance of Error
    if (err instanceof Error) {
      return NextResponse.json({ error: 'Unexpected error during list deletion', details: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unexpected error during list deletion' }, { status: 500 });
  }
}
