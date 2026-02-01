import { parse } from "node-html-parser";
import type { OnPageReport } from "@/types";

function scoreFromChecks(checks: boolean[], weight = 100) {
  if (checks.length === 0) return weight;
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * weight);
}

export async function analyzeOnPage(url: string): Promise<OnPageReport> {
  const res = await fetch(url, { headers: { "User-Agent": "seo-analyzer-bot/1.0 (+https://example.com)" }, redirect: "follow" });
  const text = await res.text();
  const root = parse(text);

  const titleEl = root.querySelector("title");
  const title = titleEl?.text?.trim();
  const titleLength = title ? title.length : 0;

  const metaDesc = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? undefined;
  const metaDescLength = metaDesc ? metaDesc.length : 0;

  const h1s = root.querySelectorAll("h1");
  const h2s = root.querySelectorAll("h2");

  const imgs = root.querySelectorAll("img").map((i) => ({ src: i.getAttribute("src") ?? undefined, alt: i.getAttribute("alt") ?? undefined }));
  const imagesMissingAlt = imgs.filter((i) => !i.alt || i.alt.trim() === "");

  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null;

  const ogTags: Record<string, string> = {};
  root.querySelectorAll('meta[property^="og:"]').forEach((m) => {
    const prop = m.getAttribute("property");
    const content = m.getAttribute("content");
    if (prop && content) ogTags[prop] = content;
  });

  const recommendations: string[] = [];
  const checks: boolean[] = [];

  if (!title) recommendations.push("Add a descriptive title tag (50-60 chars recommended).");
  checks.push(Boolean(title && titleLength >= 10 && titleLength <= 70));

  if (!metaDesc) recommendations.push("Add a meta description (120-160 chars recommended).");
  checks.push(Boolean(metaDesc && metaDescLength >= 50 && metaDescLength <= 320));

  if (h1s.length === 0) recommendations.push("Add an H1 tag for the page");
  if (h1s.length > 1) recommendations.push("Consider limiting to a single H1 tag");
  checks.push(h1s.length === 1);

  if (h2s.length === 0) recommendations.push("Add H2 sections to improve content structure");
  checks.push(h2s.length >= 1);

  if (imagesMissingAlt.length > 0) recommendations.push(`Add alt attributes to ${imagesMissingAlt.length} images.`);
  checks.push(imagesMissingAlt.length === 0);

  if (!canonical) recommendations.push("Add a canonical link tag to avoid duplicate content issues.");
  checks.push(Boolean(canonical));

  if (!robots) recommendations.push("Add a robots meta tag if you need custom indexing directives.");
  checks.push(Boolean(robots));

  if (Object.keys(ogTags).length === 0) recommendations.push("Add Open Graph tags for better social sharing.");
  checks.push(Object.keys(ogTags).length > 0);

  const score = scoreFromChecks(checks, 100);

  const report: OnPageReport = {
    title,
    titleLength,
    metaDescription: metaDesc,
    metaDescriptionLength: metaDescLength,
    h1Count: h1s.length,
    h2Count: h2s.length,
    imagesMissingAlt,
    canonical,
    robots,
    openGraph: ogTags,
    score,
    recommendations,
  };

  return report;
}
