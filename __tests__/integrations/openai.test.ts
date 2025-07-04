import { openai } from "@/lib/openai";

describe("openai integration", () => {
  it("should create a completion with valid input", async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "test message" }],
    });
    expect(response).toBeDefined();
    expect(response.choices[0].message).toBeTruthy();
  });
});
