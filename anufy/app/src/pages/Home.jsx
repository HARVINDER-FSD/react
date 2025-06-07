import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Anufy</h1>
          <p>Welcome to your social platform</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Link
            to="/login"
            className="auth-button"
            style={{ textAlign: "center", textDecoration: "none", display: "block" }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="auth-button"
            style={{
              textAlign: "center",
              textDecoration: "none",
              display: "block",
              background: "transparent",
              color: "#667eea",
              border: "2px solid #667eea",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
