import type { AnalyzeResult, PSIResult } from "@/types";
import { getPageSpeed } from "@/lib/pagespeed";
import { analyzeOnPage } from "@/lib/onpage";

function validateUrl(input: unknown): string {
  if (typeof input !== "string") throw new Error("Invalid URL");
  try {
    // allow users to omit protocol by assuming https
    const tryUrl = input.match(/^https?:\/\//i) ? input : `https://${input}`;
    const u = new URL(tryUrl);
    if (!u.protocol.startsWith("http")) throw new Error("Invalid protocol");
    return u.toString();
  } catch (e) {
    throw new Error("Invalid URL");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = validateUrl(body?.url);

    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

    // Run on-page analysis always. PageSpeed is optional (requires API key).
    const onpagePromise = analyzeOnPage(url);
    let psi: { mobile: unknown; desktop: unknown } = { mobile: { error: "missing" }, desktop: { error: "missing" } };

    if (apiKey) {
      try {
        psi = await getPageSpeed(url, apiKey);
      } catch (e) {
        // swallow and keep error markers — we'll map them below
        psi = { mobile: { error: (e as Error).message }, desktop: { error: (e as Error).message } };
      }
    }

    const onpage = await onpagePromise;

    function isPSI(x: unknown): x is PSIResult {
      return (
        typeof x === "object" &&
        x !== null &&
        (Object.prototype.hasOwnProperty.call(x, "performance") || Object.prototype.hasOwnProperty.call(x, "seo"))
      );
    }

    const psiMobileSeo = isPSI(psi.mobile) ? psi.mobile.seo ?? 0 : 0;
    const psiDesktopSeo = isPSI(psi.desktop) ? psi.desktop.seo ?? 0 : 0;
    const onpageScore = onpage.score ?? 0;
    const seoScore = Math.round((psiMobileSeo * 0.6) + (onpageScore * 0.4));

    const result: AnalyzeResult = {
      url,
      psi: {
        mobile: (isPSI(psi.mobile) ? (psi.mobile as PSIResult) : { performance: 0, seo: 0, accessibility: 0, bestPractices: 0, cwv: {} }),
        desktop: (isPSI(psi.desktop) ? (psi.desktop as PSIResult) : { performance: 0, seo: 0, accessibility: 0, bestPractices: 0, cwv: {} }),
      },
      onpage,
      seoScore,
    };

    return new Response(JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}
