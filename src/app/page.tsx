"use client";
import useSWR from "swr";
import { ListColumn } from "@/components/list-column";
import { NewListButton } from "@/components/new-list-button";
import { Toaster } from "react-hot-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const { data, mutate } = useSWR("/api/boards", fetcher);
  // /api/boards/demo will be a server route that returns all boards for demo

  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-semibold">Demo Boards</h1>
        {data && (
          <>
            {data.board && <NewListButton boardId={data?.board?.id} onCreated={() => mutate()} />}
            <div className="flex gap-4 overflow-x-auto">
              {data.lists?.map((l: any) => (
                <ListColumn
                  key={l.id}
                  list={l}
                  tasks={data.tasks.filter((t: any) => t.list_id === l.id)}
                  onChange={() => mutate()}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Toaster />
    </>
  );
}
