import { render, screen } from "@testing-library/react";
import TicketItem from "./ticket-item";
import Ticket from "@/lib/model/Ticket";

const push = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const mockUseAuthUser = jest.fn();
jest.mock("@/app/hooks/use-auth-user", () => ({
  __esModule: true,
  default: () => mockUseAuthUser(),
}));

jest.mock("@/lib/ticketAction", () => ({
  handleTicketDelete: jest.fn(),
}));

const ticket: Ticket = {
  TicketId: "1",
  Subject: "Cannot log in",
  Description: "User sees a blank screen",
  Status: "open",
  Priority: "high",
  AssignedTo: "agent@example.com",
  Attachments: [],
  CreatedAt: "2024-01-01T00:00:00.000Z",
  UpdatedAt: "2024-01-01T00:00:00.000Z",
};

beforeEach(() => {
  push.mockReset();
});

describe("TicketItem", () => {
  it("hides the delete button for a non-admin user", () => {
    mockUseAuthUser.mockReturnValue({ isAdmin: false });
    render(<TicketItem ticket={ticket} />);

    expect(screen.queryByRole("button", { name: "Delete ticket" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit ticket" })).toBeInTheDocument();
  });

  it("shows the delete button for an admin user", () => {
    mockUseAuthUser.mockReturnValue({ isAdmin: true });
    render(<TicketItem ticket={ticket} />);

    expect(screen.getByRole("button", { name: "Delete ticket" })).toBeInTheDocument();
  });

  it("renders the ticket's status and priority badges", () => {
    mockUseAuthUser.mockReturnValue({ isAdmin: false });
    render(<TicketItem ticket={ticket} />);

    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
