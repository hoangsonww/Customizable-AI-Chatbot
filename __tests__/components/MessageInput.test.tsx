import { render, screen, fireEvent } from "@testing-library/react";
import MessageInput from "@/components/MessageInput";

describe("MessageInput", () => {
  it("renders input field", () => {
    render(<MessageInput onSend={() => {}} />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  it("triggers onSend callback on submit", () => {
    const mockSend = jest.fn();
    render(<MessageInput onSend={mockSend} />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockSend).toHaveBeenCalledWith("Hello");
  });
});
