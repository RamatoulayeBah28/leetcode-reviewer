"use client";

import { Mic } from "lucide-react";

export default function InterviewPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <Mic className="w-6 h-6" style={{ color: "var(--accent)" }} />
        <h1 className="text-2xl font-semibold">Simulate a Real Interview</h1>
      </div>
      <p className="text-foreground/60">Coming soon — practice under real interview pressure with an AI interviewer.</p>
    </div>
  );
}
