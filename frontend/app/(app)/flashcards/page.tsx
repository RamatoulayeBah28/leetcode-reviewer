"use client";

import { Layers } from "lucide-react";

export default function FlashcardsPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <Layers className="w-6 h-6" style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-semibold">Flashcards</h1>
      </div>
      <p className="text-foreground/60">Coming soon — lock in the patterns with spaced-repetition flashcards.</p>
    </div>
  );
}
