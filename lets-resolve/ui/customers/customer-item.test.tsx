import { render, screen } from "@testing-library/react";
import CustomerItem from "./customer-item";
import Customer from "@/lib/model/Customer";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockUseAuthUser = jest.fn();
jest.mock("@/app/hooks/use-auth-user", () => ({
  __esModule: true,
  default: () => mockUseAuthUser(),
}));

jest.mock("@/lib/customerAction", () => ({
  handleCustomerDelete: jest.fn(),
}));

const customer: Customer = {
  CustomerId: "c1",
  Name: "Acme Inc",
  Domain: "acme.com",
  CreatedAt: "2024-01-01T00:00:00.000Z",
  UpdatedAt: "2024-01-01T00:00:00.000Z",
};

describe("CustomerItem", () => {
  it("hides the delete button for a non-admin user", () => {
    mockUseAuthUser.mockReturnValue({ isAdmin: false });
    render(<CustomerItem customer={customer} />);

    expect(screen.queryByRole("button", { name: "Delete customer" })).not.toBeInTheDocument();
  });

  it("shows the delete button for an admin user", () => {
    mockUseAuthUser.mockReturnValue({ isAdmin: true });
    render(<CustomerItem customer={customer} />);

    expect(screen.getByRole("button", { name: "Delete customer" })).toBeInTheDocument();
  });

  it("renders the customer name and domain", () => {
    mockUseAuthUser.mockReturnValue({ isAdmin: false });
    render(<CustomerItem customer={customer} />);

    expect(screen.getByText("Acme Inc")).toBeInTheDocument();
    expect(screen.getByText("acme.com")).toBeInTheDocument();
  });
});
