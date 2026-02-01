import AnalyzerApp from "@/components/AnalyzerApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <AnalyzerApp />
      </div>
    </main>
  );
}
