import { render, screen } from "@testing-library/react";
import ChatWindow from "@/components/ChatWindow";

describe("ChatWindow", () => {
  it("renders initial welcome message", () => {
    render(<ChatWindow />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("shows a placeholder when empty", () => {
    render(<ChatWindow />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });
});
