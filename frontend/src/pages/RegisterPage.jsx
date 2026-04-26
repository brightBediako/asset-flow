import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PublicHeader } from "../components/layout/PublicHeader";
import { useRolesQuery } from "../features/roles/roles.hooks";
import { registerUser } from "../features/auth/auth.api";
import { getErrorMessage } from "../lib/errors";

export function RegisterPage() {
  const navigate = useNavigate();
  const { data: roles = [] } = useRolesQuery();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const userRole = roles.find((role) => role.name === "USER") || roles[0];
      if (!userRole?.id) {
        setError("Roles are not loaded yet. Please try again.");
        return;
      }

      await registerUser({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        roleId: userRole.id,
        organizationId: organizationId ? Number(organizationId) : undefined,
      });
      navigate("/login");
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
          <label>
            Full Name
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>
          <label>
            Organization ID (optional)
            <input
              value={organizationId}
              onChange={(event) => setOrganizationId(event.target.value)}
              inputMode="numeric"
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
