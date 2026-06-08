import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", fontFamily: "'Inter', sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: 0, fontFamily: "'Poppins', sans-serif" }}>
            Azizah Khairunnisa
          </h1>
          <p style={{ color: "#64748b", marginTop: 4, fontSize: 15 }}>Portfolio & Work Samples</p>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px 32px" }}>
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: 48, margin: "0 0 16px" }}>🚀</p>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#334155", margin: 0 }}>Portfolio Coming Soon</h2>
          <p style={{ color: "#94a3b8", marginTop: 8 }}>This site is under construction.</p>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{ marginTop: 24, padding: "12px 24px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14 }}
          >
            Clicked {count} times
          </button>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #e2e8f0", marginTop: 60 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 32px", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
          © {new Date().getFullYear()} Azizah Khairunnisa. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
