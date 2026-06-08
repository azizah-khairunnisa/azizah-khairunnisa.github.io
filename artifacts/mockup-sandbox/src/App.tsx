import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

interface PortfolioFile {
  id: number;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  featured: boolean;
  download_count: number;
  created_at: string;
}

function App() {
  const [files, setFiles] = useState<PortfolioFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase
        .from("portfolio_files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching files:", error);
      } else {
        setFiles(data || []);
      }
      setLoading(false);
    }
    fetchFiles();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return "📄";
      case "doc": return "📝";
      case "spreadsheet": return "📊";
      case "presentation": return "📽️";
      case "image": return "🖼️";
      case "video": return "🎬";
      case "audio": return "🎵";
      case "archive": return "📦";
      default: return "📁";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Azizah Khairunnisa
          </h1>
          <p className="text-slate-500 mt-1">Portfolio & Work Samples</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500">Loading...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📂</p>
            <h2 className="text-xl font-semibold text-slate-700">
              No files yet
            </h2>
            <p className="text-slate-400 mt-2">
              Portfolio files will appear here once uploaded.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{getFileIcon(file.file_type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {file.title}
                    </h3>
                    {file.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                        {file.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                      <span className="capitalize">{file.file_type}</span>
                      {file.download_count > 0 && (
                        <span>⬇ {file.download_count}</span>
                      )}
                      {file.featured && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Azizah Khairunnisa. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
