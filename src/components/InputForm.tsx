"use client";

import { useState } from "react";
import type { AnalyzeResult } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ArrowRight } from "lucide-react";

type Props = { 
  onResult: (r: AnalyzeResult) => void;
  onLoading: (isLoading: boolean) => void;
};

export default function InputForm({ onResult, onLoading }: Props) {
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
    onLoading(true);
    
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
      onLoading(false);
    }
  }

  return (
    <form className="w-full max-w-2xl mx-auto" onSubmit={handleSubmit}>
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Input
          aria-label="url"
          placeholder="Enter website URL (e.g. example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-10 h-12 text-lg bg-gray-50 border-gray-200 focus:bg-white transition-all rounded-l-lg rounded-r-none border-r-0"
        />
        <Button 
          type="submit" 
          disabled={loading} 
          className="h-12 px-8 text-base font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-l-none rounded-r-lg transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </form>
  );
}
