import { useState } from "react";
import { supabase } from "./lib/supabase";

interface PortfolioFile {
  id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  title: string | null;
  description: string | null;
  created_at: string;
}

function App() {
  const [files, setFiles] = useState<PortfolioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    supabase
      .from("portfolio_files")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        setFiles(data || []);
        setLoading(false);
      });
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "4px solid #e2e8f0", borderTop: "4px solid #0f172a", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", margin: 0 }}>Loading portfolio...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: "center", padding: 40, maxWidth: 500 }}>
          <p style={{ fontSize: 48, margin: "0 0 16px" }}>🔌</p>
          <h2 style={{ fontSize: 20, color: "#1e293b", margin: "0 0 8px" }}>Cannot connect to database</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 16px" }}>{error}</p>
          <p style={{ color: "#94a3b8", fontSize: 12 }}>Make sure the Supabase table <code style={{ background: "#f1f5f9", padding: 2 }}>portfolio_files</code> exists and is publicly readable.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
              Azizah Khairunnisa
            </h1>
            <p style={{ color: "#64748b", margin: "2px 0 0", fontSize: 13 }}>Portfolio</p>
          </div>
          <nav style={{ display: "flex", gap: 24 }}>
            <a href="#portfolio" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Portfolio</a>
            <a href="#about" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>About</a>
            <a href="#contact" style={{ color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#fff", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>
            👩‍💼
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>Hi, I'm Azizah</h2>
          <p style={{ fontSize: 18, color: "#94a3b8", margin: "0 0 32px", lineHeight: 1.6 }}>
            Welcome to my portfolio. Below are my works and projects.
          </p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px" }}>
        <h3 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", margin: "0 0 32px", fontFamily: "'Poppins', sans-serif" }}>
          📁 My Works
        </h3>

        {files.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: 48, margin: "0 0 16px" }}>📂</p>
            <p style={{ color: "#64748b", margin: 0, fontSize: 16 }}>No portfolio items yet.</p>
            <p style={{ color: "#94a3b8", margin: "8px 0 0", fontSize: 13 }}>Upload files via Supabase to get started.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {files.map((file) => (
              <div key={file.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "transform 0.2s", cursor: "pointer" }}>
                {file.file_type?.startsWith("image/") ? (
                  <img src={file.file_url} alt={file.title || file.file_name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: 200, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                    📄
                  </div>
                )}
                <div style={{ padding: 20 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>{file.title || file.file_name}</h4>
                  {file.description && (
                    <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 12px", lineHeight: 1.5 }}>{file.description}</p>
                  )}
                  <span style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "4px 10px", borderRadius: 999 }}>
                    {file.file_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" style={{ background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px" }}>
          <h3 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", margin: "0 0 16px", fontFamily: "'Poppins', sans-serif" }}>
            👩‍💻 About Me
          </h3>
          <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15, maxWidth: 600 }}>
            Azizah Khairunnisa — a passionate professional building meaningful work. 
            This portfolio showcases my projects, skills, and creative endeavors.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" style={{ borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 32px", textAlign: "center" }}>
          <h3 style={{ fontSize: 22, fontWeight: 600, color: "#0f172a", margin: "0 0 8px", fontFamily: "'Poppins', sans-serif" }}>
            📬 Get In Touch
          </h3>
          <p style={{ color: "#64748b", margin: "0 0 24px" }}>Feel free to reach out for collaborations or just a hello!</p>
          <a href="mailto:azizah@example.com" style={{ display: "inline-block", padding: "12px 32px", background: "#0f172a", color: "#fff", borderRadius: 8, textDecoration: "none", fontWeight: 500, fontSize: 14 }}>
            Say Hello 👋
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e2e8f0", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
          © {new Date().getFullYear()} Azizah Khairunnisa. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
