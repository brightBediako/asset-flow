import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { registerUser } from "../features/auth/auth.api";
import { getErrorMessage } from "../lib/errors";

export function RegisterPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("USER");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (accountType === "ORGANIZATION" && !organizationName.trim()) {
        setError("Organization name is required.");
        return;
      }
      await registerUser({
        accountType,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        organizationName: accountType === "ORGANIZATION" ? organizationName.trim() : undefined,
      });
      navigate("/login?registered=1");
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Registration failed."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PublicHeader />
      <div className="auth-wrap">
        <form className="card" onSubmit={onSubmit}>
          <h2>Create account</h2>
          <div className="auth-switcher">
            <button
              type="button"
              className={accountType === "USER" ? "active" : ""}
              onClick={() => setAccountType("USER")}
            >
              User
            </button>
            <button
              type="button"
              className={accountType === "ORGANIZATION" ? "active" : ""}
              onClick={() => setAccountType("ORGANIZATION")}
            >
              Organization
            </button>
          </div>
          <label>
            <span>Full Name</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
          {accountType === "ORGANIZATION" && (
            <label>
              <span>Organization Name</span>
              <input
                value={organizationName}
                onChange={(event) => setOrganizationName(event.target.value)}
                required
              />
            </label>
          )}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </>
  );
}
