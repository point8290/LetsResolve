import { render, screen } from "@testing-library/react";
import EmptyText from "./emptyText";

describe("EmptyText", () => {
  it("renders the given text", () => {
    render(<EmptyText text="No Tickets" />);
    expect(screen.getByText("No Tickets")).toBeInTheDocument();
  });
});
