import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  const supabase = createServerSupabase();

  // Fetch one board (for demo) and its lists & tasks
  const { data: boards } = await supabase.from("boards").select("*").limit(1);
  if (!boards || boards.length === 0) return NextResponse.json({ board: null, lists: [], tasks: [] });

  const board = boards[0];

  const { data: lists } = await supabase.from("lists").select("*").eq("board_id", board.id);
  const listIds = lists?.map(l => l.id) ?? [];
  const { data: tasks } = await supabase.from("tasks").select("*").in("list_id", listIds);

  return NextResponse.json({ board, lists, tasks });
}
