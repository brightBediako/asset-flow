import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { login } from "../features/auth/auth.api";
import { useToast } from "../components/ui/useToast";
import { getPostLoginPath, setAuth } from "../lib/auth";
import { getErrorMessage } from "../lib/errors";

export function LoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const registered = searchParams.get("registered") === "1";
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
      setAuth({ id: user.id, email: user.email, fullName: user.fullName, role: user.role?.name });
      showToast({ message: `Welcome back, ${user.fullName || user.email}.`, tone: "success" });
      navigate(redirect || getPostLoginPath(user.role?.name));
    } catch (submitError) {
      const message = getErrorMessage(submitError, "Invalid credentials.");
      setError(message);
      showToast({ message, tone: "error" });
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
          {registered && <p className="success">Account created. Please sign in.</p>}
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            <span>Password</span>
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
