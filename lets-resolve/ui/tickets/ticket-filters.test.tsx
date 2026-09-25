import { render, screen } from "@testing-library/react";
import TicketFilters from "./ticket-filters";

describe("TicketFilters", () => {
  it("links 'All' to the unfiltered tickets list", () => {
    render(<TicketFilters activeStatus={undefined} />);
    expect(screen.getByText("All")).toHaveAttribute("href", "/dashboard/tickets");
  });

  it("links each status to its filtered URL", () => {
    render(<TicketFilters activeStatus="open" />);
    expect(screen.getByText("Open")).toHaveAttribute(
      "href",
      "/dashboard/tickets?status=open"
    );
    expect(screen.getByText("Resolved")).toHaveAttribute(
      "href",
      "/dashboard/tickets?status=resolved"
    );
  });
});
