import { render, screen } from "@testing-library/react";
import StatusBreakdown from "./status-breakdown";

describe("StatusBreakdown", () => {
  it("shows the count and computed percentage for each status", () => {
    render(
      <StatusBreakdown
        counts={{ open: 3, in_progress: 1, resolved: 4, closed: 2 }}
        total={10}
      />
    );

    expect(screen.getByTitle("Open: 3 (30%)")).toBeInTheDocument();
    expect(screen.getByTitle("In progress: 1 (10%)")).toBeInTheDocument();
    expect(screen.getByTitle("Resolved: 4 (40%)")).toBeInTheDocument();
    expect(screen.getByTitle("Closed: 2 (20%)")).toBeInTheDocument();
  });

  it("renders zero-percent bars without dividing by zero", () => {
    render(
      <StatusBreakdown
        counts={{ open: 0, in_progress: 0, resolved: 0, closed: 0 }}
        total={0}
      />
    );
    expect(screen.getByTitle("Open: 0 (0%)")).toBeInTheDocument();
  });
});
