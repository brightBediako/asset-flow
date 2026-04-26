import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppHomePage } from "./AppHomePage";

const mockIsAdminRole = vi.fn();

vi.mock("./DashboardPage", () => ({
  DashboardPage: () => <div>Dashboard Content</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Navigate: ({ to }) => <div>REDIRECT:{to}</div>,
  };
});

vi.mock("../lib/auth", () => ({
  isAdminRole: () => mockIsAdminRole(),
}));

describe("AppHomePage", () => {
  it("shows dashboard for admin users", () => {
    mockIsAdminRole.mockReturnValueOnce(true);
    render(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });

  it("redirects normal users to profile", () => {
    mockIsAdminRole.mockReturnValueOnce(false);
    render(
      <MemoryRouter>
        <AppHomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText("REDIRECT:/app/profile")).toBeInTheDocument();
  });
});
