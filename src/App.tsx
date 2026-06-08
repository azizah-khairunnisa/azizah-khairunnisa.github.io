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

function getFileIcon(type: string) {
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

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            Azizah Khairunnisa
          </h1>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 15 }}>Portfolio & Work Samples</p>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#64748b" }}>
            <p>Loading...</p>
          </div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>📂</p>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#334155", margin: 0 }}>No files yet</h2>
            <p style={{ color: "#94a3b8", marginTop: 8 }}>Portfolio files will appear here once uploaded.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {files.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  background: "#fff",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  padding: 20,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "#cbd5e1"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{getFileIcon(file.file_type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontWeight: 600, color: "#1e293b", margin: "0 0 4px", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.title}
                    </h3>
                    {file.description && (
                      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {file.description}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#94a3b8" }}>
                      <span style={{ textTransform: "capitalize" }}>{file.file_type}</span>
                      {file.download_count > 0 && <span>⬇ {file.download_count}</span>}
                      {file.featured && (
                        <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 99, fontSize: 11 }}>⭐ Featured</span>
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
      <footer style={{ borderTop: "1px solid #e2e8f0", marginTop: 60 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
          © {new Date().getFullYear()} Azizah Khairunnisa. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
