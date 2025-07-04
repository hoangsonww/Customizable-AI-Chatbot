import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders chatbot title", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /customizable ai chatbot/i })).toBeInTheDocument();
  });
});
