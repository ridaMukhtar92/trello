import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { listId, title, description } = await req.json();
    if (!listId || !title) {
      return NextResponse.json({ error: 'listId and title are required' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ list_id: listId, title, description }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
