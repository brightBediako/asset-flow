import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RegisterPage } from "./RegisterPage";

const mockNavigate = vi.fn();
const mockRegisterUser = vi.fn();
const mockShowToast = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../features/auth/auth.api", () => ({
  registerUser: (...args) => mockRegisterUser(...args),
}));

vi.mock("../components/ui/useToast", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  it("shows organization name input when Organization is selected", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    expect(screen.queryByLabelText("Organization Name")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Organization" }));

    expect(screen.getByLabelText("Organization Name")).toBeInTheDocument();
  });

  it("submits organization registration payload and redirects to login", async () => {
    const user = userEvent.setup();
    mockRegisterUser.mockResolvedValueOnce({ id: 1 });
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Organization" }));
    await user.type(screen.getByLabelText("Full Name"), "Org Owner");
    await user.type(screen.getByLabelText("Organization Name"), "Acme Org");
    await user.type(screen.getByLabelText("Email"), "OWNER@ACME.COM");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(mockRegisterUser).toHaveBeenCalledWith({
      accountType: "ORGANIZATION",
      fullName: "Org Owner",
      organizationName: "Acme Org",
      email: "owner@acme.com",
      password: "password123",
    });
    expect(mockNavigate).toHaveBeenCalledWith("/login?registered=1");
  });
});
