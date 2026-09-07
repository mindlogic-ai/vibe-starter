"use client";

import { useEffect, useState } from "react";
import { getSupabase, isConfigured, type Item } from "@/lib/supabase";

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const { data, error } = await getSupabase()
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setItems(data ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isConfigured) load();
    else setLoading(false);
  }, []);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await getSupabase()
      .from("items")
      .insert({ title: title.trim(), note: note.trim() || null });
    if (error) return setError(error.message);
    setTitle("");
    setNote("");
    load();
  }

  async function toggle(item: Item) {
    const { error } = await getSupabase()
      .from("items")
      .update({ done: !item.done })
      .eq("id", item.id);
    if (error) return setError(error.message);
    load();
  }

  async function remove(item: Item) {
    const { error } = await getSupabase().from("items").delete().eq("id", item.id);
    if (error) return setError(error.message);
    load();
  }

  if (!isConfigured) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-2xl font-semibold">My Work Board</h1>
        <p className="mt-4 rounded border border-amber-300 bg-amber-50 p-4 text-sm">
          Supabase is not connected yet. Copy <code>.env.example</code> to <code>.env.local</code>,
          fill in the two values, and restart <code>npm run dev</code>.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-2xl font-semibold">My Work Board</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {items.filter((i) => !i.done).length} open · {items.filter((i) => i.done).length} done
      </p>

      <form onSubmit={addItem} className="mt-6 flex flex-col gap-2">
        <input
          className="rounded border border-neutral-300 bg-white px-3 py-2"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="rounded bg-neutral-900 px-3 py-2 text-white" type="submit">
          Add
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>
      )}

      <ul className="mt-6 divide-y divide-neutral-200 rounded border border-neutral-200 bg-white">
        {loading && <li className="p-4 text-sm text-neutral-500">Loading…</li>}
        {!loading && items.length === 0 && (
          <li className="p-4 text-sm text-neutral-500">Nothing here yet. Add your first item above.</li>
        )}
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 p-4">
            <input type="checkbox" checked={item.done} onChange={() => toggle(item)} className="mt-1" />
            <div className="flex-1">
              <div className={item.done ? "line-through text-neutral-400" : ""}>{item.title}</div>
              {item.note && <div className="text-sm text-neutral-500">{item.note}</div>}
            </div>
            <button onClick={() => remove(item)} className="text-sm text-neutral-400 hover:text-red-600">
              delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
