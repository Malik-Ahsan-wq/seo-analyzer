"use client";


import ScoreCircle from "./ScoreCircle";
import type { AnalyzeResult } from "@/types";
import Card from "@/components/ui/card";

type Props = { result: AnalyzeResult };

function StatCard({ title, value }: { title: string; value: string | number | undefined }) {
  return (
    <Card className="p-3">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 font-semibold text-lg">{value ?? "—"}</div>
    </Card>
  );
}

export default function ResultsPanel({ result }: Props) {
  return (
    <div className="mt-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="col-span-1 flex flex-col items-center">
        <div className="text-sm text-gray-500">SEO Score</div>
        <div className="mt-4">
          <ScoreCircle value={result.seoScore} />
        </div>
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
          Combined score from PageSpeed SEO and on-page signals.
        </div>
        <div className="mt-4">
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(result, null, 2))}`}
            download={`seo-report-${new URL(result.url).hostname}.json`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
          >
            Export JSON
          </a>
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Mobile Performance" value={(result.psi.mobile as any).performance} />
          <StatCard title="Desktop Performance" value={(result.psi.desktop as any).performance} />
          <StatCard title="Mobile SEO" value={(result.psi.mobile as any).seo} />
          <StatCard title="Desktop SEO" value={(result.psi.desktop as any).seo} />
        </div>

        <Card>
          <div className="text-sm text-gray-500">Core Web Vitals (mobile)</div>
          <div className="mt-2 grid grid-cols-3 gap-4">
            <StatCard title="LCP (ms)" value={Math.round(((result.psi.mobile as any).cwv?.lcp?.value ?? 0))} />
            <StatCard title="CLS" value={(((result.psi.mobile as any).cwv?.cls?.value ?? 0) as number).toFixed(3)} />
            <StatCard title="INP (ms)" value={Math.round(((result.psi.mobile as any).cwv?.inp?.value ?? 0))} />
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-500">On-page analysis</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard title="Title" value={`${result.onpage.title ?? "—"} (${result.onpage.titleLength ?? 0})`} />
            <StatCard title="Meta Description" value={`${result.onpage.metaDescription ?? "—"} (${result.onpage.metaDescriptionLength ?? 0})`} />
            <StatCard title="H1 Count" value={result.onpage.h1Count} />
            <StatCard title="H2 Count" value={result.onpage.h2Count} />
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold">Recommendations</div>
            <ul className="mt-2 list-disc list-inside text-sm">
              {result.onpage.recommendations.length === 0 ? (
                <li>Looks good — no major on-page issues found.</li>
              ) : (
                result.onpage.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))
              )}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
