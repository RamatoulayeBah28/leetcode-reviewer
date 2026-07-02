"use client";

import { Bot } from "lucide-react";

export default function TutorPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto w-full flex flex-col h-full">
      <div className="flex items-center gap-3 mb-8">
        <Bot className="w-6 h-6" style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-semibold">Ask Your AI Tutor</h1>
      </div>
      <p className="text-foreground/60">Coming soon — solve alongside your AI tutor with Socratic hints.</p>
    </div>
  );
}
