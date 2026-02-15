"use client";

import { useState } from "react";
import InputForm from "./InputForm";
import ResultsPanel from "./ResultsPanel";
import SkeletonCard from "./SkeletonCard";
import type { AnalyzeResult } from "@/types";
import Container from "@/components/ui/container";

export default function AnalyzerApp() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  return (
    <div className="px-4 py-8">
      <Container>
        <header>
          <h1 className="text-2xl font-bold">SEO Analyzer</h1>
          <p className="text-sm text-gray-500 mt-1">Analyze performance and on-page SEO for any public URL.</p>
        </header>

        <div className="mt-6">
          <InputForm
            onResult={(r) => {
              setResult(r);
            }}
          />
        </div>

        <div className="mt-6">{!result && <SkeletonCard />}</div>

        {result && <ResultsPanel result={result} />}
      </Container>
    </div>
  );
}
