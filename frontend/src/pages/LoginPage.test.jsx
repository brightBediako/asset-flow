import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockSetAuth = vi.fn();
const mockShowToast = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams("")],
  };
});

vi.mock("../features/auth/auth.api", () => ({
  login: (...args) => mockLogin(...args),
}));

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual("../lib/auth");
  return {
    ...actual,
    setAuth: (...args) => mockSetAuth(...args),
  };
});

vi.mock("../components/ui/useToast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("redirects USER role to profile page", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({
      id: 10,
      email: "user@test.com",
      fullName: "User Name",
      role: { name: "USER" },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Email"), "user@test.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockSetAuth).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/app/profile");
  });

  it("redirects ORG_ADMIN role to dashboard", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({
      id: 11,
      email: "org@test.com",
      fullName: "Org Admin",
      role: { name: "ORG_ADMIN" },
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    await user.type(screen.getByLabelText("Email"), "org@test.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(mockNavigate).toHaveBeenCalledWith("/app");
  });
});
