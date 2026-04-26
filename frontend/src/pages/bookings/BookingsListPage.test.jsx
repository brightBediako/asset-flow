import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { BookingsListPage } from "./BookingsListPage";

const mockIsAdminRole = vi.fn();
const mockGetCurrentUserId = vi.fn();

vi.mock("../../lib/auth", async () => {
  const actual = await vi.importActual("../../lib/auth");
  return {
    ...actual,
    isAdminRole: () => mockIsAdminRole(),
    getCurrentUserId: () => mockGetCurrentUserId(),
  };
});

vi.mock("../../features/bookings/bookings.hooks", () => ({
  useBookingSearchQuery: () => ({
    data: { content: [], number: 0, totalPages: 1 },
    isLoading: false,
    isError: false,
    error: null,
  }),
  useDeleteBookingMutation: () => ({
    isError: false,
    isPending: false,
    mutateAsync: vi.fn(),
  }),
}));

vi.mock("../../features/organizations/organizations.hooks", () => ({
  useOrganizationsQuery: () => ({
    data: [{ id: 1, name: "Org One" }],
  }),
}));

describe("BookingsListPage role UX", () => {
  it("hides organization filter for normal USER", () => {
    mockIsAdminRole.mockReturnValueOnce(false);
    mockGetCurrentUserId.mockReturnValueOnce(10);
    render(
      <MemoryRouter>
        <BookingsListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("My Bookings")).toBeInTheDocument();
    expect(screen.queryByText("All organizations")).not.toBeInTheDocument();
  });

  it("shows organization filter for admin", () => {
    mockIsAdminRole.mockReturnValueOnce(true);
    mockGetCurrentUserId.mockReturnValueOnce(1);
    render(
      <MemoryRouter>
        <BookingsListPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Bookings")).toBeInTheDocument();
    expect(screen.getByText("All organizations")).toBeInTheDocument();
  });
});
