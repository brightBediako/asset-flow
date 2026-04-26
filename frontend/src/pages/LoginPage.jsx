import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { login } from "../features/auth/auth.api";
import { setAuth } from "../lib/auth";
import { getErrorMessage } from "../lib/errors";

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const user = await login({ email, password });
      setAuth({ email: user.email, fullName: user.fullName, role: user.role?.name });
      navigate(redirect || "/app");
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Invalid credentials."));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PublicHeader />
      <div className="auth-wrap">
        <form className="card" onSubmit={onSubmit}>
          <h2>Sign in</h2>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
          <p>
            No account yet? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </>
  );
}
