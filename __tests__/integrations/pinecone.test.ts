import { createPineconeClient } from "@/lib/pinecone";

describe("pinecone integration", () => {
  it("connects to pinecone with valid API key", async () => {
    const client = await createPineconeClient();
    expect(client).toBeDefined();
  });
});
