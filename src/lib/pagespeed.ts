import type { PSIResult, CWV } from "@/types";

async function fetchStrategy(url: string, strategy: "mobile" | "desktop", apiKey: string): Promise<PSIResult> {
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${apiKey}`;
  const res = await fetch(apiUrl, { next: { revalidate: 30 } });
  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded for PageSpeed API");
    throw new Error(`PageSpeed API error: ${res.status}`);
  }
  const json = await res.json();

  const lr = json.lighthouseResult;
  const categories = lr?.categories ?? {};

  const getAuditValue = (key: string) => {
    return lr?.audits?.[key]?.numericValue ?? lr?.audits?.[key]?.score ?? undefined;
  };

  const cwv: CWV = {};
  const lcpVal = getAuditValue("largest-contentful-paint");
  const clsVal = getAuditValue("cumulative-layout-shift");
  const inpVal = getAuditValue("interaction-to-next-paint") ?? getAuditValue("experimental-interaction-to-next-paint");
  if (typeof lcpVal === "number") cwv.lcp = { value: lcpVal };
  if (typeof clsVal === "number") cwv.cls = { value: clsVal };
  if (typeof inpVal === "number") cwv.inp = { value: inpVal };

  const out: PSIResult = {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
    cwv,
    raw: json,
  };

  return out;
}

export async function getPageSpeed(url: string, apiKey: string) {
  const [mobile, desktop] = await Promise.all([
    fetchStrategy(url, "mobile", apiKey).catch((e) => ({ error: (e as Error).message } as unknown)),
    fetchStrategy(url, "desktop", apiKey).catch((e) => ({ error: (e as Error).message } as unknown)),
  ]);

  return { mobile, desktop } as { mobile: PSIResult | { error: string }; desktop: PSIResult | { error: string } };
}
