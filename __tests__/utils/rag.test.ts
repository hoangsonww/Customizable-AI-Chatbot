import { summarizeDocument } from "@/lib/rag";

describe("summarizeDocument", () => {
  it("summarizes text correctly", () => {
    const text = "This is a test document about AI.";
    const summary = summarizeDocument(text);
    expect(summary).toMatch(/ai/i);
  });
});
