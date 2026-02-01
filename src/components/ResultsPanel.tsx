"use client";

import ScoreCircle from "./ScoreCircle";
import type { AnalyzeResult } from "@/types";
import Card from "@/components/ui/card";

type Props = { result: AnalyzeResult };

function StatCard({ title, value, sub, delay = 0 }: { title: string; value: string | number | undefined; sub?: string; delay?: number }) {
  return (
    <Card className="p-4 border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow duration-300" data-aos="fade-up" data-aos-delay={delay}>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="font-bold text-2xl text-gray-900 dark:text-gray-100">{value ?? "—"}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
    </Card>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6" data-aos="fade-right">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
}

export default function ResultsPanel({ result }: Props) {
  const scoreColor = result.seoScore >= 80 ? "text-green-600" : result.seoScore >= 50 ? "text-amber-500" : "text-red-500";
  
  // Calculate pass/fail counts
  const passed = result.onpage.score >= 80 ? 1 : 0; // Simplified logic for demo
  const failed = result.onpage.score < 50 ? 1 : 0;
  const warnings = result.onpage.score >= 50 && result.onpage.score < 80 ? 1 : 0;

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Score Card */}
        <Card className="col-span-1 lg:col-span-1 p-6 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-lg" data-aos="zoom-in">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Overall SEO Score</h2>
            <p className="text-sm text-gray-500 mt-1">Weighted average of all metrics</p>
          </div>
          
          <div className="transform scale-110">
            <ScoreCircle value={result.seoScore} size={160} />
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 w-full text-center">
            <div>
              <div className="text-2xl font-bold text-red-500">{failed}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">{warnings}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Warnings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{passed}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Passed</div>
            </div>
          </div>
        </Card>

        {/* Action & High Level Stats */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="p-8 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white border-none shadow-xl" data-aos="fade-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Analysis Complete</h3>
                <p className="text-indigo-200">
                  We've analyzed <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded">{new URL(result.url).hostname}</span> and found several opportunities for improvement.
                </p>
              </div>
              <a
                href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`}
                download={`seo-report-${new URL(result.url).hostname}.json`}
                className="whitespace-nowrap px-6 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Download Report
              </a>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard title="Mobile Perf" value={(result.psi.mobile as any).performance} delay={100} />
            <StatCard title="Desktop Perf" value={(result.psi.desktop as any).performance} delay={150} />
            <StatCard title="Mobile SEO" value={(result.psi.mobile as any).seo} delay={200} />
            <StatCard title="Desktop SEO" value={(result.psi.desktop as any).seo} delay={250} />
          </div>
        </div>
      </div>

      {/* Core Web Vitals Section */}
      <div data-aos="fade-up">
        <SectionHeader title="Core Web Vitals" description="Real-world user experience metrics from Google (Mobile)" />
        <Card className="p-6 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
              <div className="text-sm text-gray-500 font-medium">Largest Contentful Paint (LCP)</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(((result.psi.mobile as any).cwv?.lcp?.value ?? 0) / 100) / 10}s
              </div>
              <div className="text-xs text-gray-400">Target: &lt; 2.5s</div>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
              <div className="text-sm text-gray-500 font-medium">Cumulative Layout Shift (CLS)</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {(((result.psi.mobile as any).cwv?.cls?.value ?? 0) as number).toFixed(3)}
              </div>
              <div className="text-xs text-gray-400">Target: &lt; 0.1</div>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800/50">
              <div className="text-sm text-gray-500 font-medium">Interaction to Next Paint (INP)</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(((result.psi.mobile as any).cwv?.inp?.value ?? 0))}ms
              </div>
              <div className="text-xs text-gray-400">Target: &lt; 200ms</div>
            </div>
          </div>
        </Card>
      </div>

      {/* On-Page Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div data-aos="fade-right">
          <SectionHeader title="On-Page Structure" description="HTML tag usage and content structure" />
          <div className="space-y-4">
            <Card className="p-0 overflow-hidden border-gray-100 dark:border-zinc-800">
              <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 flex justify-between items-center">
                <span className="font-medium text-sm">Page Title</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${result.onpage.title ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {result.onpage.titleLength} chars
                </span>
              </div>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                {result.onpage.title || <span className="text-red-500 italic">Missing title tag</span>}
              </div>
            </Card>

            <Card className="p-0 overflow-hidden border-gray-100 dark:border-zinc-800">
              <div className="p-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/30 flex justify-between items-center">
                <span className="font-medium text-sm">Meta Description</span>
                <span className={`text-xs font-mono px-2 py-1 rounded ${result.onpage.metaDescription ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {result.onpage.metaDescriptionLength} chars
                </span>
              </div>
              <div className="p-4 text-sm text-gray-600 dark:text-gray-300">
                {result.onpage.metaDescription || <span className="text-red-500 italic">Missing meta description</span>}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <StatCard title="H1 Tags" value={result.onpage.h1Count} sub={result.onpage.h1Count === 1 ? "Perfect" : "Should be 1"} />
              <StatCard title="H2 Tags" value={result.onpage.h2Count} />
            </div>
          </div>
        </div>

        <div data-aos="fade-left">
          <SectionHeader title="Recommendations" description="Actionable items to improve your score" />
          <Card className="h-full border-gray-100 dark:border-zinc-800">
            <div className="p-6">
              {result.onpage.recommendations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-green-600">
                  <svg className="w-12 h-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">Great job! No major issues found.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {result.onpage.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-gray-300 items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
