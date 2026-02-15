"use client";

import { useState } from "react";
import type { AnalyzeResult } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = { onResult: (r: AnalyzeResult) => void };

export default function InputForm({ onResult }: Props) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(u: string) {
    try {
      const parsed = new URL(u.match(/^https?:\/\//i) ? u : `https://${u}`);
      return parsed.protocol.startsWith("http");
    } catch {
      return false;
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    if (!validate(url)) {
      setError("Please enter a valid URL (e.g. example.com or https://example.com)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Server error");
      onResult(json as AnalyzeResult);
    } catch (err) {
      setError((err as Error).message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-full max-w-3xl mx-auto" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Input
          aria-label="url"
          placeholder="https://example.com or example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  );
}
