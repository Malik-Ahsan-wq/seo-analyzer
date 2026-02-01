"use client";

import { useState, useEffect } from "react";
import InputForm from "./InputForm";
import ResultsPanel from "./ResultsPanel";
import SkeletonCard from "./SkeletonCard";
import type { AnalyzeResult } from "@/types";
import Container from "@/components/ui/container";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AnalyzerApp() {
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <Container className="py-6">
          <header className="flex items-center justify-between" data-aos="fade-down">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                SEO Analyzer
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Professional grade SEO & Performance analysis
              </p>
            </div>
          </header>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-indigo-500/5 p-8 border border-gray-100 dark:border-zinc-800">
              <h2 className="text-xl font-semibold mb-6 text-center">Enter your website URL to begin</h2>
              <InputForm
                onResult={(r) => {
                  setResult(r);
                  setTimeout(() => {
                    // Refresh AOS after content change
                    AOS.refresh();
                  }, 100);
                }}
                onLoading={setLoading}
              />
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading && (
              <div className="space-y-6">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            )}
            
            {!loading && result && (
              <div data-aos="fade-up" data-aos-duration="1000">
                <ResultsPanel result={result} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
