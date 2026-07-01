"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Problem = {
  id: number;
  title: string;
  difficulty: string;
  note: string | null;
  topics: string[];
  patterns: string[];
};

export default function DashboardPage() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [problems, setProblems] = useState<Problem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [note, setNote] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<number[]>([]);
  const [selectedPatterns, setSelectedPatterns] = useState<number[]>([]);
  const [allTopics, setAllTopics] = useState<{ id: number; topic: string }[]>(
    [],
  );
  const [allPatterns, setAllPatterns] = useState<
    { id: number; pattern: string }[]
  >([]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function loadProblems() {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError(`Request failed: ${res.status}`);
        return;
      }
      setProblems(await res.json());
    }

    loadProblems().catch((err) => setError(String(err)));
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function fetchTopics() {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/topics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAllTopics(await res.json());
    }

    async function fetchPatterns() {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patterns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setAllPatterns(await res.json());
    }

    fetchTopics().catch((err) => setError(String(err)));
    fetchPatterns().catch((err) => setError(String(err)));
  }, [isLoaded, isSignedIn, getToken]);

  function addProblem() {
    setShowForm(true);
  }

  async function postProblem(e: React.SyntheticEvent) {
    e.preventDefault();
    const token = await getToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/problems`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        difficulty,
        note,
        topic_ids: selectedTopics,
        pattern_ids: selectedPatterns,
      }),
    });
    if (!res.ok) {
      setError(`Request failed: ${res.status}`);
      return;
    }
    const newProblem = await res.json();
    setProblems([...(problems ?? []), newProblem]);
    setTitle("");
    setDifficulty("");
    setNote("");
    setSelectedTopics([]);
    setSelectedPatterns([]);
    setShowForm(false);
  }

  if (!isLoaded) return <p className="p-8">Loading...</p>;
  if (!isSignedIn) return <p className="p-8">Sign in to see your problems.</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;
  if (problems === null) return <p className="p-8">Loading your problems...</p>;

  return (
    <main className="p-8 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-6">Your Problems</h1>
      {problems.length === 0 ? (
        <p className="text-foreground/60">
          No problems yet -- add your first one to get started.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {problems.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-foreground/10 p-4"
            >
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-foreground/60">
                {p.difficulty} · {p.topics.join(", ")} · {p.patterns.join(", ")}
              </p>
              {p.note && (
                <p className="italic text-sm text-foreground/60">
                  Note: {p.note}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      <button
        className="rounded-full bg-primary mt-4 text-primary-foreground font-medium text-base h-12 px-8 cursor-pointer transition-opacity hover:opacity-90"
        onClick={() => addProblem()}
      >
        Add Problem
      </button>
      {showForm && (
        <form
          onSubmit={postProblem}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-foreground/10 p-6"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              id="problem-title"
              name="problem-title"
              placeholder="Two Sum, Valid Palindrome..."
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Difficulty</label>
            <select
              name="difficulty"
              id="difficulty"
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Topic(s)</label>
            <p className="text-xs text-foreground/50">
              Hold Cmd/Ctrl to select multiple
            </p>
            <select
              name="topics"
              id="topics"
              multiple
              onChange={(e) =>
                setSelectedTopics(
                  Array.from(e.target.selectedOptions, (opt) =>
                    Number(opt.value),
                  ),
                )
              }
              className="rounded-lg border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-36"
            >
              {allTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.topic}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Pattern(s)</label>
            <p className="text-xs text-foreground/50">
              Hold Cmd/Ctrl to select multiple
            </p>
            <select
              name="patterns"
              id="patterns"
              multiple
              onChange={(e) =>
                setSelectedPatterns(
                  Array.from(e.target.selectedOptions, (opt) =>
                    Number(opt.value),
                  ),
                )
              }
              className="rounded-lg border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 h-36"
            >
              {allPatterns.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.pattern}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Note</label>
            <input
              type="text"
              id="note"
              placeholder="Work on brute force first..."
              onChange={(e) => setNote(e.target.value)}
              className="rounded-lg border border-foreground/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary text-primary-foreground font-medium text-sm h-10 px-6 cursor-pointer transition-opacity hover:opacity-90 self-end"
          >
            Save
          </button>
        </form>
      )}
    </main>
  );
}
