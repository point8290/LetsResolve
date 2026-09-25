import { render, screen } from "@testing-library/react";
import { PriorityBadge, StatusBadge } from "./ticket-badges";

describe("StatusBadge", () => {
  it.each([
    ["open", "Open"],
    ["in_progress", "In progress"],
    ["resolved", "Resolved"],
    ["closed", "Closed"],
  ] as const)("renders the %s status as %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe("PriorityBadge", () => {
  it.each([
    ["low", "Low"],
    ["medium", "Medium"],
    ["high", "High"],
    ["urgent", "Urgent"],
  ] as const)("renders the %s priority as %s", (priority, label) => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
