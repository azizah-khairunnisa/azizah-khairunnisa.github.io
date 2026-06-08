import { useState, useEffect } from "react";
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

const DEMO_FILES: PortfolioFile[] = [
  {
    id: 1,
    file_name: "opsguard-monitor.png",
    file_url: "https://placehold.co/600x400/0f172a/ffffff?text=OpsGuard+Monitor",
    file_type: "image/png",
    title: "OpsGuard Monitor",
    description: "Infrastructure Monitoring Agent — real-time server monitoring dashboard built with Python.",
    created_at: "2026-06-01T00:00:00Z",
  },
  {
    id: 2,
    file_name: "openclaw-osint-suite.png",
    file_url: "https://placehold.co/600x400/1e293b/ffffff?text=OSINT+Suite",
    file_type: "image/png",
    title: "OpenClaw OSINT Suite",
    description: "One-click installer for OpenClaw + OSINT tools (SpiderFoot, SearXNG, Maigret, Sherlock, theHarvester, Amass, Subfinder).",
    created_at: "2026-06-02T00:00:00Z",
  },
  {
    id: 3,
    file_name: "termux-hacklab.png",
    file_url: "https://placehold.co/600x400/334155/ffffff?text=Termux+HackLab",
    file_type: "image/png",
    title: "Termux HackLab",
    description: "Turn your Android into a GPU-accelerated Linux hacking lab. XFCE Desktop + Nmap, SQLMap, Hydra & more. No root required.",
    created_at: "2026-06-03T00:00:00Z",
  },
  {
    id: 4,
    file_name: "subfinder.png",
    file_url: "https://placehold.co/600x400/475569/ffffff?text=Subfinder",
    file_type: "image/png",
    title: "Subfinder",
    description: "Fast passive subdomain enumeration tool — forked from ProjectDiscovery.",
    created_at: "2026-06-04T00:00:00Z",
  },
  {
    id: 5,
    file_name: "httprobe.png",
    file_url: "https://placehold.co/600x400/64748b/ffffff?text=httprobe",
    file_type: "image/png",
    title: "httprobe",
    description: "Take a list of domains and probe for working HTTP and HTTPS servers — forked from tomnomnom.",
    created_at: "2026-06-05T00:00:00Z",
  },
  {
    id: 6,
    file_name: "gau.png",
    file_url: "https://placehold.co/600x400/94a3b8/0f172a?text=gau",
    file_type: "image/png",
    title: "gau (Get All URLs)",
    description: "Fetch known URLs from AlienVault OTX, Wayback Machine, and Common Crawl — forked from lc.",
    created_at: "2026-06-06T00:00:00Z",
  },
];

const spinKeyframes = "@keyframes spin { to { transform: rotate(360deg); } }";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner" />
        <p>Loading portfolio...</p>
      </div>
      <style>{spinKeyframes}</style>
    </div>
  );
}

function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="error-screen">
      <div className="error-content">
        <p className="error-emoji">🔌</p>
        <h2>Cannot connect to database</h2>
        <p className="error-msg">{error}</p>
        <p className="error-hint">
          Make sure the Supabase table <code>portfolio_files</code> exists and is publicly readable.
        </p>
      </div>
    </div>
  );
}

function FileCard({ file }: { file: PortfolioFile }) {
  return (
    <div className="file-card">
      {file.file_type?.startsWith("image/") ? (
        <img src={file.file_url} alt={file.title || file.file_name} />
      ) : (
        <div className="file-placeholder">📄</div>
      )}
      <div className="file-info">
        <h4>{file.title || file.file_name}</h4>
        {file.description && <p>{file.description}</p>}
        <span className="file-type">{file.file_type}</span>
      </div>
    </div>
  );
}

function App() {
  const [files, setFiles] = useState<PortfolioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("portfolio_files")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setFiles(DEMO_FILES);
        } else {
          setFiles(data || []);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingScreen />;
  if (error && files.length === 0) return <ErrorScreen error={error} />;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div>
            <h1 className="name">Azizah Khairunnisa</h1>
            <p className="subtitle">Portfolio</p>
          </div>
          <nav className="nav">
            <a href="#portfolio">Portfolio</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Demo Banner */}
      {error && files.length > 0 && (
        <div className="demo-banner">⚠️ Supabase not connected — showing demo data</div>
      )}

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-avatar">👩‍💼</div>
          <h2 className="hero-title">Hi, I'm Azizah</h2>
          <p className="hero-desc">Welcome to my portfolio. Below are my works and projects.</p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="portfolio-section">
        <h3 className="section-title">📁 My Works</h3>
        {files.length === 0 ? (
          <div className="empty-state">
            <p className="empty-emoji">📂</p>
            <p>No portfolio items yet.</p>
            <p className="empty-hint">Upload files via Supabase to get started.</p>
          </div>
        ) : (
          <div className="file-grid">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="about-section">
        <div className="section-inner">
          <h3 className="section-title">👩‍💻 About Me</h3>
          <p className="about-text">
            Azizah Khairunnisa — a passionate professional building meaningful work.
            This portfolio showcases my projects, skills, and creative endeavors.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <h3 className="section-title">📬 Get In Touch</h3>
        <p className="contact-desc">Feel free to reach out for collaborations or just a hello!</p>
        <a href="mailto:azizah@example.com" className="contact-btn">Say Hello 👋</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} Azizah Khairunnisa. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
